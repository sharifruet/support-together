# Manual Testing Guide for Assignment Logic

This guide provides step-by-step instructions for manually testing the assignment logic using the REST API and database queries.

## Prerequisites

1. API server running (`npm start`)
2. Database connected and synced
3. REST client (Postman, Insomnia, or VS Code REST Client)
4. Access to database (MySQL client or admin tool)

## Test Scenario 1: Basic Ticket Assignment

### Step 1: Setup Test Data

**Create Organization:**
```http
POST http://localhost:5000/api/organizations
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "TEST-ORG",
  "name": "Test Organization",
  "address": "Test Address"
}
```

**Create Project:**
```http
POST http://localhost:5000/api/projects
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "organizationId": 1,
  "code": "TEST-PROJ",
  "name": "Test Project",
  "description": "Test Description"
}
```

**Create Support Users:**
```http
POST http://localhost:5000/api/register
Content-Type: application/json

{
  "name": "Support L1",
  "email": "supportl1@test.com",
  "password": "password123",
  "phoneNumber": "1234567890"
}
```

Repeat for L2 and L3 users.

**Create Support Team:**
```http
POST http://localhost:5000/api/support-teams
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Test Support Team",
  "userIds": [1, 2, 3]
}
```

**Create Support Schedule:**
```http
POST http://localhost:5000/api/support-schedules
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "escalationLevel": 1,
  "supportTeamId": 1,
  "userId": 1
}
```

Repeat for L2 (userId: 2) and L3 (userId: 3).

**Create Topic:**
```http
POST http://localhost:5000/api/topics
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "projectId": 1,
  "name": "Test Topic",
  "description": "Test Topic Description",
  "supportTeamId": 1
}
```

### Step 2: Create Test Ticket

```http
POST http://localhost:5000/api/tickets
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "topicId": 1,
  "title": "Test Ticket - Assignment",
  "description": "Testing automatic assignment",
  "priority": "P3"
}
```

**Note the ticket ID** from the response.

### Step 3: Verify Assignment

Wait for the assignment process to run (runs every minute), or trigger it manually by checking the logs.

**Check Ticket Status:**
```http
GET http://localhost:5000/api/tickets/<ticket_id>
Authorization: Bearer <token>
```

**Expected Result:**
- `status`: "Assigned"
- `assignmentStatus`: "Assigned (L1)"
- `assignedTo`: User ID of L1 user
- `assignedAt`: Timestamp recorded

**Database Query:**
```sql
SELECT 
    id, code, title, status, assignmentStatus, 
    assignedTo, assignedAt, acknowledgedAt, createdAt
FROM Tickets
WHERE id = <ticket_id>;
```

---

## Test Scenario 2: Escalation L1 to L2

### Step 1: Create and Manually Assign Ticket

**Create Ticket:**
```http
POST http://localhost:5000/api/tickets
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "topicId": 1,
  "title": "Test Ticket - Escalation",
  "description": "Testing escalation",
  "priority": "P3"
}
```

**Manually Update Ticket (via database or API):**
```sql
UPDATE Tickets 
SET 
    status = 'Assigned',
    assignmentStatus = 'Assigned (L1)',
    assignedTo = 1,
    assignedAt = DATE_SUB(NOW(), INTERVAL 31 MINUTE)
WHERE id = <ticket_id>;
```

### Step 2: Wait for Escalation

Wait for the escalation process to run (checks every minute).

**Check Ticket Status:**
```http
GET http://localhost:5000/api/tickets/<ticket_id>
Authorization: Bearer <token>
```

**Expected Result:**
- `assignmentStatus`: "Assigned (L2)"
- `assignedTo`: User ID of L2 user
- `assignedAt`: Updated to current time

---

## Test Scenario 3: Acknowledgment Prevents Escalation

### Step 1: Create Assigned Ticket

Create ticket and assign it as in Scenario 2.

### Step 2: Acknowledge Ticket

```http
PUT http://localhost:5000/api/tickets/<ticket_id>/acknowledge
Authorization: Bearer <support_token>
```

**Expected Response:**
```json
{
  "message": "Ticket acknowledged successfully",
  "ticket": {
    "id": 1,
    "code": "TICKET-1",
    "assignmentStatus": "Acknowledged (L1)",
    "acknowledgedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Step 3: Verify No Escalation

Wait for escalation process to run, then check ticket status.

**Expected Result:**
- `assignmentStatus`: Still "Acknowledged (L1)"
- `assignedTo`: Same user
- `acknowledgedAt`: Timestamp recorded

---

## Test Scenario 4: Fallback Assignment

### Step 1: Create Ticket Outside Schedule Hours

Create a ticket when current time is outside support schedule (e.g., 2:00 AM).

**Manually set ticket creation time:**
```sql
UPDATE Tickets 
SET createdAt = DATE_SUB(NOW(), INTERVAL 1 HOUR)
WHERE id = <ticket_id>;
```

### Step 2: Verify Fallback Assignment

Check ticket after assignment process runs.

**Expected Result:**
- Ticket assigned to first available team member
- Assignment status set appropriately

---

## Test Scenario 5: Multiple Tickets Assignment

### Step 1: Create Multiple Tickets

Create 5 tickets simultaneously:

```http
POST http://localhost:5000/api/tickets
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "topicId": 1,
  "title": "Test Ticket 1",
  "description": "Testing multiple assignment",
  "priority": "P3"
}
```

Repeat for tickets 2-5.

### Step 2: Verify All Assigned

**Check All Tickets:**
```http
GET http://localhost:5000/api/tickets
Authorization: Bearer <token>
```

**Database Query:**
```sql
SELECT 
    id, code, title, status, assignmentStatus, 
    assignedTo, assignedAt
