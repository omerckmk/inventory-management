import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; // Firebase auth'i import ediyoruz
import '../Home.css'; // CSS dosyasını import ediyoruz

const Home = () => {
    const navigate = useNavigate(); // Navigasyonu kullanmak için

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth); // Firebase'den çıkış yap
            navigate('/login'); // Çıkış yaptıktan sonra login sayfasına yönlendir
        } catch (error) {
            console.error("Çıkış yaparken hata oluştu:", error); // Hata mesajı
        }
    };

    return (

        <div className="home-container">
            <h1 className="home-title">Kleding voorraad beheer</h1>
            <ul className="location-list">
                <li><Link to="/location/Apeldoorn" className="location-link">Apeldoorn</Link></li>
                <li><Link to="/location/Deventer" className="location-link">Deventer</Link></li>
                <li><Link to="/location/Cambio" className="location-link">Cambio</Link></li>
                <li><Link to="/location/Zutphen" className="location-link">Zutphen</Link></li>

            </ul>
            <button onClick={handleLogout} className="logout-button">Uitloggen</button> {/* Çıkış Butonu */}
        </div>
    );
};

export default Home;
