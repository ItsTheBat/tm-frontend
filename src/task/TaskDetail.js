import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Logout from '@mui/icons-material/Logout';
import { Chip, FormLabel, IconButton, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from "axios";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';


const mdTheme = createTheme();
const TASKDETAIL_URL = '/api/task/getTaskDetail';
const TASKDELETE_URL = '/api/task/deleteTask';

export default function Task(props) {
    const { state } = useLocation();
    const taskId = state === null ? JSON.parse(localStorage.getItem('taskId')) : state.taskId;
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user.roles[0] === ('ROLE_MANAGER');
    const [errMsg, setErrMsg] = useState('');
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const { logout } = useLogout();
    const [taskData, setTaskData] = useState(null);
    const [taskPeriod, setTaskPeriod] = useState(null);

    const handleLogout = () => {
        logout();
    }

    const handleDialogOk = async () => {
        let taskData = {
            "taskId": taskId,
            "roles": user.roles
        };
        await axios.post(
            TASKDELETE_URL,
            JSON.stringify(taskData),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
        ).then((response) => {
            if (response?.status === 200) {
                localStorage.removeItem('taskId');
                localStorage.setItem('isDeleteTask', JSON.stringify(true));
                handleBack();
            }
        }).catch((err) => {
            if (!err?.response) {
                console.log('No Server Response. Please try after sometime.');
            } else if (err.response?.status === 400) {
                console.log('Task details not found.');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized access.');
            } else {
                console.log('Task details not found.');
            }
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        handleDetailView();
    }, []);

    const handleBack = () => {
        navigate("/dashboard");
    }

    const handleEdit = () => {
        //TODO :
    }

    const handleDelete = (event) => {
        setOpen(true);
    }

    const handleDetailView = async (event) => {
        let taskData = {
            "taskId": taskId,
            "roles": user.roles
        };
        await axios.post(
            TASKDETAIL_URL,
            JSON.stringify(taskData),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
        ).then((response) => {
            if (response?.status === 200) {
                setTaskPeriod(response?.data?.startDate + ' to ' + response?.data?.endDate);
                setTaskData(response?.data);
            }
        }).catch((err) => {
            if (!err?.response) {
                console.log('No Server Response. Please try after sometime.');
            } else if (err.response?.status === 400) {
                console.log('Task details not found.');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized access.');
            } else {
                console.log('Task details not found.');
            }
        });
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute">
                    <Toolbar>
                        <Grid item sx={{ width: '50%' }}>
                            <Tooltip title="Back to Dashboard">
                                <IconButton sx={{ color: '#fff' }} onClick={handleBack} >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item sx={{
                            width: '50%', display: 'flex', flexDirection: 'row',
                            alignItems: 'center', flexFlow: 'row-reverse'
                        }}>
                            {user && (
                                <Grid>
                                    <Tooltip title="Logout">
                                        <IconButton color="error" onClick={handleLogout} key={user.username}>
                                            <Logout />
                                        </IconButton>
                                    </Tooltip>
                                    <FormLabel>{user.fullName}</FormLabel>
                                </Grid>
                            )}
                        </Grid>

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
                        <Grid container spacing={1}>
                            {/* Edit, Delete Button */}
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        minHeight: 60,
                                        padding: '0px 16px 0px 16px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Grid item sx={{ width: '80%' }}>
                                        <Typography
                                            component="h1"
                                            variant="h4"
                                            color="inherit"
                                            noWrap
                                            sx={{ flexGrow: 1, padding: '0px 0px 0px 8px' }}
                                        >
                                            {taskData === null ? 'Loading...' : taskData.taskName}
                                        </Typography>
                                    </Grid>
                                    {isManager && (
                                        <Grid item sx={{
                                            width: '20%', flexGrow: 1, display: 'flex', flexDirection: 'row',
                                            alignItems: 'center', flexFlow: 'row-reverse'
                                        }}>
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={handleDelete} id={taskId}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton color="default" onClick={handleEdit}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    )}
                                </Paper>
                            </Grid>
                            {/* Task View */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    {taskData === null ? <span>'Loading...'</span> :
                                        <Grid>
                                            <Grid item sx={{ display: 'flex', flexGrow: 1, flexDirection: 'row', padding: '0px 0px 0px 8px' }}>
                                                <Chip label={taskData.taskId} variant="outlined" />
                                                <Chip label={taskPeriod} variant="outlined" sx={{ margin: '0px 0px 0px 16px' }} />
                                                <Chip label={taskData.status} variant="outlined" sx={{ margin: '0px 0px 0px 16px' }} />
                                            </Grid>
                                            <Grid item sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', padding: '16px 0px 0px 8px' }}>
                                                <Typography
                                                    component="h6"
                                                    variant="h6"
                                                    color="inherit"
                                                    noWrap
                                                    sx={{ padding: '0px 16px 16px 0px' }}
                                                > Description
                                                </Typography>
                                                <Paper variant="elevation" elevation={2} sx={{ minHeight: '100px' }}>
                                                    {taskData === null ? <span>'Loading...'</span> :
                                                        <p
                                                            style={{ padding: '0px 16px' }}>
                                                            {taskData.decsription}</p>}
                                                </Paper>
                                            </Grid>
                                            <Grid item sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', padding: '16px 0px 0px 8px' }}>
                                                <Typography
                                                    component="h6"
                                                    variant="h6"
                                                    color="inherit"
                                                    noWrap
                                                    sx={{ padding: '0px 16px 16px 0px' }}
                                                > Attachments
                                                </Typography>
                                                <Paper variant="elevation" elevation={2} sx={{ minHeight: '100px' }}>
                                                    {(taskData !== null && taskData !== undefined && taskData.docs !== null
                                                        && taskData.docs !== undefined && taskData.docs.length === 0) ? <p
                                                            style={{ padding: '0px 16px' }}>
                                                        No Attachments linked.</p> :
                                                        <span></span>
                                                    }
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box >

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure want to delete the task?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus color='error'>Cancel</Button>
                    <Button onClick={handleDialogOk} color='info'> OK </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider >
    );

}