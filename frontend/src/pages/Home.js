import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';

function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🏠 Home component mounted');
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        
        if (userData) {
            const parsedUser = JSON.parse(userData);
            console.log('✅ User data loaded:', parsedUser);
            setUser(parsedUser);
        }
    }, []);

    const handleLogout = () => {
        console.log('🚪 Logout initiated');
        try {
            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('🗑️ Cleared token and user data from localStorage');
            
            // Optional: Clear all localStorage if you want
            // localStorage.clear();
            
            toast.success('Logged out successfully');
            console.log('✅ Logout successful');
            
            // Small delay for toast to show before redirect
            console.log('🔄 Redirecting to login in 0.5s...');
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 500);
        } catch (error) {
            console.error('🔥 Logout error:', error);
            toast.error('Error during logout');
            // Still navigate even if there's an error
            navigate('/login', { replace: true });
        }
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="home-container">
            <div className="home-card">
                <div className="home-header">
                    <h1>Welcome, {user.name}! 👋</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
                
                <div className="user-info">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{user.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user.email}</span>
                    </div>
                </div>

                <div className="home-content">
                    <h2>Dashboard</h2>
                    <p>You are successfully logged in!</p>
                    <p className="token-info">
                        🔐 Your session is secured with JWT authentication
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
