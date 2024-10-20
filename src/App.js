import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import StockListPage from './components/StockListPage';
import AddProduct from './components/AddProduct';
import LendProduct from "./components/LendProduct";
import UpdateProduct from "./components/UpdateProduct";
import Login from './components/Login'; // Login bileşeni
import ProtectedRoute from './components/ProtectedRoute';// ProtectedRoute'u import et
import LoanProductPage from './components/LoanProductPage';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Login olmadan erişilebilecek rotalar */}

                <Route path="/login" element={<Login />} /> {/* Login sayfası */}

                {/* Login gerektiren rotalar */}
                <Route
                    path="/"
                    element={<ProtectedRoute element={Home} />}
                />
                <Route
                    path="/location/:location"
                    element={<ProtectedRoute element={StockListPage} />}
                />
                <Route
                    path="/location/:location/add"
                    element={<ProtectedRoute element={AddProduct} />}
                />
                <Route
                    path="/location/:location/lend"
                    element={<ProtectedRoute element={LendProduct} />}
                />
                <Route
                    path="/location/:location/update/:productId"
                    element={<ProtectedRoute element={UpdateProduct} />}
                />
                <Route path="/loan-products" element={<LoanProductPage />} />
            </Routes>
        </Router>
    );
};

export default App;
