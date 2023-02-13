import DashboardIcon from '@mui/icons-material/Dashboard';
import Add from '@mui/icons-material/Add';
import Logout from '@mui/icons-material/Logout';
import { Button, FormLabel, IconButton, TextField, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Tasks from '../task/TaskList';
import SearchIcon from '@mui/icons-material/Search';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const mdTheme = createTheme();

function DashboardContent() {
    const navigate = useNavigate();
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    }

    const handleCreate = (e) => {
        e.preventDefault();
        navigate("/createTask");
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user.roles[0] === ('ROLE_MANAGER');

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute">
                    <Toolbar>
                        <DashboardIcon />
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, padding: '0px 0px 0px 8px' }}
                        >Dashboard
                        </Typography>
                        {user && (
                            <Grid item>
                                <FormLabel>{user.fullName}</FormLabel>
                                <Tooltip title="Logout">
                                    <IconButton color="error" onClick={handleLogout} key={user.username}>
                                        <Logout />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        )}
                    </Toolbar>
                </AppBar>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '92.9vh',
                        margin: '60px 0px 0px 0px',
                        overflow: 'auto',
                    }}
                >
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {/* Search & Button */}
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        height: 70,
                                        padding: '0px 16px 0px 16px'
                                    }}
                                >
                                    <TextField
                                        id="filled-search"
                                        label="Search Task"
                                        type="search"
                                        startIcon={<SearchIcon />}
                                        variant="standard"
                                        sx={{
                                            width: '100%',
                                            height: '60px',
                                            margin: '8px 16px 0px 0px'
                                        }}
                                    />
                                    {isManager &&
                                        <Button
                                            variant='contained'
                                            startIcon={<Add />}
                                            sx={{ mt: 2, mb: 2, width: 160 }}
                                            onClick={handleCreate}
                                        >
                                            Task
                                        </Button>
                                    }
                                </Paper>
                            </Grid>
                            {/* Task View */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Tasks />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}