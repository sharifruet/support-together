import { useState, useCallback, useContext, useEffect } from 'react';
import GlobalContext from '../GlobalContext';
import axios from 'axios';

const BASE_URL = 'http://support.i2gether.com/api';

const useCrud = () => {
    const getToken = () => localStorage.getItem('accessToken');

    const { onLogout, accesstoken } = useContext(GlobalContext);

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

    // useEffect(() => {
    //     if(error === "Invalid token.") { //|| !error?.response
    //         console.log(error)
    //         // const errorMessage = "Invalid token.";
    //         // errorMessage == error && 
    //         onLogout();
    //     }
    // }, [error]);

    const getAll = useCallback((endpoint) => {
        return fetchApi(endpoint, 'GET');
    }, [fetchApi]);

    const getById = useCallback((endpoint, id) => {
        return fetchApi(`${endpoint}/${id}`, 'GET');
    }, [fetchApi]);

    const create = useCallback((endpoint, payload) => {
        return fetchApi(endpoint, 'POST', payload);
    }, [fetchApi]);

    const update = useCallback((endpoint, id, payload) => {
        return fetchApi(`${endpoint}/${id}`, 'PUT', payload);
    }, [fetchApi]);

    const remove = useCallback((endpoint, id) => {
        return fetchApi(`${endpoint}/${id}`, 'DELETE');
    }, [fetchApi]);

    return { data, loading, error, getAll, getById, create, update, remove };
};

export default useCrud;
