# support-together

Support desk application

## High level requirements
 - Organization:
   - Represents the top-level entity, under which multiple projects are managed.
   - Admins can manage projects within their organization.

- Projects:
    - Belong to a specific organization.
    - Admins manage projects, including creating, updating, and deleting them.

- Topics:
    - Each project can have multiple topics.
    - Admins manage topics within a project, defining categories for support tickets.

- Users:
    - Three roles: Admin, Support, and Customer.
    - Admins: Manage organization, projects, and topics.
    - Support: Handle support tickets, assign them to resolve issues.
    - Customer: Raise support tickets for specific projects and topics.

- Support Tickets:
    - Raised by customers for specific projects and topics.
    - Assigned to support users for resolution.
    - Track status and progress until resolved.

### Support Team and Schedules Requirements
- Overview

We need to manage support teams, support schedules, and user comments on tickets. Here are the detailed requirements for each component:
- Support Team

    - A support team consists of multiple users.
    - Each support team is assigned to a specific topic.

- Support Schedule

    - A support schedule defines specific time slots during which support is provided.
    - Each time slot includes escalation levels for each support team member, indicating the order in which they should be contacted for support.

- Example Scenario:

    - Support Team T1: Consists of three members: M1, M2, and M3.
    - Support Schedule S1:
         - Time Slot: 10 AM to 6 PM
         - Escalation Levels:
             - M1: Level 1
             - M2: Level 2
             - M3: Level 3
     - Support Schedule S2:
         - Time Slot: 6 PM to 12 AM
         - Escalation Levels:
             - M1: Level 2
             - M2: Level 3
             - M3: Level 1