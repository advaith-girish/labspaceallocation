import React, { useEffect } from 'react';
import './Intro.css';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
function Intro() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href='/login';
        return;
    }
    
    let role = user['role'];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
      };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Sidebar />

                <div className="main-content">
                    <div className="header">
                        <h1>Dashboard</h1>
                        <div className="header-right">
                            <div>{user.name} - {role}</div>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </div>
                    </div>
                    <div className='card-container'> 
                    <img src='/assets/6815535.webp' alt="IIITD" />
                    <div className="card-grid">
                    <Link to="/labs" className="card"><h3>Lab Space Allocation</h3></Link>
                        <Link to="/totalstats" className="card"><h3>Allocations</h3></Link>
                        <Link to="/notifications" className="card"><h3>Notifications</h3></Link>
                        <Link to="/server-monitoring" className="card"><h3>Server Monitoring</h3></Link>
                        {role === 'ADMIN' && <Link to="/addlabadmin" className="card"><h3>Add Admin</h3></Link>}
                        {(role === 'ADMIN' || role === 'LAB_ADMIN') && <Link to="/addstudent" className="card"><h3>Add Student</h3></Link>}

                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Intro;
