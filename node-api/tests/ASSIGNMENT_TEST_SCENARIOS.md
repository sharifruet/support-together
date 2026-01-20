# Assignment Logic Test Scenarios

This document describes comprehensive test scenarios for the ticket assignment and escalation logic.

## Test Setup

### Prerequisites
- Test database configured
- All models synced
- Test data can be created and cleaned up

### Running Tests
```bash
cd node-api
node tests/assignmentService.test.js
```

## Test Scenarios

### Scenario 1: Basic Ticket Assignment ✅
**Objective**: Verify that a ticket is correctly assigned to L1 user when schedule matches

**Setup**:
- Create organization, project, topic with support team
- Create support schedule (9 AM - 5 PM) with L1, L2, L3 users
- Create ticket with status 'Created'

**Steps**:
1. Set current time to 10:00 AM (within schedule)
2. Run assignment process
3. Verify ticket assignment

**Expected Result**:
- Ticket status: 'Assigned'
- Assignment status: 'Assigned (L1)'
- Assigned to: L1 user
- assignedAt timestamp recorded
- Email notification sent

**Assertions**:
- `ticket.status === 'Assigned'`
- `ticket.assignmentStatus === 'Assigned (L1)'`
- `ticket.assignedTo === L1_USER_ID`
- `ticket.assignedAt !== null`

---

### Scenario 2: Fallback Assignment (No Schedule Match) ✅
**Objective**: Verify fallback assignment when current time doesn't match any schedule

**Setup**:
- Create ticket with status 'Created'
- Support schedules exist but don't cover current time

**Steps**:
1. Set current time to 2:00 AM (outside all schedules)
2. Run assignment process
3. Verify fallback assignment

**Expected Result**:
- Ticket assigned to first available team member
- Assignment status: 'Assigned (L1)'
- Ticket status: 'Assigned'

**Assertions**:
- `ticket.status === 'Assigned'`
- `ticket.assignedTo !== null`

---

### Scenario 3: Ticket with No Support Team ⚠️
**Objective**: Verify that tickets without support teams are not assigned

**Setup**:
- Create topic without supportTeamId
- Create ticket for that topic

**Steps**:
1. Run assignment process
2. Verify ticket remains unassigned

**Expected Result**:
- Ticket status remains 'Created'
- No assignment occurs
- Warning logged

**Assertions**:
- `ticket.status === 'Created'`
- `ticket.assignedTo === null`

---

### Scenario 4: Escalation L1 to L2 ⏱️
**Objective**: Verify unacknowledged tickets escalate from L1 to L2 after threshold

**Setup**:
- Create ticket assigned to L1 user
- Set assignedAt to 31 minutes ago
- Ensure ticket is not acknowledged

**Steps**:
1. Run escalation process
2. Verify escalation occurred

**Expected Result**:
- Assignment status: 'Assigned (L2)'
- Assigned to: L2 user
- assignedAt timestamp reset
- Email notification sent to new assignee

**Assertions**:
- `ticket.assignmentStatus === 'Assigned (L2)'`
- `ticket.assignedTo === L2_USER_ID`
- `ticket.assignedAt` updated to current time

---

### Scenario 5: No Escalation for Acknowledged Tickets ✅
**Objective**: Verify acknowledged tickets are not escalated

**Setup**:
- Create ticket assigned to L1 user
- Set assignedAt to 31 minutes ago
- Set acknowledgedAt to 5 minutes ago
- Set assignmentStatus to 'Acknowledged (L1)'

**Steps**:
1. Run escalation process
2. Verify no escalation occurred

**Expected Result**:
- Assignment status remains 'Acknowledged (L1)'
- Assigned to same user
- No escalation email sent

**Assertions**:
- `ticket.assignmentStatus === 'Acknowledged (L1)'`
- `ticket.assignedTo === L1_USER_ID`
- `ticket.acknowledgedAt !== null`

---

### Scenario 6: Multiple Tickets Assignment 📦
**Objective**: Verify multiple tickets are assigned correctly

**Setup**:
- Create 3 tickets with status 'Created'
- All tickets have valid support teams and schedules

**Steps**:
1. Run assignment process
2. Verify all tickets assigned

**Expected Result**:
- All tickets assigned
- Each ticket assigned to appropriate user
- All assignments logged

**Assertions**:
- All tickets have `status === 'Assigned'`
- All tickets have `assignedTo !== null`
- All tickets have `assignmentStatus` set

---

### Scenario 7: Escalation L2 to L3 ⏱️
**Objective**: Verify unacknowledged L2 tickets escalate to L3

**Setup**:
- Create ticket assigned to L2 user
- Set assignedAt to 61 minutes ago
- Ensure ticket is not acknowledged

**Steps**:
1. Run escalation process
2. Verify escalation to L3

**Expected Result**:
- Assignment status: 'Assigned (L3)'
- Assigned to: L3 user
- Email notification sent

