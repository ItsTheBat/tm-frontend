import * as React from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignin } from '../hooks/useLogin';

const theme = createTheme();

export default function SignIn() {
    const navigate = useNavigate();
    const userRef = useRef();
    const errRef = useRef();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const { signin, error, isLoading, loginData } = useSignin();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user === null || user === undefined || user === '') {
            setErrMsg('');
        } else {
            navigate('/dashboard');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let loginCreds = {
            "username": username,
            "password": password,
        };
        await signin(loginCreds).then(() => {
            if (error) {
                setErrMsg(error);
            } else {
                navigate("/dashboard");
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            {(user === null || user === undefined || user === '') ? (<Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                        Sign in
                    </Typography>
                    {error ? <Alert id='err-alert' severity="error" ref={errRef}
                        aria-live="assertive" sx={{ mt: 2 }}>{errMsg}</Alert> : null}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            type="text"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoComplete="off"
                            ref={userRef}
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            autoComplete="off"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 4, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                {/* <Link href="#" variant="body2">
                                    Forgot password?
                                </Link> */}
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>) : (null)}
        </ThemeProvider>
    );
}