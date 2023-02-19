import Add from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Logout from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import { Button, FormLabel, IconButton, TextField, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from "axios";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

const TASKLIST_URL = '/api/task/getUserTasks';
const mdTheme = createTheme();

function DashboardContent() {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [showView, setShowView] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const isDeleteTask = JSON.parse(localStorage.getItem('isDeleteTask')) === true ? true : false;
    var isManager = null;
    if (user === null || user === undefined || user === '') {
        isManager = false;
    } else {
        isManager = user.roles[0] === ('ROLE_MANAGER');
    }

    const handleToastrClick = () => {
        setOpen(true);
    };

    const handleDetailView = async (event) => {
        event.preventDefault();
        var taskId = event.currentTarget.getAttribute('id');

        let taskData = {
            "taskId": taskId,
            "roles": user.roles
        };
        localStorage.removeItem('taskId');
        localStorage.setItem('taskId', JSON.stringify(taskId));
        navigate("/taskDetail", { state: taskData });
    };

    useEffect(() => {
        if (user === null || user === undefined || user === '') {
            navigate('/');
        } else {
            if (isDeleteTask) {
                setOpen(true);
                localStorage.setItem('isDeleteTask', JSON.stringify(false));
            }
            handleLoad('');
        }
    }, []);

    function formTasks(responseData) {
        var tempArr = [];
        const temp = createData('tempId', 'No Records', '', '', '', '');
        tempArr.push(temp);

        if (responseData !== null) {
            try {
                var returnArr = [];
                responseData.taskData.forEach(element => {
                    returnArr.push(createData(element.taskId, element.taskId, element.taskName,
                        element.createDate, element.status, element.assignee));
                });
                return returnArr;
            } catch (err) {
                return tempArr;
            }
        } else {
            return tempArr;
        }
    }

    function createData(id, taskId, taskName, createDate, status, assignee) {
        return { id, taskId, taskName, createDate, status, assignee };
    }

    const handleTaskSearch = async (event) => {
        var targetData = document.getElementById('task-search').value;
        var searchData = targetData === null || targetData === undefined ?
            event.target.data === null || event.target.data === undefined ? '' :
                event.target.data : targetData;
        handleLoad(searchData);
    }

    const handleLoad = async (searchData) => {
        try {
            let taskParams = {
                "employeeId": user?.username,
                "roles": user?.roles,
                "searchKey": searchData
            };
            await axios.post(
                TASKLIST_URL,
                JSON.stringify(taskParams),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            ).then((response) => {
                if (response?.status === 200) {
                    var data = formTasks(response?.data);
                    setTableData(data);
                    setShowView(true);
                } else {
                    setTableData(formTasks(null));
                    setShowView(false);
                }
            }).catch((err) => {
                setTableData(formTasks(null));
                setShowView(false);
            });
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response. Please try after sometime.');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized access.');
            }
            setTableData(formTasks(null));
            setShowView(false);
        }
    };

    const handleLogout = () => {
        logout().then(() => {
            navigate('/');
        });;
    }

    const handleCreate = (event) => {
        event.preventDefault();
        navigate("/createTask");
    }

    return (
        <ThemeProvider theme={mdTheme}>
            {(user !== null && user !== undefined && user !== '') ? (
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
                                        <IconButton color="error" onClick={handleLogout} key={user.username} >
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
                                            id="task-search"
                                            label="Search Task"
                                            type="search"
                                            onChange={handleTaskSearch}
                                            starticon={<SearchIcon />}
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
                                {/* Task List */}
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                        <React.Fragment>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell width={200}>Task ID</TableCell>
                                                        <TableCell width={350}>Task Name</TableCell>
                                                        <TableCell width={200}>Create Date</TableCell>
                                                        <TableCell width={150}>Status</TableCell>
                                                        <TableCell width={150}>Assignee</TableCell>
                                                        <TableCell width={50}></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        tableData.map((row) => (
                                                            <TableRow key={JSON.stringify(row)}>
                                                                <TableCell width={200}>{row.taskId}</TableCell>
                                                                <TableCell width={350}>{row.taskName}</TableCell>
                                                                <TableCell width={200}>{row.createDate}</TableCell>
                                                                <TableCell width={150}>{row.status}</TableCell>
                                                                <TableCell width={150}>{row.assignee}</TableCell>
                                                                <TableCell align="right" width={50}>
                                                                    {showView ?
                                                                        <Tooltip title="View Task">
                                                                            <IconButton color="primary" id={row.taskId}
                                                                                key={row.taskId} onClick={handleDetailView}>
                                                                                <Visibility />
                                                                            </IconButton>
                                                                        </Tooltip> : null
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </React.Fragment>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            ) : (null)}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleToastrClick}
                message="Task deleted successfully."
            />
        </ThemeProvider >

    );
}

export default function Dashboard() {
    return <DashboardContent />;
}