# Role-Based Authorization Implementation

## Overview
Role-based authorization middleware has been implemented to enforce access control based on user roles (Admin, Support, Customer) across the application.

## Implementation Details

### 1. Updated Authentication Middleware (`node-api/middleware/authMiddleware.js`)
- **Enhancement**: Now extracts user roles from JWT token and attaches them to `req.roles`
- **Format**: Roles are stored as an array: `[{ projectId: number, role: 'Admin'|'Support'|'Customer' }]`
- **Usage**: All authenticated routes automatically have access to `req.user` and `req.roles`

### 2. Role-Based Middleware (`node-api/middleware/roleMiddleware.js`)

#### Available Middleware Functions:

##### `requireAdmin(options)`
- **Purpose**: Restricts access to Admin users only
- **Options**:
  - `checkProjectAccess`: If true, verifies Admin role for specific project
- **Usage**: `router.post('/organizations', requireAdmin(), handler)`

##### `requireSupport(options)`
- **Purpose**: Restricts access to Support users only
- **Options**:
  - `checkProjectAccess`: If true, verifies Support role for specific project
- **Usage**: `router.put('/tickets/:id', requireSupport(), handler)`

##### `requireCustomerOrSupport()`
- **Purpose**: Allows both Customer and Support users
- **Usage**: `router.post('/tickets', requireCustomerOrSupport(), handler)`

##### `requireAdminOrSupport()`
- **Purpose**: Allows both Admin and Support users
- **Usage**: `router.delete('/tickets/:id', requireAdminOrSupport(), handler)`

##### `requireRole(allowedRoles, options)`
- **Purpose**: Flexible middleware for custom role requirements
- **Parameters**:
  - `allowedRoles`: String or array of role names
  - `options`: Additional options including `checkProjectAccess`
- **Usage**: `router.get('/custom', requireRole(['Admin', 'Support']), handler)`

##### `checkProjectAccess`
- **Purpose**: Verifies user has any role for a specific project
- **Usage**: `router.get('/projects/:id/topics', checkProjectAccess, handler)`
- **Note**: Checks `req.params.id`, `req.body.projectId`, or `req.query.projectId`

## Route Protection Applied

### Organization Routes (`node-api/routes/organizationRoutes.js`)
- ✅ **POST** `/organizations` - `requireAdmin()`
- ✅ **PUT** `/organizations/:id` - `requireAdmin()`
- ✅ **DELETE** `/organizations/:id` - `requireAdmin()`
- ⚪ **GET** `/organizations` - No restriction (read access)
- ⚪ **GET** `/organizations/:id` - No restriction (read access)

### Project Routes (`node-api/routes/projectRoutes.js`)
- ✅ **POST** `/projects` - `requireAdmin()`
- ✅ **PUT** `/projects/:id` - `requireAdmin()`
- ✅ **DELETE** `/projects/:id` - `requireAdmin()`
- ✅ **GET** `/projects/:id/topics` - `checkProjectAccess`
- ⚪ **GET** `/projects` - No restriction (read access)
- ⚪ **GET** `/projects/:id` - No restriction (read access)

### Topic Routes (`node-api/routes/topicRoutes.js`)
- ✅ **POST** `/topics` - `requireAdmin({ checkProjectAccess: true })`
- ✅ **PUT** `/topics/:id` - `requireAdmin({ checkProjectAccess: true })`
- ✅ **DELETE** `/topics/:id` - `requireAdmin({ checkProjectAccess: true })`
- ⚪ **GET** `/topics` - No restriction (read access)
- ⚪ **GET** `/topics/:id` - No restriction (read access)

