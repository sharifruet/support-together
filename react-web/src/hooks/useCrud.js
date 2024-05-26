import { useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://support.i2gether.com/api';

const useCrud = () => {
    const getToken = () => localStorage.getItem('accessToken');

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
            const token = getToken();
            if (!token) throw new Error('Token not found');

            const response = await axiosInstance({
                url: endpoint,
                method,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setData(response.data);
            return response.data;
        } catch (err) {
            // console.log(err.response.data.error)

            setError(err.response.data.error);
            throw err.response.data.error; // Rethrow the error to be caught by the caller
        } finally {
            setLoading(false);
        }
    }, [axiosInstance]);

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
