import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css'; // CSS dosyasını import ediyoruz

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Kleding inventory beheer</h1>
            <ul className="location-list">
                <li><Link to="/location/Apeldoorn" className="location-link">Apeldoorn</Link></li>
                <li><Link to="/location/Deventer" className="location-link">Deventer</Link></li>
                <li><Link to="/location/Zutphen" className="location-link">Zutphen</Link></li>
            </ul>
        </div>
    );
};

export default Home;
