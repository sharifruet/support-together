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