FROM Tickets
WHERE status = 'Created' OR status = 'Assigned'
ORDER BY createdAt DESC
LIMIT 10;
```

**Expected Result:**
- All tickets have `status = 'Assigned'`
- All tickets have `assignedTo` set
- All tickets have `assignmentStatus` set

---

## Test Scenario 6: Ticket with No Support Team

### Step 1: Create Topic Without Support Team

```http
POST http://localhost:5000/api/topics
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "projectId": 1,
  "name": "Topic No Team",
  "description": "Topic without support team",
  "supportTeamId": null
}
```

### Step 2: Create Ticket for This Topic

```http
POST http://localhost:5000/api/tickets
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "topicId": <topic_without_team_id>,
  "title": "Test Ticket - No Team",
  "description": "Testing no team assignment",
  "priority": "P3"
}
```

### Step 3: Verify No Assignment

Check ticket status after assignment process runs.

**Expected Result:**
- `status`: Still "Created"
- `assignedTo`: null
- Warning logged in console

---

## Monitoring and Verification

### Check Assignment Process Logs

The assignment process logs to console. Look for:
```
Assignment Process started at: <timestamp>
Found X tickets to assign
Assigned ticket TICKET-X to user <name> (<email>) at level L1
Assignment Process completed
```

### Check Escalation Logs

Look for escalation logs:
```
Checking X L1 tickets for escalation
Escalating ticket TICKET-X from L1 to L2 (30 minutes unacknowledged)
  Previous assignee: <name>
  New assignee: <name>
```

### Database Monitoring Queries

**Unassigned Tickets:**
```sql
SELECT COUNT(*) as unassigned_count
FROM Tickets
WHERE status = 'Created';
```

**Assigned Tickets:**
```sql
SELECT 
    assignmentStatus,
    COUNT(*) as count
FROM Tickets
WHERE status = 'Assigned'
GROUP BY assignmentStatus;
```

**Tickets Approaching Escalation:**
```sql
SELECT 
    id, code, title, assignmentStatus,
    assignedTo, assignedAt,
    TIMESTAMPDIFF(MINUTE, assignedAt, NOW()) as minutes_since_assignment
FROM Tickets
WHERE assignmentStatus LIKE 'Assigned%'
  AND acknowledgedAt IS NULL
  AND status IN ('Assigned', 'In Progress')
ORDER BY assignedAt ASC;
```

**Acknowledged Tickets:**
```sql
SELECT 
    id, code, title, assignmentStatus,
    assignedTo, acknowledgedAt
FROM Tickets
WHERE assignmentStatus LIKE 'Acknowledged%'
ORDER BY acknowledgedAt DESC;
```

---

## Troubleshooting

### Tickets Not Assigning

1. **Check Support Team**: Verify topic has `supportTeamId` set
2. **Check Schedule**: Verify support schedules exist and cover current time
3. **Check Team Members**: Verify support team has members
4. **Check Logs**: Look for error messages in console

### Escalation Not Working

1. **Check Time**: Verify `assignedAt` is set and time difference is correct
2. **Check Status**: Verify ticket is not acknowledged (`acknowledgedAt IS NULL`)
3. **Check Assignment Status**: Verify status starts with 'Assigned'
4. **Check Thresholds**: Verify environment variables are set correctly

### Email Notifications Not Sending

1. **Check Email Service**: Verify email service configuration
2. **Check Templates**: Verify email templates exist in database
3. **Check Logs**: Look for email sending errors

---

## Test Checklist

- [ ] Basic ticket assignment works
- [ ] Tickets assigned to correct escalation level
- [ ] Fallback assignment works when no schedule matches
- [ ] Tickets without support teams are not assigned
- [ ] Escalation L1 to L2 works after threshold
- [ ] Escalation L2 to L3 works after threshold
- [ ] Acknowledged tickets are not escalated
- [ ] Multiple tickets are assigned correctly
- [ ] Email notifications are sent
- [ ] Assignment timestamps are recorded correctly

---

## Next Steps

After manual testing, consider:
1. Setting up automated tests
2. Creating test data fixtures
3. Adding integration tests
4. Setting up CI/CD with test execution
5. Creating performance tests
