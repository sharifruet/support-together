import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TopicIcon from '@mui/icons-material/Topic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import StarBorder from '@mui/icons-material/StarBorder';

export default function LeftMenu() {
    const location = useLocation();
    const [openInbox, setOpenInbox] = useState(false);

    useEffect(() => {
        if (location.pathname.startsWith('/dashboard/topics')) {
            setOpenInbox(true);
        }
    }, [location.pathname]);

   

    const handleInboxClick = () => {
        setOpenInbox(!openInbox);
    };

    return (
        <List>
            <ListItemButton
                selected={location.pathname === '/dashboard'}
                component={Link}
                to="/dashboard"
            >
                <ListItemIcon>
                    <DashboardIcon style={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton
                selected={location.pathname === '/dashboard/emailTemplates'}
                component={Link}
                to="/dashboard/emailTemplates"
            >
                <ListItemIcon>
                    <EmailIcon style={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Email Template" />
            </ListItemButton>

            <ListItemButton
                selected={location.pathname.startsWith('/dashboard/organizations')}
                component={Link}
                to="/dashboard/organizations"
            >
                <ListItemIcon>
                    <CorporateFareIcon style={{ color: '#14DB8D' }} />
                </ListItemIcon>
                <ListItemText primary="Organization" />
            </ListItemButton>
            <ListItemButton
                selected={location.pathname.startsWith('/dashboard/projects')}
                component={Link}
                to="/dashboard/projects"
            >
                <ListItemIcon>
                    <BusinessCenterIcon style={{ color: '#14DB8D' }} />
                </ListItemIcon>
                <ListItemText primary="Project" />
            </ListItemButton>
            <ListItemButton
                selected={location.pathname === '/dashboard/topics'}
                component={Link}
                to="/dashboard/topics"
            >
                <ListItemIcon>
                    <TopicIcon style={{ color: '#14DB8D' }} />
                </ListItemIcon>
                <ListItemText primary="Topic" />
            </ListItemButton>


            <ListItemButton
                selected={location.pathname === '/dashboard/organization-add'}
                component={Link}
                to="/dashboard/organization-add"
            >
                <ListItemIcon>
                    <AddCircleIcon style={{ color: 'yellow' }} />
                </ListItemIcon>
                <ListItemText primary="Organization Add" />
            </ListItemButton>

            <ListItemButton
                selected={location.pathname.startsWith('/dashboard/inbox')}
                onClick={handleInboxClick}
            >
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
                {openInbox ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openInbox} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
