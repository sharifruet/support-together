const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Topic = require("../models/Topic");
const SupportTeam = require("../models/SupportTeam");
const SupportSchedule = require("../models/SupportSchedule");
const { Op } = require("sequelize");
const { sendEmailWithTemplate } = require("./emailService");
const { 
    findMatchingSchedules: findMatchingSchedulesOptimized,
    findUserAtLevel,
    clearScheduleCache
} = require("./scheduleQueryService");

/**
 * Main function to process ticket assignments
 * Runs periodically to assign new tickets and handle escalations
 */
const processAssignments = async () => {
    console.log("Assignment Process started at: " + new Date().toISOString());
    try {
        await assignNewTickets();
        await handleEscalations();
        console.log("Assignment Process completed");
    } catch (error) {
        console.error("Error in assignment process:", error);
    }
};

/**
 * Assigns new tickets (status='Created') to support team members
 * based on support schedules and escalation levels
 */
const assignNewTickets = async () => {
    try {
        const tickets = await Ticket.findAll({
            where: { status: 'Created' }
        });

        console.log(`Found ${tickets.length} tickets to assign`);

        for (const ticket of tickets) {
            try {
                await assignTicket(ticket);
            } catch (error) {
                console.error(`Error assigning ticket ${ticket.code || ticket.id}:`, error);
                // Continue with next ticket even if one fails
            }
        }
    } catch (error) {
        console.error("Error in assignNewTickets:", error);
        throw error;
    }
};

/**
 * Assigns a single ticket to the appropriate support team member
 * @param {Ticket} ticket - The ticket to assign
 */
const assignTicket = async (ticket) => {
    // Get the topic for this ticket
    const topic = await Topic.findByPk(ticket.topicId);
    if (!topic) {
        console.error(`Topic not found for ticket ${ticket.id}`);
        return;
    }

    // Check if topic has a support team assigned
    if (!topic.supportTeamId) {
        console.warn(`Ticket ${ticket.code || ticket.id} has no support team assigned to its topic`);
        return;
    }

    // Get the support team with its members
    const supportTeam = await SupportTeam.findByPk(topic.supportTeamId, {
        include: [User]
    });

    if (!supportTeam || !supportTeam.Users || supportTeam.Users.length === 0) {
        console.warn(`Support team ${topic.supportTeamId} has no members for ticket ${ticket.code || ticket.id}`);
        return;
    }

    // Get current time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8); // Format: HH:MM:SS

    // Find matching support schedules for this team
    const matchingSchedules = await findMatchingSchedules(topic.supportTeamId, currentTime);

    if (!matchingSchedules || matchingSchedules.length === 0) {
        console.warn(`No matching support schedule found for ticket ${ticket.code || ticket.id} at time ${currentTime}`);
        // Try to assign to any available team member as fallback
        await assignFallback(ticket, supportTeam.Users);
        return;
    }

    // Try to assign based on escalation levels (L1 -> L2 -> L3)
    let assigned = false;
    for (const level of [1, 2, 3]) {
        const scheduleEntry = matchingSchedules.find(s => s.escalationLevel === level);
        // SupportSchedule belongsTo User, so access via User property (capitalized as Sequelize does)
        const user = scheduleEntry?.User || scheduleEntry?.user;
        if (scheduleEntry && user) {
            await assignTicketToUser(ticket, user, level);
            assigned = true;
            break;
        }
    }

    if (!assigned) {
        console.warn(`Could not assign ticket ${ticket.code || ticket.id} - no available users in matching schedules`);
        // Fallback to any team member
        await assignFallback(ticket, supportTeam.Users);
    }
};

/**
 * Finds support schedules that match the current time
 * Uses optimized query service with caching
 * @param {number} supportTeamId - The support team ID
 * @param {string} currentTime - Current time in HH:MM:SS format
 * @returns {Array} Array of matching support schedules with user data
 * 
 * Note: This assumes schedules don't span midnight (e.g., 22:00 to 02:00).
 * For schedules spanning midnight, additional logic would be needed.
 */
const findMatchingSchedules = async (supportTeamId, currentTime) => {
    // Use optimized query service with caching
    return await findMatchingSchedulesOptimized(supportTeamId, currentTime, {
        useCache: true,
        includeUser: true
    });
};

/**
 * Assigns a ticket to a specific user with the given escalation level
 * @param {Ticket} ticket - The ticket to assign
 * @param {User} user - The user to assign to
 * @param {number} level - Escalation level (1, 2, or 3)
 */
const assignTicketToUser = async (ticket, user, level) => {
    const assignmentStatus = `Assigned (L${level})`;
    const now = new Date();
    
    await ticket.update({
        assignedTo: user.id,
        assignmentStatus: assignmentStatus,
        status: 'Assigned',
        assignedAt: now, // Track when ticket was assigned
        acknowledgedAt: null // Reset acknowledgment when reassigned
    });

    console.log(`Assigned ticket ${ticket.code || ticket.id} to user ${user.name} (${user.email}) at level L${level}`);

    // Send email notification
    try {
        const placeholders = {
            code: ticket.code || `TICKET-${ticket.id}`,
            email: user.email,
            name: user.name,
            title: ticket.title
        };
        const templateId = 6; // Ticket assignment email template
        await sendEmailWithTemplate(templateId, user.email, placeholders);
    } catch (error) {
        console.error(`Error sending assignment email for ticket ${ticket.code || ticket.id}:`, error);
    }
};

