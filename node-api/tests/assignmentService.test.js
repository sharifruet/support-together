/**
 * Test Suite for Assignment Service
 * 
 * This file contains comprehensive tests for the ticket assignment logic.
 * Run with: node tests/assignmentService.test.js
 * 
 * Note: These are integration tests that require a test database.
 * For unit tests, consider using Jest or Mocha with mocking.
 */

const { processAssignments } = require('../services/assignmentService');
const Ticket = require('../models/Ticket');
const Topic = require('../models/Topic');
const SupportTeam = require('../models/SupportTeam');
const SupportSchedule = require('../models/SupportSchedule');
const User = require('../models/User');
const Project = require('../models/Project');
const Organization = require('../models/Organization');
const db = require('../db');

// Test configuration
const TEST_CONFIG = {
    runTests: true,
    cleanupAfterTests: true,
    verbose: true
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    errors: []
};

/**
 * Helper function to log test results
 */
function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${name}${message ? ' - ' + message : ''}`);
    if (passed) {
        testResults.passed++;
    } else {
        testResults.failed++;
        testResults.errors.push({ test: name, message });
    }
}

/**
 * Helper function to create test data
 */
async function createTestData() {
    try {
        // Create organization
        const org = await Organization.create({
            code: 'TEST-ORG',
            name: 'Test Organization',
            address: 'Test Address'
        });

        // Create project
        const project = await Project.create({
            code: 'TEST-PROJ',
            name: 'Test Project',
            description: 'Test Description',
            OrganizationId: org.id
        });

        // Create users
        const user1 = await User.create({
            name: 'Test User L1',
            email: 'testl1@example.com',
            password: 'hashedpassword',
            phoneNumber: '1234567890'
        });

        const user2 = await User.create({
            name: 'Test User L2',
            email: 'testl2@example.com',
            password: 'hashedpassword',
            phoneNumber: '1234567891'
        });

        const user3 = await User.create({
            name: 'Test User L3',
            email: 'testl3@example.com',
            password: 'hashedpassword',
            phoneNumber: '1234567892'
        });

        const customer = await User.create({
            name: 'Test Customer',
            email: 'customer@example.com',
            password: 'hashedpassword',
            phoneNumber: '1234567893'
        });

        // Create support team
        const supportTeam = await SupportTeam.create({
            name: 'Test Support Team'
        });

        // Add users to support team
        await supportTeam.addUsers([user1, user2, user3]);

        // Create support schedules
        // Schedule 1: 9 AM to 5 PM
        await SupportSchedule.create({
            startTime: '09:00:00',
            endTime: '17:00:00',
            escalationLevel: 1,
            SupportTeamId: supportTeam.id,
            UserId: user1.id
        });

        await SupportSchedule.create({
            startTime: '09:00:00',
            endTime: '17:00:00',
            escalationLevel: 2,
            SupportTeamId: supportTeam.id,
            UserId: user2.id
        });

        await SupportSchedule.create({
            startTime: '09:00:00',
            endTime: '17:00:00',
            escalationLevel: 3,
            SupportTeamId: supportTeam.id,
            UserId: user3.id
        });

        // Create topic with support team
        const topic = await Topic.create({
            name: 'Test Topic',
            description: 'Test Topic Description',
            ProjectId: project.id,
            supportTeamId: supportTeam.id
        });

        return {
            org,
            project,
            users: { user1, user2, user3, customer },
            supportTeam,
            topic
        };
    } catch (error) {
        console.error('Error creating test data:', error);
        throw error;
    }
}

/**
 * Helper function to cleanup test data
 */
async function cleanupTestData(testData) {
    try {
        if (testData) {
            // Delete in reverse order of creation
            await Ticket.destroy({ where: {}, truncate: true, cascade: true });
            await SupportSchedule.destroy({ where: {}, truncate: true });
            await SupportTeam.destroy({ where: {}, truncate: true });
            await Topic.destroy({ where: {}, truncate: true });
            await Project.destroy({ where: {}, truncate: true });
            await Organization.destroy({ where: {}, truncate: true });
            await User.destroy({ where: {}, truncate: true });
        }
    } catch (error) {
        console.error('Error cleaning up test data:', error);
    }
}

/**
 * Test Scenario 1: Basic Ticket Assignment
 * Tests that a ticket is assigned to L1 user when schedule matches
 */
async function testBasicAssignment() {
    const testName = 'Basic Ticket Assignment';
    try {
        const testData = await createTestData();
        
        // Create a ticket with status 'Created'
        const ticket = await Ticket.create({
            title: 'Test Ticket 1',
            description: 'Test Description',
            priority: 'P3',
            status: 'Created',
            topicId: testData.topic.id,
            createdBy: testData.users.customer.id
        });

        // Mock current time to be within schedule (e.g., 10:00 AM)
        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setHours(10, 0, 0, 0); // Set to 10:00 AM
                } else {
                    super(...args);
                }
            }
        };

        // Process assignments
        await processAssignments();

        // Reload ticket to get updated data
        await ticket.reload();

        // Verify assignment
        const passed = ticket.status === 'Assigned' &&
                      ticket.assignmentStatus === 'Assigned (L1)' &&
                      ticket.assignedTo === testData.users.user1.id &&
                      ticket.assignedAt !== null;

        logTest(testName, passed, passed ? 
            `Ticket assigned to ${testData.users.user1.name} at L1` : 
            `Expected L1 assignment, got ${ticket.assignmentStatus}`);

        // Restore Date
        global.Date = originalDate;

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 2: Assignment When No Schedule Matches
 * Tests fallback assignment when current time doesn't match any schedule
 */
async function testFallbackAssignment() {
    const testName = 'Fallback Assignment (No Schedule Match)';
    try {
        const testData = await createTestData();
        
        const ticket = await Ticket.create({
            title: 'Test Ticket 2',
            description: 'Test Description',
            priority: 'P3',
            status: 'Created',
            topicId: testData.topic.id,
            createdBy: testData.users.customer.id
        });

        // Mock current time outside schedule (e.g., 2:00 AM)
        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setHours(2, 0, 0, 0); // Set to 2:00 AM (outside schedule)
                } else {
                    super(...args);
                }
            }
        };

        await processAssignments();
        await ticket.reload();

        // Should still be assigned (fallback to first team member)
        const passed = ticket.status === 'Assigned' &&
                      ticket.assignedTo !== null;

        logTest(testName, passed, passed ? 
            `Ticket assigned via fallback mechanism` : 
            `Expected fallback assignment, got status: ${ticket.status}`);

        global.Date = originalDate;

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 3: Ticket with No Support Team
 * Tests that ticket is not assigned when topic has no support team
 */
async function testNoSupportTeam() {
    const testName = 'Ticket with No Support Team';
    try {
        const testData = await createTestData();
        
        // Create topic without support team
        const topicNoTeam = await Topic.create({
            name: 'Topic No Team',
            description: 'No team assigned',
            ProjectId: testData.project.id,
            supportTeamId: null
        });

        const ticket = await Ticket.create({
            title: 'Test Ticket 3',
            description: 'Test Description',
            priority: 'P3',
            status: 'Created',
            topicId: topicNoTeam.id,
            createdBy: testData.users.customer.id
        });

        await processAssignments();
        await ticket.reload();

        // Should remain in 'Created' status
        const passed = ticket.status === 'Created' &&
                      ticket.assignedTo === null;

        logTest(testName, passed, passed ? 
            `Ticket correctly not assigned (no support team)` : 
            `Expected Created status, got ${ticket.status}`);

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 4: Escalation L1 to L2
 * Tests that unacknowledged tickets escalate from L1 to L2 after threshold
 */
async function testEscalationL1ToL2() {
    const testName = 'Escalation L1 to L2';
    try {
        const testData = await createTestData();
        
        // Create and assign ticket manually
        const ticket = await Ticket.create({
            title: 'Test Ticket 4',
            description: 'Test Description',
            priority: 'P3',
            status: 'Assigned',
            assignmentStatus: 'Assigned (L1)',
            topicId: testData.topic.id,
            createdBy: testData.users.customer.id,
            assignedTo: testData.users.user1.id,
            assignedAt: new Date(Date.now() - 31 * 60 * 1000) // 31 minutes ago
        });

        // Mock current time within schedule
        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setHours(10, 0, 0, 0);
                } else {
                    super(...args);
                }
            }
        };

        await processAssignments();
        await ticket.reload();

        // Should be escalated to L2
        const passed = ticket.assignmentStatus === 'Assigned (L2)' &&
                      ticket.assignedTo === testData.users.user2.id;

        logTest(testName, passed, passed ? 
            `Ticket escalated to L2` : 
            `Expected L2 assignment, got ${ticket.assignmentStatus}`);

        global.Date = originalDate;

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 5: No Escalation for Acknowledged Tickets
 * Tests that acknowledged tickets are not escalated
 */
async function testNoEscalationForAcknowledged() {
    const testName = 'No Escalation for Acknowledged Tickets';
    try {
        const testData = await createTestData();
        
        const ticket = await Ticket.create({
            title: 'Test Ticket 5',
            description: 'Test Description',
            priority: 'P3',
            status: 'Assigned',
            assignmentStatus: 'Acknowledged (L1)',
            topicId: testData.topic.id,
            createdBy: testData.users.customer.id,
            assignedTo: testData.users.user1.id,
            assignedAt: new Date(Date.now() - 31 * 60 * 1000), // 31 minutes ago
            acknowledgedAt: new Date(Date.now() - 5 * 60 * 1000) // Acknowledged 5 minutes ago
        });

        await processAssignments();
        await ticket.reload();

        // Should remain at Acknowledged (L1)
        const passed = ticket.assignmentStatus === 'Acknowledged (L1)' &&
                      ticket.assignedTo === testData.users.user1.id;

        logTest(testName, passed, passed ? 
            `Acknowledged ticket correctly not escalated` : 
            `Expected Acknowledged (L1), got ${ticket.assignmentStatus}`);

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 6: Multiple Tickets Assignment
 * Tests that multiple tickets are assigned correctly
 */
async function testMultipleTicketsAssignment() {
    const testName = 'Multiple Tickets Assignment';
    try {
        const testData = await createTestData();
        
        // Create multiple tickets
        const tickets = await Ticket.bulkCreate([
            {
                title: 'Test Ticket 6a',
                description: 'Test Description',
                priority: 'P3',
                status: 'Created',
                topicId: testData.topic.id,
                createdBy: testData.users.customer.id
            },
            {
                title: 'Test Ticket 6b',
                description: 'Test Description',
                priority: 'P2',
                status: 'Created',
                topicId: testData.topic.id,
                createdBy: testData.users.customer.id
            },
            {
                title: 'Test Ticket 6c',
                description: 'Test Description',
                priority: 'P1',
                status: 'Created',
                topicId: testData.topic.id,
                createdBy: testData.users.customer.id
            }
        ]);

        // Mock current time within schedule
        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setHours(10, 0, 0, 0);
                } else {
                    super(...args);
                }
            }
        };

        await processAssignments();

        // Reload all tickets
        for (const ticket of tickets) {
            await ticket.reload();
        }

        // All should be assigned
        const allAssigned = tickets.every(t => 
            t.status === 'Assigned' && 
            t.assignedTo !== null &&
            t.assignmentStatus !== null
        );

        logTest(testName, allAssigned, allAssigned ? 
            `All ${tickets.length} tickets assigned successfully` : 
            `Some tickets not assigned`);

        global.Date = originalDate;

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return allAssigned;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 7: Escalation L2 to L3
 * Tests that unacknowledged L2 tickets escalate to L3
 */
async function testEscalationL2ToL3() {
    const testName = 'Escalation L2 to L3';
    try {
        const testData = await createTestData();
        
        const ticket = await Ticket.create({
            title: 'Test Ticket 7',
            description: 'Test Description',
            priority: 'P3',
            status: 'Assigned',
            assignmentStatus: 'Assigned (L2)',
            topicId: testData.topic.id,
            createdBy: testData.users.customer.id,
            assignedTo: testData.users.user2.id,
            assignedAt: new Date(Date.now() - 61 * 60 * 1000) // 61 minutes ago
        });

        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setHours(10, 0, 0, 0);
                } else {
                    super(...args);
                }
            }
        };

        await processAssignments();
        await ticket.reload();

        const passed = ticket.assignmentStatus === 'Assigned (L3)' &&
                      ticket.assignedTo === testData.users.user3.id;

        logTest(testName, passed, passed ? 
            `Ticket escalated to L3` : 
            `Expected L3 assignment, got ${ticket.assignmentStatus}`);

        global.Date = originalDate;

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Test Scenario 8: Assignment with L1 Unavailable
 * Tests that ticket escalates to L2 when L1 user not available
 */
async function testL1UnavailableEscalation() {
    const testName = 'Assignment with L1 Unavailable';
    try {
        const testData = await createTestData();
        
        // Remove L1 schedule entry (simulate L1 unavailable)
        await SupportSchedule.destroy({
            where: {
                SupportTeamId: testData.supportTeam.id,
                escalationLevel: 1
            }
        });

        const ticket = await Ticket.create({
            title: 'Test Ticket 8',
            description: 'Test Description',
            priority: 'P3',
            status: 'Created',
            topicId: testData.topic.id,
            createdBy: testData.users.customer.id
        });

        const originalDate = Date;
        global.Date = class extends originalDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setHours(10, 0, 0, 0);
                } else {
                    super(...args);
                }
            }
        };

        await processAssignments();
        await ticket.reload();

        // Should assign to L2 (or fallback)
        const passed = ticket.status === 'Assigned' &&
                      ticket.assignedTo !== null;

        logTest(testName, passed, passed ? 
            `Ticket assigned when L1 unavailable` : 
            `Expected assignment, got status: ${ticket.status}`);

        global.Date = originalDate;

        if (TEST_CONFIG.cleanupAfterTests) {
            await cleanupTestData(testData);
        }

        return passed;
    } catch (error) {
        logTest(testName, false, error.message);
        return false;
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('\n========================================');
    console.log('Assignment Service Test Suite');
    console.log('========================================\n');

    const tests = [
        testBasicAssignment,
        testFallbackAssignment,
        testNoSupportTeam,
        testEscalationL1ToL2,
        testNoEscalationForAcknowledged,
        testMultipleTicketsAssignment,
        testEscalationL2ToL3,
        testL1UnavailableEscalation
    ];

    for (const test of tests) {
        try {
            await test();
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Test failed with error: ${error.message}`);
        }
    }

    // Print summary
    console.log('\n========================================');
    console.log('Test Summary');
    console.log('========================================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Total: ${testResults.passed + testResults.failed}`);

    if (testResults.errors.length > 0) {
        console.log('\nErrors:');
        testResults.errors.forEach(err => {
            console.log(`  - ${err.test}: ${err.message}`);
        });
    }

    console.log('\n========================================\n');

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
    // Connect to database and run tests
    db.authenticate()
        .then(() => {
            console.log('Database connection established.');
            return runAllTests();
        })
        .catch(err => {
            console.error('Unable to connect to database:', err);
            process.exit(1);
        });
}

module.exports = {
    runAllTests,
    testBasicAssignment,
    testFallbackAssignment,
    testNoSupportTeam,
    testEscalationL1ToL2,
    testNoEscalationForAcknowledged,
    testMultipleTicketsAssignment,
    testEscalationL2ToL3,
    testL1UnavailableEscalation
};
