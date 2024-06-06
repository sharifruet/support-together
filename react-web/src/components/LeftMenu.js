import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import TopicIcon from '@mui/icons-material/Topic';
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
                    <DashboardIcon style={{ color: getColor('/dashboard') }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" style={{ color: getColor('/dashboard') }} />
            </ListItemButton>

            <ListItemButton
                selected={location.pathname === '/dashboard/tickets'}
                component={Link}
                to="/dashboard/tickets"
            >
                <ListItemIcon style={{ minWidth: "36px" }}>
                    <LocalActivityOutlinedIcon style={{ color: getColor('/tickets'), fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Tickets" style={{ color: getColor('/tickets') }} />
            </ListItemButton>

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/dashboard/emailTemplates'}
                    component={Link}
                    to="/dashboard/emailTemplates"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <EmailIcon style={{ color: getColor('/emailTemplates') }} />
                    </ListItemIcon>
                    <ListItemText primary="Email Templates" style={{ color: getColor('/emailTemplates') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname.endsWith('/organizations')}
                    component={Link}
                    to="/dashboard/organizations"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <CorporateFareIcon style={{ color: getColor('/organizations') }} />
                    </ListItemIcon>
                    <ListItemText primary="Organizations" style={{ color: getColor('/organizations') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname.endsWith('/projects')}
                    component={Link}
                    to="/dashboard/projects"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <BusinessCenterIcon style={{ color: getColor('/projects') }} />
                    </ListItemIcon>
                    <ListItemText primary="Projects" style={{ color: getColor('/projects') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/dashboard/topics'}
                    component={Link}
                    to="/dashboard/topics"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <TopicIcon style={{ color: getColor('/topics') }} />
                    </ListItemIcon>
                    <ListItemText primary="Topics" style={{ color: getColor('/topics') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/dashboard/supportteam'}
                    component={Link}
                    to="/dashboard/supportteam"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <TopicIcon style={{ color: getColor('/supportteam') }} />
                    </ListItemIcon>
                    <ListItemText primary="Support Team" style={{ color: getColor('/supportteam') }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin, Support') && (
                <ListItemButton
                    selected={location.pathname === '/dashboard/supportTeamSchedule'}
                    component={Link}
                    to="/dashboard/supportTeamSchedule"
                >
                    <ListItemIcon style={{ minWidth: "36px" }}>
                        <TopicIcon style={{ color: getColor('/supportTeamSchedule') }} />
                    </ListItemIcon>
                    <ListItemText primary="Support Team Schedule" style={{ color: getColor('/supportTeamSchedule') }} />
                </ListItemButton>
            )}

            <ListItemButton
                selected={location.pathname === '/dashboard/changePassword'}
                component={Link}
                to="/dashboard/changePassword"
            >
                <ListItemIcon style={{ minWidth: "36px" }}>
                    <LockResetOutlinedIcon style={{ color: getColor('/changePassword'), fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Change Password" style={{ color: getColor('/changePassword') }} />
            </ListItemButton>
        </List>
    );
};

export default LeftMenu;
