import axios from "axios";
import { useState } from "react";

const CREATE_URL = '/api/task/createTask';

export const useCreateTask = () => {
    const [error, setError] = useState(null);
    const [isMessage, setIsMessage] = useState(null);

    const createTask = async (createData) => {
        setIsMessage(true);
        setError(null);

        await axios.post(
            CREATE_URL,
            JSON.stringify(createData),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
        ).then((response) => {
            setIsMessage(false);
            setError(response?.message);
        }).catch((err) => {
            setIsMessage(false);
            setError('Create failed.');
        });
    }

    return { createTask, isLoading: isMessage, error }
}