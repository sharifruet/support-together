import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';

const defaultTheme = createTheme();

export default function LogReg() {

  let [ username, setUsername ] = useState();
  let [ password, setPassword ] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch( 
      `https://harunor-rashid-openshop-backend-v2.onrender.com/api/auth/signin`, 
      {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        username, password
      })
    })
    .then(response => { return response.json();})
    .then(responseData => {
      if(responseData.message === 'Login Successfully') {
        alert(responseData.message)
        window.location.replace('/Dashboard');
      } else {
        alert(responseData.message)
      }
    })
  }

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
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={e => setUsername(e.target.value)}
                    value={username}
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