/**
 * Fallback assignment when no schedule matches
 * Assigns to the first available team member at L1
 * @param {Ticket} ticket - The ticket to assign
 * @param {Array} users - Array of users in the support team
 */
const assignFallback = async (ticket, users) => {
    if (users && users.length > 0) {
        const firstUser = users[0];
        await assignTicketToUser(ticket, firstUser, 1);
        console.log(`Fallback assignment: Ticket ${ticket.code || ticket.id} assigned to ${firstUser.name}`);
    }
};

/**
 * Handles escalation of tickets that haven't been acknowledged
 * Escalates L1 -> L2 -> L3 based on time thresholds
 * Only escalates tickets with 'Assigned' status (not 'Acknowledged')
 * Also sends warning emails before escalation
 */
const handleEscalations = async () => {
    try {
        // Escalation thresholds (in minutes) - configurable via environment variables
        const L1_TO_L2_THRESHOLD = parseInt(process.env.ESCALATION_L1_TO_L2_MINUTES) || 30; // Default: 30 minutes
        const L2_TO_L3_THRESHOLD = parseInt(process.env.ESCALATION_L2_TO_L3_MINUTES) || 60; // Default: 60 minutes
        
        // Warning thresholds (send warning email before escalation)
        const L1_TO_L2_WARNING = L1_TO_L2_THRESHOLD - 10; // Warn 10 minutes before escalation
        const L2_TO_L3_WARNING = L2_TO_L3_THRESHOLD - 15; // Warn 15 minutes before escalation

        const now = new Date();
        
        // Send warnings for tickets approaching escalation
        await sendEscalationWarnings(L1_TO_L2_WARNING, L2_TO_L3_WARNING, now);

        // Find unacknowledged tickets that need escalation from L1 to L2
        // Only escalate tickets with 'Assigned' status (not 'Acknowledged')
        const l1Tickets = await Ticket.findAll({
            where: {
                assignmentStatus: 'Assigned (L1)',
                status: { [Op.in]: ['Assigned', 'In Progress'] },
                acknowledgedAt: null // Only escalate unacknowledged tickets
            }
        });

        console.log(`Checking ${l1Tickets.length} L1 tickets for escalation`);

        for (const ticket of l1Tickets) {
            // Use assignedAt if available, otherwise fall back to updatedAt
            const assignedTime = ticket.assignedAt ? new Date(ticket.assignedAt) : new Date(ticket.updatedAt);
            const minutesSinceAssignment = (now - assignedTime) / (1000 * 60);

            if (minutesSinceAssignment >= L1_TO_L2_THRESHOLD) {
                console.log(`Escalating ticket ${ticket.code || ticket.id} from L1 to L2 (${Math.round(minutesSinceAssignment)} minutes unacknowledged)`);
                await escalateTicket(ticket, 1, 2);
            }
        }

        // Find unacknowledged tickets that need escalation from L2 to L3
        const l2Tickets = await Ticket.findAll({
            where: {
                assignmentStatus: 'Assigned (L2)',
                status: { [Op.in]: ['Assigned', 'In Progress'] },
                acknowledgedAt: null // Only escalate unacknowledged tickets
            }
        });

        console.log(`Checking ${l2Tickets.length} L2 tickets for escalation`);

        for (const ticket of l2Tickets) {
            // Use assignedAt if available, otherwise fall back to updatedAt
            const assignedTime = ticket.assignedAt ? new Date(ticket.assignedAt) : new Date(ticket.updatedAt);
            const minutesSinceAssignment = (now - assignedTime) / (1000 * 60);

            if (minutesSinceAssignment >= L2_TO_L3_THRESHOLD) {
                console.log(`Escalating ticket ${ticket.code || ticket.id} from L2 to L3 (${Math.round(minutesSinceAssignment)} minutes unacknowledged)`);
                await escalateTicket(ticket, 2, 3);
            }
        }
    } catch (error) {
        console.error("Error in handleEscalations:", error);
    }
};

/**
 * Escalates a ticket from one level to the next
 * @param {Ticket} ticket - The ticket to escalate
 * @param {number} fromLevel - Current escalation level
 * @param {number} toLevel - Target escalation level
 */
