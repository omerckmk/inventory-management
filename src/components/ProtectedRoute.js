import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ element: Element }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); // Yükleme tamamlandı
        });

        // Cleanup function to unsubscribe from the listener
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Oturum durumu kontrol edilirken yükleme ekranı göster
    }

    return isAuthenticated ? <Element /> : <Navigate to="/login" />; // Eğer giriş yapılmışsa bileşeni render et, yoksa login sayfasına yönlendir
};

export default ProtectedRoute;
