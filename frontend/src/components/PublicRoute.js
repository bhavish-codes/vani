import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    console.log('🌐 PublicRoute: Checking if user is already logged in...');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    const isAuthenticated = token && user;
    console.log('🔑 Token exists:', !!token);
    console.log('👤 User exists:', !!user);
    console.log('✅ Is authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
        console.log('✅ Already authenticated, redirecting to home');
        return <Navigate to="/home" replace />;
    }
    
    console.log('🌐 Not authenticated, showing public page');
    return children;
};

export default PublicRoute;
