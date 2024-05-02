import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupportForm from '../component/supportform';
import SupportList from '../component/supportleftmenu';
import Grid from '@mui/material/Grid';
import { Card } from 'react-bootstrap';
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
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', 
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '3px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
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
          <Grid item xs={8}>
              <br/><br/>
              <SupportForm/>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}