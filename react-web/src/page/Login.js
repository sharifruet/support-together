import React, { useState, useContext } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, Grid, Box, Container, Checkbox } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import GlobalContext from '../GlobalContext';

const LOGIN_URL = "/login";
const defaultTheme = createTheme();

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { loginSuccess } = useContext(GlobalContext);
    const navigate = useNavigate();

    const validateFields = () => {
        let isValid = true;

        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

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
                loginSuccess(response.data);
                navigate("/dashboard");
            } else {
                setError("Invalid response from server");
            }
        } catch (err) {
            if (!err.response) {
                setError("No Server Response. Please check your network connection.");
            } else {
                switch (err.response.status) {
                    case 400:
                        setError("Missing Email or Password");
                        break;
                    case 401:
                        setError("Unauthorized. Incorrect Email or Password");
                        break;
                    case 500:
                        setError("Internal Server Error. Please try again later.");
                        break;
                    default:
                        setError("Login Failed. Please try again.");
                        break;
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                            error={Boolean(emailError)}
                            helperText={emailError}
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
                            error={Boolean(passwordError)}
                            helperText={passwordError}
                            disabled={loading}
                            autoComplete="current-password"
                            aria-label="password"
                        />
                        <div className="text-left">
                            <FormControlLabel
                                control={<Checkbox sx={{ paddingLeft: 0 }} value="remember" color="primary" />}
                                label="Remember me"
                                sx={{ alignSelf: 'flex-start', ml: 0 }}
                            />
                        </div>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: loading ? 'grey' : 'primary.main',
                                '&:hover': { backgroundColor: loading ? 'grey' : 'primary.dark' },
                                '&.MuiButton-disabled': { cursor: 'not-allowed' }
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        {error && <Box sx={{ color: 'error.main', textAlign: 'center' }}>{error}</Box>}
                        <Grid container sx={{ mt: 2, justifyContent: 'space-between' }}>
                            <Grid item>
                                <Link role="button" to="/forgotPass" className="text-primary" style={{ textDecoration: 'none', fontSize: '14px', '&:hover': { color: 'primary.dark', textDecoration: 'underline' } }}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                Don't have account?
                                <Link to="/signup" className="text-primary" style={{ textDecoration: 'none', fontSize: '14px', '&:hover': { color: 'primary.dark', textDecoration: 'underline' } }}>
                                    <span className="ms-1">Sign Up</span>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
