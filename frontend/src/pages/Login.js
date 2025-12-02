import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🚀 Login form submitted');
        console.log('📝 Form data:', { email: formData.email, password: '***' });
        setLoading(true);

        try {
            console.log('📡 Sending login request to backend...');
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('📥 Response status:', response.status);
            const data = await response.json();
            console.log('📦 Response data:', { ...data, token: data.token ? '***' : undefined });

            if (response.ok && data.success) {
                console.log('✅ Login successful!');
                
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('💾 Token and user data saved to localStorage');
                
                toast.success(data.message || 'Login successful!');
                console.log('🔄 Redirecting to home in 1s...');
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else {
                console.log('❌ Login failed:', data.message);
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('🔥 Login error:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
            console.log('🏁 Login process completed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Login to your account</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
