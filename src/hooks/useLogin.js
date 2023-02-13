import axios from "axios";
import  React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const SIGNIN_URL = 'api/auth/signin';

export const useSignin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [loginData, setLoginData] = useState(null);
    const { dispatch } = useAuthContext();

    const signin = async (signInData) => {
        setIsLoading(true);
        setError(null);

        await axios.post(
            SIGNIN_URL,
            JSON.stringify(signInData),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
        ).then((response) => {
            if (!response?.status === 200) {
                setIsLoading(false);
                setError(response?.message);
            } else {
                localStorage.setItem('user', JSON.stringify(response?.data));
                setLoginData(response?.data);
                dispatch({ type: 'LOGIN', payload: response?.data });
                setIsLoading(false);
            }
        }).catch((err) => {
            if (!err?.response) {
                setError('No Server Response. Please try after sometime.');
            } else if (err.response?.status === 400) {
                setError('Username or Password not exist.');
            } else if (err.response?.status === 401) {
                setError('Unauthorized access.');
            } else {
                setError('Login Failed');
            }
        });
    }

    return { signin, isLoading, error, loginData }
}