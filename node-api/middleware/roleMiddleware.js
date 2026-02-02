// middleware/roleMiddleware.js

/**
 * Role-based authorization middleware
 * 
 * Roles:
 * - Admin: Can manage organizations, projects, and topics
 * - Support: Can handle and assign support tickets
 * - Customer: Can create support tickets
 */

/**
 * Middleware to require Admin role
 * Checks if user has Admin role for any project (for organization-level operations)
 * or for a specific project (for project-level operations)
 */
const requireAdmin = (options = {}) => {
    return async (req, res, next) => {
        try {
            const roles = req.roles || [];
            
            // Check if user has Admin role
            const hasAdminRole = roles.some(role => role.role === 'Admin');
            
            if (!hasAdminRole) {
                return res.status(403).json({ 
                    error: 'Access denied. Admin role required.' 
                });
            }
            
            // If projectId is specified in options or request, verify Admin role for that project
            if (options.checkProjectAccess) {
                const projectId = req.body.projectId || req.params.projectId || req.query.projectId;
                if (projectId) {
                    const hasProjectAdminRole = roles.some(
                        role => role.role === 'Admin' && role.projectId === parseInt(projectId)
                    );
                    
                    if (!hasProjectAdminRole) {
                        return res.status(403).json({ 
                            error: 'Access denied. Admin role required for this project.' 
                        });
                    }
                }
            }
            
            next();
        } catch (error) {
            console.error('Error in requireAdmin middleware:', error);
            res.status(500).json({ error: 'Authorization check failed.' });
        }
    };
};

/**
 * Middleware to require Support role
 * Checks if user has Support role for any project or specific project
 */
const requireSupport = (options = {}) => {
    return async (req, res, next) => {
        try {
            const roles = req.roles || [];
            
            // Check if user has Support role
            const hasSupportRole = roles.some(role => role.role === 'Support');
            
            if (!hasSupportRole) {
                return res.status(403).json({ 
                    error: 'Access denied. Support role required.' 
                });
            }
            
            // If projectId is specified, verify Support role for that project
            if (options.checkProjectAccess) {
                const projectId = req.body.projectId || req.params.projectId || req.query.projectId;
                if (projectId) {
                    const hasProjectSupportRole = roles.some(
                        role => role.role === 'Support' && role.projectId === parseInt(projectId)
                    );
                    
                    if (!hasProjectSupportRole) {
                        return res.status(403).json({ 
                            error: 'Access denied. Support role required for this project.' 
                        });
                    }
                }
            }
            
            next();
        } catch (error) {
            console.error('Error in requireSupport middleware:', error);
            res.status(500).json({ error: 'Authorization check failed.' });
        }
    };
};

/**
 * Middleware to require Customer or Support role
 * Allows both Customer and Support users to access the route
 */
const requireCustomerOrSupport = (options = {}) => {
    return async (req, res, next) => {
        try {
            const roles = req.roles || [];
            
            // Check if user has Customer or Support role
            const hasRequiredRole = roles.some(
                role => role.role === 'Customer' || role.role === 'Support'
            );
            
            if (!hasRequiredRole) {
                return res.status(403).json({ 
                    error: 'Access denied. Customer or Support role required.' 
                });
            }
            
            next();
        } catch (error) {
            console.error('Error in requireCustomerOrSupport middleware:', error);
            res.status(500).json({ error: 'Authorization check failed.' });
        }
    };
};

/**
 * Middleware to require Admin or Support role
 * Allows both Admin and Support users to access the route
 */
const requireAdminOrSupport = (options = {}) => {
    return async (req, res, next) => {
        try {
            const roles = req.roles || [];
            
            // Check if user has Admin or Support role
            const hasRequiredRole = roles.some(
                role => role.role === 'Admin' || role.role === 'Support'
            );
            
            if (!hasRequiredRole) {
                return res.status(403).json({ 
                    error: 'Access denied. Admin or Support role required.' 
                });
            }
            
            next();
        } catch (error) {
            console.error('Error in requireAdminOrSupport middleware:', error);
            res.status(500).json({ error: 'Authorization check failed.' });
        }
    };
};

/**
 * Flexible middleware to require specific role(s)
 * @param {string|string[]} allowedRoles - Single role or array of roles
 * @param {object} options - Additional options
 */
const requireRole = (allowedRoles, options = {}) => {
    return async (req, res, next) => {
        try {
            const roles = req.roles || [];
            const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
            
            // Check if user has any of the required roles
            const hasRequiredRole = roles.some(role => roleArray.includes(role.role));
            
            if (!hasRequiredRole) {
                return res.status(403).json({ 
                    error: `Access denied. Required role(s): ${roleArray.join(', ')}` 
                });
            }
            
            // If projectId is specified, verify role for that project
            if (options.checkProjectAccess) {
                const projectId = req.body.projectId || req.params.projectId || req.query.projectId;
                if (projectId) {
                    const hasProjectRole = roles.some(
                        role => roleArray.includes(role.role) && role.projectId === parseInt(projectId)
                    );
                    
                    if (!hasProjectRole) {
                        return res.status(403).json({ 
                            error: `Access denied. Required role(s) for this project: ${roleArray.join(', ')}` 
                        });
                    }
                }
            }
            
            next();
        } catch (error) {
            console.error('Error in requireRole middleware:', error);
            res.status(500).json({ error: 'Authorization check failed.' });
        }
    };
};

/**
 * Middleware to check if user has access to a specific project
 * Used for project-specific operations
 */
const checkProjectAccess = async (req, res, next) => {
    try {
        const roles = req.roles || [];
        // Check params.id first (for routes like /projects/:id/topics)
        // Then params.projectId (e.g. /user-roles/project/:projectId), body, query
        const projectId = req.params.id || req.params.projectId || req.body.projectId || req.query.projectId;
        
        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required.' });
        }
        
        // Check if user has any role for this project
        const hasProjectAccess = roles.some(
            role => role.projectId === parseInt(projectId)
        );
        
        if (!hasProjectAccess) {
            return res.status(403).json({ 
                error: 'Access denied. You do not have access to this project.' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Error in checkProjectAccess middleware:', error);
        res.status(500).json({ error: 'Authorization check failed.' });
    }
};

module.exports = {
    requireAdmin,
    requireSupport,
    requireCustomerOrSupport,
    requireAdminOrSupport,
    requireRole,
    checkProjectAccess
};
