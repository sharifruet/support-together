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

export default function SupportList() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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
          <InboxIcon style={{color:'blue'}}/>
        </ListItemIcon>
        <ListItemText primary="Inbox"/>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DeleteIcon style={{color:'red'}}/>
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </ListItemButton>
    </List>
  );
}
