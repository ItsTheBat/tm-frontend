import CreateIcon from '@mui/icons-material/Create';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import { useCreateTask } from '../hooks/useCreateTask';

const theme = createTheme();

export default function CreateTask() {
    const [errMsg, setErrMsg] = useState('');
    const [alertType, setAlertType] = useState('error');
    const { createTask, error, isMessage } = useCreateTask();
    const [startValue, setStartValue] = React.useState(dayjs('2023-02-01T12:00:00'));
    const [endValue, setEndValue] = React.useState(dayjs('2023-02-01T12:00:00'));

    const handleStartDate = (newValue) => {
        setStartValue(newValue);
    };

    const handleEndDate = (newValue) => {
        setEndValue(newValue);
    };

    const handleSubmit = async (event) => {
        const data = new FormData(event.currentTarget);
        event.preventDefault();
        let createData = {
            taskName: data.get('taskName'),
            taskDescription: data.get('taskDescription'),
            assignee: data.get('assignee'),
            startDate: startValue.$d,
            endDate: endValue.$d,
            attachments: [data.get('attachments')],
        };
        await createTask(createData).then(() => {
            if (error) {
                setErrMsg(error);
                setAlertType('error');
            } else {
                setErrMsg('Task created Successfully.');
                setAlertType('success');
                document.querySelectorAll('input').forEach(
                    input => (input.value = "")
                );
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
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
                        <CreateIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Task
                    </Typography>
                    {isMessage ? <Alert id='err-alert' severity={alertType}
                        aria-live="assertive" sx={{ mt: 2 }}>{errMsg}</Alert> : null}
                    <Box component="form" id='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="taskName"
                                    required
                                    fullWidth
                                    id="taskName"
                                    label="Task Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="taskDescription"
                                    multiline
                                    maxRows={5}
                                    label="Task Description"
                                    name="taskDescription"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="assignee"
                                    label="Assignee"
                                    name="assignee"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" startIcon={<FileUploadIcon />} component="label">
                                    Upload Files
                                    <input hidden accept="/*" multiple type="file" />
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={3}>
                                        <DesktopDatePicker
                                            inputFormat="MM/DD/YYYY"
                                            value={startValue}
                                            onChange={handleStartDate}
                                            renderInput={(params) => <TextField {...params} />}
                                            required
                                            fullWidth
                                            id="startDate"
                                            label="Start Date"
                                            name="startDate"
                                        />
                                        <DesktopDatePicker
                                            inputFormat="MM/DD/YYYY"
                                            value={endValue}
                                            onChange={handleEndDate}
                                            renderInput={(params) => <TextField {...params} />}
                                            required
                                            fullWidth
                                            id="endDate"
                                            label="End Date"
                                            name="endDate"
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isMessage}
                            sx={{ mt: 3, mb: 2 }}
                        > Insert </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );

}