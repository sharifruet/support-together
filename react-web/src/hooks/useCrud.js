import { useState, useCallback, useContext } from 'react';
import GlobalContext from '../GlobalContext';
import axios from 'axios';

// const BASE_URL = 'https://support.i2gether.com/api';
const BASE_URL = 'https://localhost:5000/api';

const useCrud = () => {
    const getToken = () => localStorage.getItem('accessToken');

    const { onLogout, accesstoken, loggedIn, setLoggedIn } = useContext(GlobalContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const fetchApi = useCallback(async (endpoint, method, payload = null, isFileUpload = false) => {
        setLoading(true);
        setError(null);
        try {
            const token = accesstoken || getToken();
            if (!token) throw new Error('Token not found');

            const requestConfig = {
                url: endpoint,
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...(isFileUpload && { 'Content-Type': 'multipart/form-data' }),
                },
            };

            if (method === 'POST' || method === 'PUT') {
                requestConfig.data = payload;
            }

            if (isFileUpload) {
                requestConfig.headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            }

            const response = await axiosInstance(requestConfig);
            return response.data;
        } catch (err) {
            console.log(err.response?.data?.error)
            const errorMessage = "Invalid token.";
            const ServerErrorMessage = err.response?.data?.error;
            ServerErrorMessage === errorMessage && setLoggedIn(false);
            setError(err.response?.data?.error || err.message);
            throw err.response?.data?.error || err.message;
        } finally {
            setLoading(false);
        }
    }, [axiosInstance, accesstoken, getToken, setLoggedIn]);

    const getAll = useCallback((endpoint) => {
        return loggedIn && fetchApi(endpoint, 'GET');
    }, [fetchApi]);

    const getById = useCallback((endpoint, id) => {
        return loggedIn && fetchApi(`${endpoint}/${id}`, 'GET');
    }, [fetchApi]);

    const create = useCallback((endpoint, payload) => {
        return loggedIn && fetchApi(endpoint, 'POST', payload);
    }, [fetchApi]);

    const update = useCallback((endpoint, id, payload) => {
        return loggedIn && fetchApi(`${endpoint}/${id}`, 'PUT', payload);
    }, [fetchApi]);

    const remove = useCallback((endpoint, id) => {
        return loggedIn && fetchApi(`${endpoint}/${id}`, 'DELETE');
    }, [fetchApi]);

    const changePassword = useCallback((endpoint, payload) => {
        return loggedIn && fetchApi(`${endpoint}`, 'PUT', payload);
    }, [fetchApi]);

    const updateProfile = useCallback((endpoint, payload) => {
        return loggedIn && fetchApi(`${endpoint}`, 'PUT', payload);
    }, [fetchApi]);

    const uploadFile = useCallback(async (endpoint, file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetchApi(endpoint, 'POST', formData, true);
            return response;  // Assuming response contains the file path URL
        } catch (err) {
            throw err;
        }
    }, [fetchApi]);

    return { data, loading, error, getAll, getById, create, update, remove, changePassword, updateProfile,  uploadFile };
};

export default useCrud;
