import  React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupportList from '../component/supportleftmenu';
import Grid from '@mui/material/Grid';
import { Card } from 'react-bootstrap';
import ProjectList from '../component/projectlist';
import TicketList from '../component/ticketlist';
const drawerWidth = 0;
const Logout = () =>{
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

//   const token = localStorage.getItem('accessToken');
// if(!token) {
//   window.location.replace('/Home');
// }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        <CssBaseline />
        <AppBar>
          <Toolbar
            sx={{
              pr: '14px', 
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Open Ticket
            </Typography>
            <IconButton color="inherit">
                <LogoutIcon onClick={Logout}/>&nbsp; &nbsp;
                <ManageAccountsIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={3}>
            <Card style={{background:'#555',color:'#fff',height:'550px'}}><SupportList/></Card>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={7}>
              <TicketList/>
              <br/><br/>
              <ProjectList/>
              <br/><br/>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}