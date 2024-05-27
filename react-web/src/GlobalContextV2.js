import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useCrud from './hooks/useCrud';
import 'react-toastify/dist/ReactToastify.css';

const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [projects, setProjects] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    // const [accesstoken, setAccesstoken] = useState(localStorage.getItem('accessToken') || null);
    const [accesstoken, setAccesstoken] = useState(null);

    const notifyLoggedIn = () => toast.success('🎉 You have successfully logged in!',{ className: 'toast-success toast-single-line' });
    const notifyError = () => toast.error('❌ Something went wrong!', { className: 'toast-error toast-single-line' });
    const notifyInfo = () => toast.info('ℹ️ Here is some information.', { className: 'toast-info toast-single-line' });
    const notifyWarning = () => toast.warn('⚠️ Be careful!', { className: 'toast-warning toast-single-line' });
    const notifyUpdate = () => toast('🔄 Update in progress...', { className: 'toast-update toast-single-line' });
    const notifyCustom = () => toast('🚀 Custom notification!', { className: 'toast-custom toast-single-line' });
    const notifyLoggedOut = () => toast.success('👋 You have successfully logged out!', { className: 'toast-success toast-single-line' });


    // const notifyUpdate = useCallback(() => {
    //     toast('🔄 Update in progress...', { className: 'toast-update' });
    // }, []);

    // const notifyCustom = useCallback(() => {
    //     toast('🚀 Custom notification!', { className: 'toast-custom' });
    // }, []);

    const navigate = useNavigate();
    const { data, loading, error, getAll, getById, create, update, remove } = useCrud();

    useEffect(() => {
        if (accesstoken) {
            fetchOrganizations();
        }
    }, [accesstoken]);

    useEffect(() => {
        if(roles.length > 0){
            roles.forEach(r => loadProject(r.id));
        }
    }, [roles]);

    const loginSuccess = async (response) => {
        if (response?.token) {
            setAccesstoken(response.token);
            // localStorage.setItem('accessToken', response.token);

            if (response?.userRoles) {
                setRoles(response.userRoles);
            }
            toast.success('🎉 You have successfully logged in!', { className: 'toast-success' });
            setLoggedIn(true);
        }
    };

    const fetchOrganizations = useCallback(async () => {
        try {
            const response = await getAll('/organizations');
            setOrganizations(response);
            toast.info('📄 Organizations loaded successfully.', { className: 'toast-info' });
        } catch (err) {
            console.log(err);
            toast.error('❌ Failed to load organizations.', { className: 'toast-error' });
        }
    }, [getAll]);

    const loadProject = useCallback(async (projectId) => {
        try {
            const response = await getById('/projects', projectId);
            setProjects(prevProjects => [...prevProjects, response]);
            toast.info(`📂 Project ${projectId} loaded successfully.`, { className: 'toast-info' });
        } catch (err) {
            console.log(err);
            toast.error(`❌ Failed to load project ${projectId}.`, { className: 'toast-error' });
        }
    }, [getById]);

    const onLogout = useCallback(() => {
        // localStorage.removeItem('accessToken');
        setAccesstoken(null);
        setLoggedIn(false);
        setProjects([]);
        navigate("/loginreg");
        toast.success('👋 You have successfully logged out!', { className: 'toast-success' });
    }, [navigate]);

    return (
        <GlobalContext.Provider
            value={{ user, setUser, loginSuccess, onLogout, roles, setRoles, loggedIn, projects, organizations, notifyUpdate, notifyCustom }}
        >
            {children}
            <ToastContainer />
        </GlobalContext.Provider>
    );
};

export default GlobalContext;
export { GlobalProvider };
