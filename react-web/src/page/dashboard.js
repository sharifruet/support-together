import  React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import SupportList from '../component/supportleftmenu';
import Grid from '@mui/material/Grid';
import { Card } from 'react-bootstrap';
import ProjectList from '../component/projectlist';

const drawerWidth = 0;

const defaultTheme = createTheme();
export default function Dashboard() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box>
        <CssBaseline />

        <Grid container>
          <Grid item xs={2}>
            <Card style={{background:'#555',color:'#fff',height:'550px'}}><SupportList/></Card>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
              <ProjectList/>
              <br/><br/>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}