import Visibility from '@mui/icons-material/Visibility';
import { Grid, IconButton, Tooltip } from '@mui/material';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import * as React from 'react';
import Title from './Title';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const TASKLIST_URL = '/api/task/getUserTasks';
const user = JSON.parse(localStorage.getItem('user'));

export default function Task() {
    const [tableData, setTableData] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 200, hide: true },
        { field: 'taskId', headerName: 'Task ID', width: 300 },
        { field: 'taskName', headerName: 'Task Name', width: 300 },
        { field: 'createDate', headerName: 'Create Date', width: 200 },
        { field: 'assignee', headerName: 'Assignee', width: 200 }
    ];

    useEffect(() => {
        handleLoad();
    }, []);

    function formTasks(responseData) {
        var tempArr = [];
        const temp = createData('tempId', 'Data is loading...', '', '');
        tempArr.push(temp);

        if (responseData !== null) {
            try {
                var returnArr = [];
                responseData.taskData.forEach(element => {
                    returnArr.push(createData(element.taskId, element.taskId, element.taskName,
                        element.createDate, element.assignee));
                });
                return returnArr;
            } catch (err) {
                return tempArr;
            }
        } else {
            return tempArr;
        }
    }

    function createData(id, taskId, taskName, createDate, assignee) {
        return { id, taskId, taskName, createDate, assignee };
    }

    const handleLoad = async () => {
        try {
            let taskParams = {
                "employeeId": user?.username,
                "roles": user?.roles
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
                } else {
                    setTableData(formTasks(null));
                }
            }).catch((err) => {
                setTableData(formTasks(null));
            });
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response. Please try after sometime.');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized access.');
            }
            setTableData(formTasks(null));
        }
    };

    console.log(tableData);

    return (
        <React.Fragment>
            <Grid sx={{ height: 500 }}>
                <Title>Tasks</Title>
                <DataGrid
                    rows={tableData}
                    columns={columns}
                />
            </Grid>
        </React.Fragment>
    );
}