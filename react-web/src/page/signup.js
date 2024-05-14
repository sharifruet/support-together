import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { useState } from 'react';
import axios from "../api/axios";

const REGISTER_URL = "/register";



const defaultTheme = createTheme();
function Signup() {
  let [ name, setName ] = useState("");
  let [ email, setEmail ] = useState("");
  let [ phoneNo, setPhoneNumber ] = useState("");
  let [ password, setPassword ] = useState("");

   //console.log(name,email,phoneNo,password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({name, email, phoneNo, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
     // const accessToken = response?.data?.accessToken;
      // console.log(accessToken);
      // if(accessToken !=''){
      //   window.location.replace('/Dashboard');
      // }

    } catch (err) {
      if (!err?.response) {
        alert("No Server Response");
      } else if (err.response?.status === 400) {
        alert("Missing data");
      } else if (err.response?.status === 401) {
        alert("Unauthorized");
      } else {
        alert("Registration Failed");
      }
    }
  };
  //  const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   await fetch(
  //     `https://harunor-rashid-openshop-backend-v2.onrender.com/api/auth/signup`, 
  //     {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       username, password, email
  //     })
  //   })
  //   .then(response => { return response.json();})
  //   .then(responseData => {
  //     if(responseData.message === 'Registration Successfully Completed') {
  //       alert(responseData.message)
  //       window.location.replace('/loginreg');
  //     } else {
  //       alert(responseData.message)
  //     }
  //   })
  //  }
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={e => setName(e.target.value)}
                  value={name}
                />
              </Grid>
             
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phoneno"
                  label="Phone Number"
                  name="phoneno"
                  autoComplete="phoneno"
                  onChange={e => setPhoneNumber(e.target.value)}
                  value={phoneNo}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onSubmit={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <br/>
                <Link href="/loginreg" variant="body2">
                  Already have an account? Please Sign in
                </Link>
              </Grid>
            </Grid>
            <Grid> <br/><br/></Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default  Signup;