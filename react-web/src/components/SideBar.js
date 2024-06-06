import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Card from '@mui/material/Card';
import { Outlet } from 'react-router-dom'; // Import Outlet from react-router-dom
import LeftMenu from './LeftMenu'; // Adjust the import path as necessary

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      height: '550px',
      backgroundColor: 'transparent',
      color: '#fff',
      borderRight: 0,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(6),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

const SideBar = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" open={open}>
          <Card style={{ background: '#555', color: '#fff', height: '550px', borderRadius: '0 10px 10px 0' }}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                {open ? <ChevronLeftIcon style={{ color: "#fff" }} /> : <ChevronRightIcon style={{ color: "#fff" }} />}
              </IconButton>
            </Toolbar>
            <Divider style={{ background: "#fff" }} />
            <LeftMenu />
          </Card>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.white : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {/* <Toolbar /> */}
          <Container maxWidth="xl">
            <Outlet /> {/* This is where the nested routes will be rendered */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SideBar;
