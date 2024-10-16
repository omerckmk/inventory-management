import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import StockList from './components/StockList';
import AddProduct from './components/AddProduct';
import LendProduct from "./components/LendProduct";
import UpdateProduct from "./components/UpdateProduct";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/location/:location" element={<StockList />} />
                <Route path="/location/:location/add" element={<AddProduct />} />
                <Route path="/location/:location/lend" element={<LendProduct />} />
                <Route path="/location/:location/update/:productId" element={<UpdateProduct />} />
            </Routes>
        </Router>
    );
};

export default App;
