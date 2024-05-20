import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useContext } from 'react';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = "/login"; 


const defaultTheme = createTheme();

export default function LogReg() {

  let [ email, setUsername ] = useState();
  let [ password, setPassword ] = useState();

  const gContext = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          
        }
      );
      //console.log(response.data);
      const accessToken = response?.data?.token;
      //console.log(response.data.userRoles);
      if(accessToken !==''){
         gContext.loginSuccess(response?.data);
         navigate("/Dashboard");
         // window.location.replace('/Dashboard');
      }

    } catch (err) {
      if (!err?.response) {
        alert("No Server Response");
      } else if (err.response?.status === 400) {
        alert("Missing Username or Password");
      } else if (err.response?.status === 401) {
        alert("Unauthorized");
      } else {
        alert("Login Failed");
      }
    }
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   await fetch( 
  //     'https://support.i2gether.com/api/login', 
  //     {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json; charset=utf-8"
  //     },
  //     body: JSON.stringify({
  //       email, password
  //     })
  //   })
    
  //   .then(response => { return response.json();})
  //   window.location.replace('/Dashboard');
  // }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
            <Box
            sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Email Address"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={e => setUsername(e.target.value)}
                    value={email}
                    />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    autoComplete="current-password"
                    />
                    <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                    >
                    Sign In
                    </Button>
                    <Grid container>
                      <Grid item xs>
                          <Link href="/ForgotPass" variant="body2">
                          Forgot password?
                          </Link>
                      </Grid>
                      <Grid item>
                          <Link href="/signup" variant="body2">
                          {"Don't have an account?Please Sign Up"}
                          </Link>
                      </Grid>
                    </Grid>
                </Box>
            </Box>
            <h1><br/><br/><br/></h1>
      </Container>
    </ThemeProvider>
  );
}