### Ticket Routes (`node-api/routes/ticketRoutes.js`)
- ✅ **POST** `/tickets` - `requireCustomerOrSupport()` (Customers can create tickets)
- ✅ **PUT** `/tickets/:id` - `requireSupport()` (Only Support can update tickets)
- ✅ **PUT** `/tickets/:id/status/:status` - `requireSupport()` (Only Support can change status)
- ✅ **DELETE** `/tickets/:id` - `requireAdminOrSupport()` (Admin or Support can delete)
- ⚪ **GET** `/tickets` - No restriction (filtered by user's projects in handler)
- ⚪ **GET** `/tickets/:id` - No restriction (filtered by user's projects in handler)

### Support Team Routes (`node-api/routes/supportTeamRoutes.js`)
- ✅ **POST** `/support-teams` - `requireAdmin()`
- ✅ **PUT** `/support-teams/:id` - `requireAdmin()`
- ✅ **DELETE** `/support-teams/:id` - `requireAdmin()`
- ⚪ **GET** `/support-teams` - No restriction (read access)
- ⚪ **GET** `/support-teams/:id` - No restriction (read access)

### Support Schedule Routes (`node-api/routes/supportScheduleRoutes.js`)
- ✅ **POST** `/support-schedules` - `requireAdmin()`
- ✅ **PUT** `/support-schedules/:id` - `requireAdmin()`
- ✅ **DELETE** `/support-schedules/:id` - `requireAdmin()`
- ⚪ **GET** `/support-schedules` - No restriction (read access)
- ⚪ **GET** `/support-schedules/:id` - No restriction (read access)

### User Role Routes (`node-api/routes/userRoleRoutes.js`)
- ✅ **POST** `/user-roles` - `requireAdmin()` (Only Admin can assign roles)
- ✅ **PUT** `/user-roles/:id` - `requireAdmin()` (Only Admin can update roles)
- ✅ **DELETE** `/user-roles/:id` - `requireAdmin()` (Only Admin can remove roles)

## Role Permissions Summary

### Admin Role
- ✅ Manage organizations (create, update, delete)
- ✅ Manage projects (create, update, delete)
- ✅ Manage topics (create, update, delete)
- ✅ Manage support teams (create, update, delete)
- ✅ Manage support schedules (create, update, delete)
- ✅ Assign user roles
- ✅ Delete tickets
- ⚪ Read access to all resources

### Support Role
- ✅ Create tickets
- ✅ Update tickets
- ✅ Change ticket status
- ✅ Delete tickets
- ✅ View tickets (filtered by projects they have access to)
- ⚪ Read access to all resources

### Customer Role
- ✅ Create tickets
- ✅ View tickets (filtered by projects they have access to)
- ❌ Cannot update tickets
- ❌ Cannot delete tickets
- ❌ Cannot manage organizations, projects, topics, teams, or schedules

## How It Works

1. **Authentication**: User logs in and receives JWT token containing user info and roles
2. **Token Validation**: `authenticate` middleware validates token and attaches `req.user` and `req.roles`
3. **Role Checking**: Role middleware checks if user has required role(s)
4. **Project-Specific Access**: Some middleware can verify role for specific project
5. **Authorization**: Request proceeds if authorized, otherwise returns 403 Forbidden

## Example Flow

```
User Request → authenticate middleware → requireAdmin() → Route Handler
                ↓
            Extract roles from JWT
                ↓
            Check if user has 'Admin' role
                ↓
            Allow/Deny access
```

## Error Responses

- **401 Unauthorized**: No token provided or invalid token
- **403 Forbidden**: User doesn't have required role
- **400 Bad Request**: Missing required parameters (e.g., projectId)

## Notes

1. **Project-Specific Roles**: Users can have different roles for different projects
2. **Read Access**: Most GET endpoints are not restricted (data filtering happens in handlers)
3. **Flexible Middleware**: `requireRole()` allows custom role combinations
4. **Project Access Check**: `checkProjectAccess` verifies user has any role for a project
5. **JWT Token**: Roles are embedded in JWT during login, reducing database queries

## Future Enhancements

- [ ] Add organization-level Admin role (currently only project-level)
- [ ] Add time-based role restrictions
- [ ] Add IP-based access restrictions
- [ ] Add audit logging for authorization failures
- [ ] Add role hierarchy (e.g., Admin inherits Support permissions)
