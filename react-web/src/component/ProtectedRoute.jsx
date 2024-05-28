import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import GlobalContext from '../GlobalContext';

const ProtectedRoute = ({ roles }) => {

    // Logged in user roles
    const { roles: userRoles } = useContext(GlobalContext);

    if (!userRoles) {
        return <Navigate to="/login" />;
    }

    const userHasRequiredRole = roles.some(role =>
        userRoles.some(userRole => userRole.role === role)
    );

    return userHasRequiredRole ? <Outlet /> : <Navigate to="/not-authorized" />;
};

export default ProtectedRoute;