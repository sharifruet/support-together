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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const gContext = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ email, password }),
                { headers: { "Content-Type": "application/json" } }
            );

            const accessToken = response?.data?.token;
            if (accessToken) {
                gContext.loginSuccess(response?.data);
                navigate("/dashboard");
            } else {
                setError("Invalid response from server");
            }
        } catch (err) {
            if (!err.response) {
                setError("No Server Response");
            } else if (err.response.status === 400) {
                setError("Missing Username or Password");
            } else if (err.response.status === 401) {
                setError("Unauthorized");
            } else {
                setError("Login Failed");
            }
        } finally {
            setLoading(false);
        }
    };

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
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            error={Boolean(error && !email)}
                            helperText={error && !email && error}
                            disabled={loading}
                            aria-label="email"
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
                            error={Boolean(error && !password)}
                            helperText={error && !password && error}
                            disabled={loading}
                            autoComplete="current-password"
                            aria-label="password"
                        />

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: loading ? 'grey' : 'primary.main',
                                '&:hover': {
                                    backgroundColor: loading ? 'grey' : 'primary.dark',
                                },
                                // This ensures the correct application of the cursor property.
                                '.Mui-disabled &': {
                                    cursor: 'not-allowed',
                                }
                            }}
                            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        {error && (
                            <Box sx={{ color: 'error.main', textAlign: 'center' }}>{error}</Box>
                        )}
                        <Grid container>
                            <Grid item xs>
                                <Link href="/ForgotPass" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Please Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
