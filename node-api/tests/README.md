# Assignment Logic Tests

This directory contains comprehensive tests for the ticket assignment and escalation logic.

## Test Files

### 1. `assignmentService.test.js`
Comprehensive automated test suite with 8+ test scenarios covering:
- Basic ticket assignment
- Fallback assignment
- Escalation scenarios
- Acknowledgment handling
- Multiple ticket assignment
- Edge cases

**Run**: `npm test` or `node tests/assignmentService.test.js`

### 2. `quick-test.js`
Quick verification script that checks current ticket states and reports:
- Unassigned tickets
- Assigned tickets
- Tickets approaching escalation
- Acknowledged tickets

**Run**: `npm run test:quick` or `node tests/quick-test.js`

### 3. `ASSIGNMENT_TEST_SCENARIOS.md`
Detailed documentation of all test scenarios with:
- Test objectives
- Setup instructions
- Expected results
- Assertions

### 4. `MANUAL_TESTING_GUIDE.md`
Step-by-step manual testing guide using REST API and database queries.

## Quick Start

### Run Automated Tests
```bash
cd node-api
npm test
```

### Run Quick Check
```bash
npm run test:quick
```

### Manual Testing
Follow the guide in `MANUAL_TESTING_GUIDE.md`

## Test Scenarios Covered

1. ✅ Basic Ticket Assignment
2. ✅ Fallback Assignment (No Schedule Match)
3. ✅ Ticket with No Support Team
4. ✅ Escalation L1 to L2
5. ✅ No Escalation for Acknowledged Tickets
6. ✅ Multiple Tickets Assignment
7. ✅ Escalation L2 to L3
8. ✅ Assignment with L1 Unavailable

## Prerequisites

- Test database configured
- All models synced
- Test data can be created
- Email service configured (or mocked)

## Notes

- Tests require database access
- Tests may modify database state
- Use test database, not production
- Cleanup is automatic after tests
- Time mocking used for consistent results

## Troubleshooting

### Tests Failing
1. Check database connection
2. Verify test data setup
3. Check model associations
4. Review error messages in logs

### Date/Time Issues
- Tests use Date mocking for consistency
- Adjust mock times for different scenarios
- Verify timezone settings

### Database Errors
- Ensure test database is separate from production
- Check database permissions
- Verify models are synced

## Contributing

When adding new test scenarios:
1. Add test function to `assignmentService.test.js`
2. Document scenario in `ASSIGNMENT_TEST_SCENARIOS.md`
3. Update this README
4. Ensure tests pass before committing
