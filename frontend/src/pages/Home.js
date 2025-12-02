import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';
import { Hand, Camera as CameraIcon, Activity, TrendingUp, LogOut, User } from "lucide-react";

function Home() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // Placeholder states - ready for integration
    const [fingerCount, setFingerCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [stats, setStats] = useState({
        total_detections: 0,
        most_common_count: null
    });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        console.log('🏠 Home component mounted');
        const userData = localStorage.getItem('user');
        
        if (userData) {
            const parsedUser = JSON.parse(userData);
            console.log('✅ User data loaded:', parsedUser);
            setUser(parsedUser);
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        console.log('🚪 Logout initiated');
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('🗑️ Cleared token and user data from localStorage');
            
            toast.success('Logged out successfully');
            console.log('✅ Logout successful');
            
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 500);
        } catch (error) {
            console.error('🔥 Logout error:', error);
            toast.error('Error during logout');
            navigate('/login', { replace: true });
        }
    };

    // Placeholder function for camera initialization
    const initializeCamera = () => {
        toast.info('Camera initialization will be implemented here');
        setIsActive(true);
        // TODO: Integrate MediaPipe hand detection logic here
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="finger-counter-container" data-testid="finger-counter-container">
            {/* Header */}
            <header className="app-header">
                <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo-section" style={{ marginBottom: 0 }}>
                        <Hand className="logo-icon" />
                        <h1 className="app-title">Hand Sign Detector</h1>
                    </div>
                    
                    <p className="app-subtitle" style={{ margin: 0, flex: 1, textAlign: 'center' }}>
                        Real-time hand tracking with AI
                    </p>
                    
                    {/* Profile Button with Dropdown */}
                    <div ref={profileDropdownRef} style={{ position: 'relative' }}>
                        <div 
                            className="profile-button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.65rem 1.25rem',
                                background: showDropdown ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (!showDropdown) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                }
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                if (!showDropdown) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                }
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* User Avatar */}
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '1rem',
                                border: '2px solid rgba(255, 255, 255, 0.5)'
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ 
                                color: 'white', 
                                fontWeight: '600',
                                fontSize: '0.95rem'
                            }}>
                                {user.name}
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 0.5rem)',
                                right: 0,
                                minWidth: '200px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                border: '2px solid rgba(255, 255, 255, 0.5)',
                                overflow: 'hidden',
                                zIndex: 1000,
                                animation: 'slideDown 0.2s ease-out'
                            }}>
                                <div 
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem 1.25rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s ease',
                                        color: '#333',
                                        fontWeight: '500'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <LogOut size={18} style={{ color: '#667eea' }} />
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>


            <div className="main-content">
                {/* Video Section */}
                <div className="video-section">
                    <div className="video-container" data-testid="video-container">
                        <video
                            ref={videoRef}
                            className="video-element"
                            data-testid="video-element"
                            style={{ display: "none" }}
                        />
                        <canvas
                            ref={canvasRef}
                            className="canvas-element"
                            data-testid="canvas-element"
                            width={1280}
                            height={720}
                        />
                        
                        {/* Finger Count Display */}
                        <div className="count-overlay" data-testid="count-overlay">
                            <div className="count-display" data-testid="count-display">
                                <span className="count-number" data-testid="count-number">{fingerCount}</span>
                                <span className="count-label">fingers</span>
                            </div>
                        </div>

                        {/* Camera Placeholder */}
                        {!isActive && (
                            <div className="camera-placeholder" data-testid="camera-placeholder">
                                <CameraIcon size={80} />
                                <p>Click Start Camera to begin detecting hand signs</p>
                            </div>
                        )}
                    </div>

                    {/* Control Button */}
                    {!isActive && (
                        <button
                            className="start-button"
                            onClick={initializeCamera}
                            data-testid="start-camera-button"
                        >
                            <CameraIcon size={20} />
                            Start Camera
                        </button>
                    )}
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stats-card" data-testid="stats-card">
                        <div className="stat-item">
                            <Activity className="stat-icon" />
                            <div className="stat-content">
                                <span className="stat-label">Total Detections</span>
                                <span className="stat-value" data-testid="total-detections">
                                    {stats.total_detections}
                                </span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <TrendingUp className="stat-icon" />
                            <div className="stat-content">
                                <span className="stat-label">Most Common</span>
                                <span className="stat-value" data-testid="most-common-count">
                                    {stats.most_common_count !== null ? `${stats.most_common_count} fingers` : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="history-card" data-testid="history-card">
                        <h3 className="history-title">Recent History</h3>
                        <div className="history-list">
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <div key={index} className="history-item" data-testid={`history-item-${index}`}>
                                        <span className="history-count">{item.count}</span>
                                        <span className="history-label">fingers</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-history" data-testid="no-history">No history yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

