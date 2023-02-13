import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import React from 'react';

const LOGOUT_URL = '/logout';

export const useLogout = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    const logout = async () => {
        localStorage.removeItem('username');
        dispatch({ type: 'LOGOUT' });

        await axios.post(
            LOGOUT_URL,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
        ).catch((err) => {
            if (!err?.response) {
                console.log('No Server Response. Please try after sometime.');
            } else if (err.response?.status === 400) {
                console.log('Username or Password not exist.');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized access.');
            } else {
                console.log('Logout Failed');
            }
            navigate('/');
        });
    }

    return { logout };
}