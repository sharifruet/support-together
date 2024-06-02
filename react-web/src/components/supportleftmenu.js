import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ViewListSharpIcon from '@mui/icons-material/ViewListSharp';
export default function SupportList() {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" style={{background:'#555',color:'#fff'}}>
          <strong>SUPPORT ACTIVITY</strong><hr/>
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <AddCircleIcon style={{color:'#14DB8D'}}/>
        </ListItemIcon>
        <ListItemText primary="Create Ticket" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <ViewListSharpIcon style={{color:'#1BC8DB'}}/>
        </ListItemIcon>
        <ListItemText  primary="Ticket List" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <SendIcon  style={{color:'#fff'}}/>
        </ListItemIcon>
        <ListItemText primary="Sent Ticket" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon style={{color:'yellow'}}/>
        </ListItemIcon>
        <ListItemText primary="Drafts"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <InboxIcon style={{color:'#DCA42F'}}/>
        </ListItemIcon>
        <ListItemText primary="Inbox"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DeleteIcon style={{color:'#DB3C39'}}/>
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </ListItemButton>
    </List>
  );
}
