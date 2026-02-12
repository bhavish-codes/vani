import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
    console.log('PrivateRoute: Checking authentication...');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    const isAuthenticated = token && user;
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        toast.error('Please login to access this page');
        return <Navigate to="/login" replace />;
    }
    
    console.log('Authenticated, rendering protected content');
    return children;
};

export default PrivateRoute;
