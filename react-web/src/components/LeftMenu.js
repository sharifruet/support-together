import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import List from '@mui/material/List';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Email, SupportAgent, LockResetOutlined, Schedule, LocalActivityOutlined, CorporateFare, BusinessCenter, Topic } from '@mui/icons-material';
import GlobalContext from '../GlobalContext';

const LeftMenu = () => {
    const location = useLocation();
    const { user } = useContext(GlobalContext);

    // Function to check if a role is allowed for the current user
    const isRoleAllowed = (roles) => {
        const userRoles = user?.roles?.map(userRole => userRole?.role) || [];
        const allowedRoles = roles.split(',').map(role => role.trim());
        return allowedRoles.some(role => userRoles.includes(role));
    };

    const getColor = (path) => location.pathname.endsWith(path) ? '#14DB8D' : '#fff';

    return (
        <List>
            <ListItemButton
                selected={location.pathname === '/dashboard'}
                component={Link}
                to="/dashboard"
            >
                <ListItemIcon style={{ minWidth: "36px" }}>
                    <Dashboard style={{ color: getColor('/dashboard') }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" style={{ color: getColor('/dashboard') }} />
            </ListItemButton>

            <ListItemButton
                selected={location.pathname === '/tickets'}
                component={Link}
                to="/tickets"
            >
                <ListItemIcon style={{ minWidth: "36px" }}>
                    <LocalActivityOutlined style={{ color: getColor('/tickets'), fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Tickets" style={{ color: getColor('/tickets') }} />
            </ListItemButton>

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/emailTemplates'}
                    component={Link}
                    to="/emailTemplates"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <Email style={{ color: getColor('/emailTemplates') }} />
                    </ListItemIcon>
                    <ListItemText primary="Email Templates" style={{ color: getColor('/emailTemplates') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname.endsWith('/organizations')}
                    component={Link}
                    to="/organizations"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <CorporateFare style={{ color: getColor('/organizations') }} />
                    </ListItemIcon>
                    <ListItemText primary="Organizations" style={{ color: getColor('/organizations') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname.endsWith('/projects')}
                    component={Link}
                    to="/projects"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <BusinessCenter style={{ color: getColor('/projects') }} />
                    </ListItemIcon>
                    <ListItemText primary="Projects" style={{ color: getColor('/projects') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/topics'}
                    component={Link}
                    to="/topics"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <Topic style={{ color: getColor('/topics') }} />
                    </ListItemIcon>
                    <ListItemText primary="Topics" style={{ color: getColor('/topics') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/supportTeams'}
                    component={Link}
                    to="/supportTeams"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <SupportAgent style={{ color: getColor('/supportTeams') }} />
                    </ListItemIcon>
                    <ListItemText primary="Support Team" style={{ color: getColor('/supportTeams') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin, Support') && (
                <ListItemButton
                    selected={location.pathname === '/supportTeamSchedule'}
                    component={Link}
                    to="/supportTeamSchedule"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <Schedule style={{ color: getColor('/supportTeamSchedule') }} />
                    </ListItemIcon>
                    <ListItemText primary="Support Team Schedule" style={{ color: getColor('/supportTeamSchedule') }} />
                </ListItemButton>
            )}

            <ListItemButton
                selected={location.pathname === '/changePassword'}
                component={Link}
                to="/changePassword"
            >
                <ListItemIcon style={{ minWidth: "36px" }}>
                    <LockResetOutlined style={{ color: getColor('/changePassword'), fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Change Password" style={{ color: getColor('/changePassword') }} />
            </ListItemButton>
        </List>
    );
};

export default LeftMenu;
