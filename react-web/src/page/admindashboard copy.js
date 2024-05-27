import React from 'react';
import { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import OrgtList from '../component/organizationlist';
import Addorg from '../component/addorganization';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ViewListSharpIcon from '@mui/icons-material/ViewListSharp';
import Button from '@mui/material/Button';
import { Card } from 'react-bootstrap';

const drawerWidth = 0;
const Logout = () => {
  alert('Log out Successfully');
  window.location.replace('/Home');
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const defaultTheme = createTheme();
export default function Dashboard() {
  const [isAddorg, setIsAddorg] = useState(false);
  const [isListorg, setIsListorg] = useState(true);
  const toggleAddorg = () => {
    setIsAddorg(!isAddorg);
    setIsListorg(!isListorg);
  };
  const toggleListorg = () => {
    setIsListorg(!isListorg);
    setIsAddorg(isAddorg);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        <CssBaseline />

        <Grid container>
          <Grid item xs={2}>
            <Card style={{ background: '#555', color: '#fff', height: '550px' }}>
              <List
                sx={{ width: '100%', maxWidth: 360 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader" style={{ background: '#555', color: '#fff' }}>
                    <strong>ADMIN ACTIVITY</strong><hr />
                  </ListSubheader>
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ViewListSharpIcon style={{ color: '#14DB8D' }} />
                  </ListItemIcon>
                  <Button size="small" style={{ color: '#FFFFFF' }} variant="outlined" onClick={toggleListorg}>Organization List</Button>

                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <AddCircleIcon style={{ color: 'yellow' }} />
                  </ListItemIcon>
                  <Button size="small" style={{ color: '#FFFFFF' }} variant="outlined" onClick={toggleAddorg}>Organization Add</Button>
                </ListItemButton>
              </List>
            </Card>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            {isListorg && <OrgtList />}
            {isAddorg && <Addorg />}
            <br /><br />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}