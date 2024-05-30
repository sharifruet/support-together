import { useState, useCallback, useContext, useEffect } from 'react';
import GlobalContext from '../GlobalContext';
import axios from 'axios';

const BASE_URL = 'https://support.i2gether.com/api';

const useCrud = () => {
    const getToken = () => localStorage.getItem('accessToken');

    const { onLogout, accesstoken, loggedIn } = useContext(GlobalContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const fetchApi = useCallback(async (endpoint, method, payload = null) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken() || accesstoken;
            if (!token) throw new Error('Token not found');

            const requestConfig = {
                url: endpoint,
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };

            if (method === 'POST' || method === 'PUT') {
                requestConfig.data = payload;
            }

            const response = await axiosInstance(requestConfig);
            return response.data;
        } catch (err) {
            setError(err.response.data.error);
            throw err.response.data.error;
        } finally {
            setLoading(false);
        }
    }, [axiosInstance]);

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

    return { data, loading, error, getAll, getById, create, update, remove, changePassword };
};

export default useCrud;
