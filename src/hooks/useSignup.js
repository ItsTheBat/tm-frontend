import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const SIGNUP_URL = 'api/auth/signup';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (signUpData) => {
        setIsLoading(true);
        setError(null);

        await axios.post(
            SIGNUP_URL,
            JSON.stringify(signUpData),
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
                localStorage.setItem('user', JSON.stringify(response?.data?.username));
                dispatch({ type: 'LOGIN', payload: response?.data });
                setIsLoading(false);
            }
        }).catch((err) => {

        });
    }

    return { signup, isLoading, error }
}