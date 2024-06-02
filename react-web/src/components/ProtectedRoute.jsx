import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import GlobalContext from '../GlobalContext';

const ProtectedRoute = ({ roles }) => {

    // Logged in user roles
    const { user } = useContext(GlobalContext);

    if (!user?.roles) {
        return <Navigate to="/home" />;
    }

    const userHasRequiredRole = roles.some(role =>
        user.roles.some(userRole => userRole.role === role)
    );

    return userHasRequiredRole ? <Outlet /> : <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;