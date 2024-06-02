import  React, { useContext, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import SupportList from '../components/supportleftmenu';
import Grid from '@mui/material/Grid';
import { Card } from 'react-bootstrap';
import ProjectList from '../components/projectlist';
import GlobalContext from '../GlobalContext';

const defaultTheme = createTheme();

export default function Dashboard() {
  const { loggedIn, onLogout } = useContext(GlobalContext);
  useEffect(()=>{
    console.log('here')
    if(!loggedIn){
      onLogout();
    }
  },[loggedIn]);
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        {/* <CssBaseline /> */}

        <Grid container>
          <Grid item xs={2}>
            {/* <Card style={{background:'#555',color:'#fff',height:'550px'}}><SupportList/></Card> */}
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
              <ProjectList/>
              <br/><br/>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}