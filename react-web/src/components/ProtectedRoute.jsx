import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import GlobalContext from '../GlobalContext';

const ProtectedRoute = ({ roles }) => {

    // Auth and role state
    const { user, loggedIn, authInitialized } = useContext(GlobalContext);

    // While we're still restoring auth from localStorage, don't redirect yet
    if (!authInitialized) {
        return null; // or a spinner if you prefer
    }

    // If not logged in or no roles after init, send to home/login
    if (!loggedIn || !user?.roles) {
        return <Navigate to="/home" />;
    }

    const userHasRequiredRole = roles.some(role =>
        user.roles.some(userRole => userRole.role === role)
    );

    return userHasRequiredRole ? <Outlet /> : <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;