**Assertions**:
- `ticket.assignmentStatus === 'Assigned (L3)'`
- `ticket.assignedTo === L3_USER_ID`

---

### Scenario 8: Assignment with L1 Unavailable 🔄
**Objective**: Verify ticket escalates to L2 when L1 user not available

**Setup**:
- Create support team with L2 and L3 schedules only
- Remove L1 schedule entry
- Create ticket with status 'Created'

**Steps**:
1. Run assignment process
2. Verify assignment to L2

**Expected Result**:
- Ticket assigned to L2 user (or fallback)
- Assignment status: 'Assigned (L2)' or 'Assigned (L1)'

**Assertions**:
- `ticket.status === 'Assigned'`
- `ticket.assignedTo !== null`

---

## Additional Test Scenarios (Not Yet Implemented)

### Scenario 9: Time-Based Schedule Matching
**Test**: Verify schedules are matched correctly based on current time
- Test schedules spanning midnight (e.g., 22:00 to 02:00)
- Test multiple overlapping schedules
- Test schedules with exact time boundaries

### Scenario 10: Escalation Warning Emails
**Test**: Verify warning emails are sent before escalation
- Warning sent 10 minutes before L1→L2 escalation
- Warning sent 15 minutes before L2→L3 escalation
- No duplicate warnings sent

### Scenario 11: Escalation When No User Available
**Test**: Verify behavior when no user available at next level
- L1→L2 escalation when no L2 user in schedule
- L2→L3 escalation when no L3 user in schedule
- Appropriate logging and handling

### Scenario 12: Priority-Based Assignment
**Test**: Verify high-priority tickets are handled appropriately
- P1 tickets assigned first
- Priority affects assignment order
- Priority considered in escalation

### Scenario 13: Concurrent Ticket Assignment
**Test**: Verify system handles concurrent assignments correctly
- Multiple tickets assigned simultaneously
- No race conditions
- All tickets assigned correctly

### Scenario 14: Assignment Status Transitions
**Test**: Verify all valid status transitions
- Created → Assigned
- Assigned (L1) → Assigned (L2)
- Assigned (L2) → Assigned (L3)
- Assigned (LX) → Acknowledged (LX)

### Scenario 15: Error Handling
**Test**: Verify error handling in various failure scenarios
- Database connection errors
- Missing topic/support team
- Invalid schedule data
- Email sending failures

## Test Data Requirements

### Required Test Data
1. **Organization**: Test organization with unique code
2. **Project**: Test project linked to organization
3. **Users**: 
   - L1 Support User
   - L2 Support User
   - L3 Support User
   - Customer User
4. **Support Team**: Team with all three users
5. **Support Schedules**: 
   - 9 AM - 5 PM schedule with L1, L2, L3
   - Additional schedules for edge cases
6. **Topic**: Topic linked to project and support team

## Manual Testing Guide

### Using REST Client Files
1. Create test data using REST client files in `rest-client/`
2. Create tickets via POST `/api/tickets`
3. Monitor assignment via GET `/api/tickets`
4. Check logs for assignment process output

### Using Database Queries
```sql
-- Check unassigned tickets
SELECT * FROM Tickets WHERE status = 'Created';

-- Check assigned tickets
SELECT * FROM Tickets WHERE status = 'Assigned';

-- Check escalation status
SELECT id, code, assignmentStatus, assignedAt, acknowledgedAt 
FROM Tickets 
WHERE assignmentStatus LIKE 'Assigned%'
ORDER BY assignedAt DESC;
```

## Performance Testing

### Load Testing Scenarios
1. **100 tickets created simultaneously**
   - Verify all assigned within reasonable time
   - Check for performance bottlenecks

2. **1000 tickets escalation check**
   - Verify escalation process completes quickly
   - Check database query performance

3. **Concurrent assignment and escalation**
   - Verify no conflicts
   - Check data consistency

## Integration Testing

### End-to-End Test Flow
1. Customer creates ticket
2. Ticket automatically assigned to L1 user
3. L1 user acknowledges ticket
4. Verify no escalation occurs
5. Create another ticket, don't acknowledge
6. Verify escalation after threshold

## Continuous Testing

### Recommended Test Execution
- **Before deployment**: Run full test suite
- **After code changes**: Run affected test scenarios
- **Scheduled**: Run tests daily/weekly
- **On escalation issues**: Run escalation-specific tests

## Test Results Interpretation

### Success Criteria
- All critical scenarios pass
- No data corruption
- Proper error handling
- Performance within acceptable limits

### Failure Analysis
- Check logs for detailed error messages
- Verify test data setup
- Check database state
- Review assignment service code

## Notes

- Tests require a test database (not production)
- Tests may modify database state
- Cleanup should be enabled for test isolation
- Time mocking may be needed for consistent results
- Email sending should be mocked or disabled in tests