const escalateTicket = async (ticket, fromLevel, toLevel) => {
    try {
        const topic = await Topic.findByPk(ticket.topicId);
        if (!topic || !topic.supportTeamId) {
            console.warn(`Cannot escalate ticket ${ticket.code || ticket.id} - no support team`);
            return;
        }

        // Get current time
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 8);

        // Find matching schedules
        const matchingSchedules = await findMatchingSchedules(topic.supportTeamId, currentTime);

        // Find user at the target escalation level
        const targetSchedule = matchingSchedules.find(s => s.escalationLevel === toLevel);
        const targetUser = targetSchedule?.User || targetSchedule?.user;
        
        if (targetSchedule && targetUser) {
            // Don't escalate if it's the same user
            if (ticket.assignedTo === targetUser.id) {
                console.log(`Ticket ${ticket.code || ticket.id} already assigned to user at L${toLevel}`);
                return;
            }

            const oldUser = await User.findByPk(ticket.assignedTo);
            await assignTicketToUser(ticket, targetUser, toLevel);
            
            console.log(`Escalated ticket ${ticket.code || ticket.id} from L${fromLevel} to L${toLevel}`);
            console.log(`  Previous assignee: ${oldUser ? oldUser.name : 'Unknown'}`);
            console.log(`  New assignee: ${targetUser.name}`);
            
            // Send escalation notification email to new assignee
            try {
                const placeholders = {
                    code: ticket.code || `TICKET-${ticket.id}`,
                    email: targetUser.email,
                    name: targetUser.name,
                    title: ticket.title,
                    previousAssignee: oldUser ? oldUser.name : 'Unknown',
                    escalationLevel: `L${toLevel}`
                };
                const templateId = 6; // Use same template as assignment (or create escalation-specific template)
                await sendEmailWithTemplate(templateId, targetUser.email, placeholders);
            } catch (error) {
                console.error(`Error sending escalation email for ticket ${ticket.code || ticket.id}:`, error);
            }
        } else {
            console.warn(`Cannot escalate ticket ${ticket.code || ticket.id} to L${toLevel} - no user available at that level`);
        }
    } catch (error) {
        console.error(`Error escalating ticket ${ticket.code || ticket.id}:`, error);
    }
};

/**
 * Sends warning emails to assignees for tickets approaching escalation thresholds
 * @param {number} l1WarningThreshold - Minutes before L1->L2 escalation to warn
 * @param {number} l2WarningThreshold - Minutes before L2->L3 escalation to warn
 * @param {Date} now - Current timestamp
 */
const sendEscalationWarnings = async (l1WarningThreshold, l2WarningThreshold, now) => {
    try {
        // Find L1 tickets approaching escalation threshold
        const l1Tickets = await Ticket.findAll({
            where: {
                assignmentStatus: 'Assigned (L1)',
                status: { [Op.in]: ['Assigned', 'In Progress'] },
                acknowledgedAt: null
            }
        });

        for (const ticket of l1Tickets) {
            const assignedTime = ticket.assignedAt ? new Date(ticket.assignedAt) : new Date(ticket.updatedAt);
            const minutesSinceAssignment = (now - assignedTime) / (1000 * 60);

            // Send warning if approaching threshold (within 1 minute window to avoid duplicate emails)
            if (minutesSinceAssignment >= l1WarningThreshold && minutesSinceAssignment < l1WarningThreshold + 1) {
                const assignedUser = await User.findByPk(ticket.assignedTo);
                if (assignedUser) {
                    try {
                        const placeholders = {
                            code: ticket.code || `TICKET-${ticket.id}`,
                            email: assignedUser.email,
                            name: assignedUser.name,
                            title: ticket.title,
                            minutesRemaining: Math.round(30 - minutesSinceAssignment)
                        };
                        // Use template ID 6 or create a new warning template
                        const templateId = 6; // TODO: Create escalation warning email template
                        await sendEmailWithTemplate(templateId, assignedUser.email, placeholders);
                        console.log(`Sent escalation warning for ticket ${ticket.code || ticket.id} to ${assignedUser.name}`);
                    } catch (error) {
                        console.error(`Error sending warning email for ticket ${ticket.code || ticket.id}:`, error);
                    }
                }
            }
        }

        // Find L2 tickets approaching escalation threshold
        const l2Tickets = await Ticket.findAll({
            where: {
                assignmentStatus: 'Assigned (L2)',
                status: { [Op.in]: ['Assigned', 'In Progress'] },
                acknowledgedAt: null
            }
        });

        for (const ticket of l2Tickets) {
            const assignedTime = ticket.assignedAt ? new Date(ticket.assignedAt) : new Date(ticket.updatedAt);
            const minutesSinceAssignment = (now - assignedTime) / (1000 * 60);

            // Send warning if approaching threshold
            if (minutesSinceAssignment >= l2WarningThreshold && minutesSinceAssignment < l2WarningThreshold + 1) {
                const assignedUser = await User.findByPk(ticket.assignedTo);
                if (assignedUser) {
                    try {
                        const placeholders = {
                            code: ticket.code || `TICKET-${ticket.id}`,
                            email: assignedUser.email,
                            name: assignedUser.name,
                            title: ticket.title,
                            minutesRemaining: Math.round(60 - minutesSinceAssignment)
                        };
                        const templateId = 6; // TODO: Create escalation warning email template
                        await sendEmailWithTemplate(templateId, assignedUser.email, placeholders);
                        console.log(`Sent escalation warning for ticket ${ticket.code || ticket.id} to ${assignedUser.name}`);
                    } catch (error) {
                        console.error(`Error sending warning email for ticket ${ticket.code || ticket.id}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in sendEscalationWarnings:", error);
    }
};

module.exports = { processAssignments }; 