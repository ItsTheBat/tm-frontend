import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, FormControl, InputLabel, Link, MenuItem, Select } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

const theme = createTheme();

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [alertType, setAlertType] = useState('error');
    const [role, setRole] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = async (event) => {
        const data = new FormData(event.currentTarget);
        event.preventDefault();
        setUsername(data.get('username'));
        setPassword(data.get('password'));
        let signUpData = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            employeeId: data.get('employeeId'),
            companyId: data.get('companyId'),
            companyName: data.get('companyName'),
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            roles: [data.get('role')]
        };
        await signup(signUpData).then(() => {
            if (error) {
                setErrMsg(error);
                setAlertType('error');
            } else {
                setErrMsg('User Registered Successfully.');
                setAlertType('success');
                document.querySelectorAll('input').forEach(
                    input => (input.value = "")
                );
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Insert User
                    </Typography>
                    {isLoading ? <Alert id='err-alert' severity={alertType}
                        aria-live="assertive" sx={{ mt: 2 }}>{errMsg}</Alert> : null}
                    <Box component="form" id='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="User Name"
                                    name="username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="companyId"
                                    label="Company ID"
                                    name="companyId"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="companyName"
                                    label="Company Name"
                                    name="companyName"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="employeeId"
                                    label="Employee ID"
                                    name="employeeId"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="role-simple-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-simple-select-label"
                                        id="role"
                                        value={role}
                                        label="Role"
                                        name="role"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'ROLE_USER'}>User / Employee</MenuItem>
                                        <MenuItem value={'ROLE_MANAGER'}>Manager</MenuItem>
                                        <MenuItem value={'ROLE_ADMIN'}>Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
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
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        > Insert </Button>
                        <Grid container>
                            <Grid item xs>
                                {/* <Link href="#" variant="body2">
                                    Forgot password?
                                </Link> */}
                            </Grid>
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}