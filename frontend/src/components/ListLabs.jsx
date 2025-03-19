import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/ListLabs.css';

function ListLabs() {
    const [labs, setlabs] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    let role = user['role'];
    // let name = user['name'];
    const navigate = useNavigate();

    useEffect(() => {

        if (role == 'ADMIN') {
            fetch('http://localhost:8080/api/labs')
                .then(response => response.json())
                .then(data => setlabs(data));
        }
        else if (role == 'LAB_ADMIN') {
            fetch(`http://localhost:8080/api/labs/admin/${user['id']}`)
                .then(response => response.json())
                .then(data => setlabs(data));
        }
        else {
            navigate('/profile');
        }
    }, []);
    return (
        <div className='content'>
            <div className='labGrid'>
                {labs.length == 0 && <h2>No Labs Available</h2>}
                {labs.map((lab, index) => (
                    <a key={index} href={`/dashboard/${lab.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <div className='labCard'>
                            <h3>{lab.name}</h3>
                            <p>Location: {lab.location}</p>
                        </div>
                    </a>
                ))}
            </div>

            <button className='secondaryButton' onClick={()=>navigate('/labs/addlab')}>Add New Lab</button>
            <button className='secondaryButton'>Total Stats</button>

        </div>
    )
}

export default ListLabs