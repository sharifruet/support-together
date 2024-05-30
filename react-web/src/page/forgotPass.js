import React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "../api/axios";
const Forgotpass = "/forgot-password";
const defaultTheme = createTheme();

export default function ForgotPass() {
  const [email, setEmail] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
        const response = axios.post(
          Forgotpass,
            JSON.stringify({email}),
            { headers: { "Content-Type": "application/json" } }
        );
        console.log(response.data);
        alert("Please check your email");
      } catch (err) {
          if (!err.response) {
            alert("No Server Response. Please check your network connection.");
          } else {
              switch (err.response.status) {
                  case 400:
                    alert("Missing Email");
                      break;
                  case 401:
                    alert("Unauthorized. Incorrect Email");
                      break;
                  case 500:
                    alert("Internal Server Error. Please try again later.");
                      break;
                  default:
                    alert("Please try again.");
                      break;
              }
          }
      } 
  };

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
                Input your email address
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Send
                    </Button>
                    <Grid container>
                      <Grid item>
                          <Link href="/login" variant="body2">
                          {"Sign In"}
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