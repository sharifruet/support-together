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
    const [openInbox, setOpenInbox] = useState(false);
    const { user } = useContext(GlobalContext); // Get user data from context

    useEffect(() => {
        if (location.pathname.endsWith('/topics')) {
            setOpenInbox(true);
        }
    }, [location.pathname]);

    // Function to check if a role is allowed for the current user
    const isRoleAllowed = (role) => {
        //console.log(user);
        const roles = user?.roles?.map(userRole => userRole?.role);
        return roles?.includes(role);
    };

    return (
        <List>

            <ListItemButton
                selected={location.pathname === '/dashboard'}
                component={Link}
                to="/dashboard"
            >
                <ListItemIcon>
                    <DashboardIcon style={{ color: location.pathname.endsWith('/dashboard') ? '#14DB8D' : '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" style={{ color: location.pathname.endsWith('/dashboard') ? '#14DB8D' : '#fff' }} />
            </ListItemButton>

            <ListItemButton
                selected={location.pathname === '/dashboard/tickets'}
                component={Link}
                to="/dashboard/tickets"
            >
                <ListItemIcon>
                    <LocalActivityOutlinedIcon style={{ color: location.pathname.endsWith('/tickets') ? '#14DB8D' : '#fff', fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Tickets" style={{ color: location.pathname.endsWith('/tickets') ? '#14DB8D' : '#fff' }} />
            </ListItemButton>

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/dashboard/emailTemplates'}
                    component={Link}
                    to="/dashboard/emailTemplates"
                >
                    <ListItemIcon>
                        <EmailIcon style={{ color: location.pathname.endsWith('/emailTemplates') ? '#14DB8D' : '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Email Templates" style={{ color: location.pathname.endsWith('/emailTemplates') ? '#14DB8D' : '#fff' }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname.endsWith('/organizations')}
                    component={Link}
                    to="/dashboard/organizations"
                >
                    <ListItemIcon>
                        <CorporateFareIcon style={{ color: location.pathname.endsWith('/organizations') ? '#14DB8D' : '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Organizations" style={{ color: location.pathname.endsWith('/organizations') ? '#14DB8D' : '#fff' }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname.endsWith('/projects')}
                    component={Link}
                    to="/dashboard/projects"
                >
                    <ListItemIcon>
                        <BusinessCenterIcon style={{ color: location.pathname.endsWith('/projects') ? '#14DB8D' : '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Projects" style={{ color: location.pathname.endsWith('/projects') ? '#14DB8D' : '#fff' }} />
                </ListItemButton>
            )}

            {isRoleAllowed('Admin') && (
                <ListItemButton
                    selected={location.pathname === '/dashboard/topics'}
                    component={Link}
                    to="/dashboard/topics"
                >
                    <ListItemIcon>
                        <TopicIcon style={{ color: location.pathname.endsWith('/topics') ? '#14DB8D' : '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Topics" style={{ color: location.pathname.endsWith('/topics') ? '#14DB8D' : '#fff' }} />
                </ListItemButton>
            )}
            <ListItemButton
                selected={location.pathname === '/dashboard/changePassword'}
                component={Link}
                to="/dashboard/changePassword"
            >
                <ListItemIcon>
                    <LockResetOutlinedIcon style={{ color: location.pathname.endsWith('/changePassword') ? '#14DB8D' : '#fff', fontSize: '24px' }} />
                </ListItemIcon>
                <ListItemText primary="Change Password" style={{ color: location.pathname.endsWith('/changePassword') ? '#14DB8D' : '#fff' }} />
            </ListItemButton>
        </List>
    );
};

export default LeftMenu;
