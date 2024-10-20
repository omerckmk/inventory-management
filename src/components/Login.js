// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Firebase Auth'ı içe aktar
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../Login.css'; // CSS dosyasını içe aktar

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Başarılı girişten sonra anasayfaya yönlendir
        } catch (error) {
            console.error("Giriş hatası: ", error);
            alert("Inloggen mislukt. Controleer uw gegevens alstublieft");
        }
    };

    return (
        <div className="login-container">
            <h1>Inloggen</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <label>
                    E-mail:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Wachtwoorden:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit" className="login-button">Inloggen</button>
            </form>
        </div>
    );
};

export default Login;
