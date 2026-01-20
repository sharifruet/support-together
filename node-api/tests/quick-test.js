/**
 * Quick Test Script for Assignment Logic
 * 
 * This script provides a simple way to verify assignment logic is working.
 * It checks the current state of tickets and reports on assignment status.
 * 
 * Usage: node tests/quick-test.js
 */

const Ticket = require('../models/Ticket');
const Topic = require('../models/Topic');
const User = require('../models/User');
const db = require('../db');

async function quickTest() {
    try {
        console.log('\n========================================');
        console.log('Quick Assignment Logic Test');
        console.log('========================================\n');

        // Connect to database
        await db.authenticate();
        console.log('✅ Database connected\n');

        // Check unassigned tickets
        const unassignedTickets = await Ticket.findAll({
            where: { status: 'Created' }
        });

        console.log(`📋 Unassigned Tickets: ${unassignedTickets.length}`);
        if (unassignedTickets.length > 0) {
            console.log('\nUnassigned Tickets:');
            for (const ticket of unassignedTickets) {
                const topic = await Topic.findByPk(ticket.topicId);
                console.log(`  - Ticket #${ticket.id}: ${ticket.title}`);
                console.log(`    Topic: ${topic ? topic.name : 'N/A'} (ID: ${ticket.topicId})`);
                console.log(`    Support Team ID: ${topic ? topic.supportTeamId || 'None' : 'N/A'}`);
                console.log(`    Created: ${ticket.createdAt}`);
            }
        }

        // Check assigned tickets
        const assignedTickets = await Ticket.findAll({
            where: {
                status: 'Assigned',
                assignmentStatus: { [db.Sequelize.Op.like]: 'Assigned%' }
            }
        });

        console.log(`\n✅ Assigned Tickets: ${assignedTickets.length}`);
        if (assignedTickets.length > 0) {
            console.log('\nAssigned Tickets:');
            for (const ticket of assignedTickets) {
                const user = ticket.assignedTo ? await User.findByPk(ticket.assignedTo) : null;
                const minutesAgo = ticket.assignedAt 
                    ? Math.round((new Date() - new Date(ticket.assignedAt)) / (1000 * 60))
                    : 'N/A';
                console.log(`  - Ticket #${ticket.id}: ${ticket.title}`);
                console.log(`    Status: ${ticket.assignmentStatus}`);
                console.log(`    Assigned to: ${user ? user.name : 'Unknown'} (ID: ${ticket.assignedTo})`);
                console.log(`    Assigned ${minutesAgo} minutes ago`);
                console.log(`    Acknowledged: ${ticket.acknowledgedAt ? 'Yes' : 'No'}`);
            }
        }

        // Check tickets approaching escalation
        const now = new Date();
        const approachingEscalation = await Ticket.findAll({
            where: {
                assignmentStatus: { [db.Sequelize.Op.like]: 'Assigned%' },
                acknowledgedAt: null,
                status: { [db.Sequelize.Op.in]: ['Assigned', 'In Progress'] }
            }
        });

        console.log(`\n⏱️  Tickets Approaching Escalation: ${approachingEscalation.length}`);
        if (approachingEscalation.length > 0) {
            console.log('\nTickets Approaching Escalation:');
            approachingEscalation.forEach(ticket => {
                if (ticket.assignedAt) {
                    const minutesSinceAssignment = Math.round(
                        (now - new Date(ticket.assignedAt)) / (1000 * 60)
                    );
                    const level = ticket.assignmentStatus.match(/L(\d)/)?.[1] || '?';
                    const threshold = level === '1' ? 30 : level === '2' ? 60 : 0;
                    const minutesRemaining = Math.max(0, threshold - minutesSinceAssignment);
                    
                    console.log(`  - Ticket #${ticket.id}: ${ticket.title}`);
                    console.log(`    Current Level: ${ticket.assignmentStatus}`);
                    console.log(`    Minutes since assignment: ${minutesSinceAssignment}`);
                    console.log(`    Minutes until escalation: ${minutesRemaining}`);
                    if (minutesRemaining <= 10 && minutesRemaining > 0) {
                        console.log(`    ⚠️  WARNING: Escalation imminent!`);
                    }
                }
            });
        }

        // Check acknowledged tickets
        const acknowledgedTickets = await Ticket.findAll({
            where: {
                assignmentStatus: { [db.Sequelize.Op.like]: 'Acknowledged%' }
            }
        });

        console.log(`\n✓ Acknowledged Tickets: ${acknowledgedTickets.length}`);
        if (acknowledgedTickets.length > 0) {
            console.log('\nAcknowledged Tickets:');
            acknowledgedTickets.forEach(ticket => {
                const minutesAgo = ticket.acknowledgedAt 
                    ? Math.round((new Date() - new Date(ticket.acknowledgedAt)) / (1000 * 60))
                    : 'N/A';
                console.log(`  - Ticket #${ticket.id}: ${ticket.title}`);
                console.log(`    Status: ${ticket.assignmentStatus}`);
                console.log(`    Acknowledged ${minutesAgo} minutes ago`);
            });
        }

        // Summary
        console.log('\n========================================');
        console.log('Summary');
        console.log('========================================');
        console.log(`Total Tickets Checked: ${unassignedTickets.length + assignedTickets.length + acknowledgedTickets.length}`);
        console.log(`Unassigned: ${unassignedTickets.length}`);
        console.log(`Assigned (unacknowledged): ${assignedTickets.length}`);
        console.log(`Acknowledged: ${acknowledgedTickets.length}`);
        console.log(`Approaching Escalation: ${approachingEscalation.length}`);
        console.log('\n========================================\n');

    } catch (error) {
        console.error('❌ Error running quick test:', error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

// Run if executed directly
if (require.main === module) {
    quickTest().catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
}

module.exports = { quickTest };
