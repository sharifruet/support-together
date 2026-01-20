# Escalation Timers for Unacknowledged Tickets

## Overview
The escalation timer system automatically escalates tickets that haven't been acknowledged within specified time thresholds. This ensures that tickets don't remain unacknowledged and are properly handled by support team members.

## How It Works

### 1. Ticket Assignment
When a ticket is assigned to a support team member:
- `assignmentStatus` is set to `Assigned (L1)`, `Assigned (L2)`, or `Assigned (L3)`
- `assignedAt` timestamp is recorded
- `acknowledgedAt` is set to `null`
- An email notification is sent to the assigned user

### 2. Ticket Acknowledgment
When a support team member acknowledges a ticket:
- `assignmentStatus` changes from `Assigned (LX)` to `Acknowledged (LX)`
- `acknowledgedAt` timestamp is recorded
- Escalation timer stops (acknowledged tickets are not escalated)

### 3. Escalation Process
The escalation system runs every minute and:
- Checks for unacknowledged tickets (`acknowledgedAt = null`)
- Calculates time since assignment using `assignedAt` (or `updatedAt` as fallback)
- Escalates tickets that exceed thresholds:
  - **L1 → L2**: After 30 minutes (default)
  - **L2 → L3**: After 60 minutes (default)

### 4. Escalation Warnings
Before escalation occurs, warning emails are sent:
- **L1 → L2**: Warning sent 10 minutes before escalation (at 20 minutes)
- **L2 → L3**: Warning sent 15 minutes before escalation (at 45 minutes)

## Configuration

### Environment Variables
Escalation thresholds can be configured via environment variables:

```bash
# Escalation thresholds (in minutes)
ESCALATION_L1_TO_L2_MINUTES=30  # Default: 30 minutes
ESCALATION_L2_TO_L3_MINUTES=60  # Default: 60 minutes
```

### Default Values
- **L1 to L2**: 30 minutes
- **L2 to L3**: 60 minutes
- **Warning before L1→L2**: 10 minutes before (at 20 minutes)
- **Warning before L2→L3**: 15 minutes before (at 45 minutes)

## Database Schema Changes

### New Fields Added to Ticket Model

```javascript
assignedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when ticket was assigned to current assignee'
},
acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when ticket was acknowledged by assignee'
}
```

**Note**: These fields need to be added to the database via migration or manual schema update.

## API Endpoints

### Acknowledge Ticket
**Endpoint**: `PUT /api/tickets/:id/acknowledge`

**Authorization**: Requires Support role

**Description**: Allows a support team member to acknowledge a ticket assigned to them.

**Request**:
```http
PUT /api/tickets/123/acknowledge
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Ticket acknowledged successfully",
  "ticket": {
    "id": 123,
    "code": "TICKET-123",
    "assignmentStatus": "Acknowledged (L1)",
    "acknowledgedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:
- `403 Forbidden`: User trying to acknowledge ticket not assigned to them
- `400 Bad Request`: Ticket is not in an assigned state
- `404 Not Found`: Ticket not found

## Escalation Flow

```
Ticket Created
    ↓
Assigned to L1 User (assignedAt recorded)
    ↓
[20 minutes] → Warning email sent
    ↓
[30 minutes] → Escalated to L2 User (assignedAt reset)
    ↓
[45 minutes] → Warning email sent
    ↓
[60 minutes] → Escalated to L3 User (assignedAt reset)
```

**If ticket is acknowledged at any point:**
```
Assigned (LX) → Acknowledged (LX)
    ↓
Escalation timer stops
```

## Escalation Logic Details

### 1. Finding Tickets to Escalate
The system queries for tickets with:
- `assignmentStatus` starting with `'Assigned'` (not `'Acknowledged'`)
- `status` in `['Assigned', 'In Progress']`
- `acknowledgedAt` is `null`

### 2. Time Calculation
- Uses `assignedAt` if available (most accurate)
- Falls back to `updatedAt` for older tickets (before `assignedAt` was added)
- Calculates minutes since assignment: `(now - assignedTime) / (1000 * 60)`

### 3. Escalation Process
1. Find ticket's topic and support team
2. Get current time and find matching support schedules
3. Find user at target escalation level (L2 or L3)
4. Reassign ticket to new user
5. Reset `assignedAt` timestamp
6. Send email notification to new assignee

### 4. Preventing Duplicate Escalations
- Only escalates tickets with `acknowledgedAt = null`
- Checks that ticket is still in `'Assigned'` status
- Prevents escalation to same user (checks `assignedTo` before escalating)

## Email Notifications

### Assignment Email
Sent when ticket is assigned (initial or escalated):
- **Template ID**: 6
- **Recipients**: Assigned user
- **Placeholders**: `code`, `email`, `name`, `title`

### Escalation Email
Sent when ticket is escalated:
- **Template ID**: 6 (same as assignment)
- **Recipients**: New assignee
- **Placeholders**: `code`, `email`, `name`, `title`, `previousAssignee`, `escalationLevel`

### Warning Email
Sent before escalation:
- **Template ID**: 6 (TODO: Create dedicated warning template)
- **Recipients**: Current assignee
- **Placeholders**: `code`, `email`, `name`, `title`, `minutesRemaining`

## Monitoring and Logging

### Console Logs
The system logs:
- Number of tickets checked for escalation
- Escalation actions taken
- Warning emails sent
- Errors encountered

**Example logs**:
```
Checking 5 L1 tickets for escalation
Escalating ticket TICKET-123 from L1 to L2 (30 minutes unacknowledged)
  Previous assignee: John Doe
  New assignee: Jane Smith
Sent escalation warning for ticket TICKET-456 to John Doe
```

## Best Practices

1. **Acknowledge Promptly**: Support team members should acknowledge tickets as soon as they start working on them
2. **Monitor Escalations**: Review escalation logs regularly to identify patterns
3. **Adjust Thresholds**: Configure thresholds based on your support SLA requirements
4. **Email Templates**: Create dedicated email templates for warnings and escalations
5. **Dashboard**: Consider adding a dashboard to show tickets approaching escalation

## Troubleshooting

### Tickets Not Escalating
- Check that `acknowledgedAt` is `null`
- Verify `assignmentStatus` starts with `'Assigned'`
- Ensure ticket `status` is `'Assigned'` or `'In Progress'`
- Check that support schedules exist for the team
- Verify escalation thresholds are configured correctly

### Duplicate Escalations
- System checks `acknowledgedAt` to prevent duplicate escalations
- Each escalation resets `assignedAt` timestamp
- Tickets are only escalated once per threshold

### Missing Email Notifications
- Check email service configuration
- Verify email templates exist
- Check console logs for email errors
- Ensure user email addresses are valid

## Future Enhancements

- [ ] Add escalation history tracking
- [ ] Create dedicated escalation warning email templates
- [ ] Add escalation metrics and reporting
- [ ] Support for custom escalation rules per project/topic
- [ ] Escalation notifications to managers/supervisors
- [ ] Dashboard for monitoring escalation status
- [ ] Escalation pause/resume functionality
- [ ] Priority-based escalation thresholds (P1 escalates faster than P5)

## Related Files

- `node-api/services/assignmentService.js` - Main escalation logic
- `node-api/models/Ticket.js` - Ticket model with new fields
- `node-api/routes/ticketRoutes.js` - Acknowledgment endpoint
- `node-api/services/emailService.js` - Email notification service
