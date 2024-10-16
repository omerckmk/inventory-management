import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import '../AddProduct.css'; // Assuming you have a separate CSS file for styling

const AddProduct = () => {
    const { location } = useParams(); // Get location from URL
    const [productCode, setProductCode] = useState("");
    const [productName, setProductName] = useState("");
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "stock"), {
                productCode,
                productName,
                size,
                quantity: parseInt(quantity),
                location,
            });
            alert("Ürün başarıyla eklendi");
        } catch (error) {
            console.error("Ürün ekleme hatası: ", error);
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-header">
                <h1>{location} Nieuwe Product Toevoegen</h1>
                <Link to="/">Homepage</Link>
            </div>
            <form onSubmit={handleSubmit} className="add-product-form">
                <label>Product Code:</label>
                <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    required
                />

                <label>Product Name:</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />

                <label>Maat:</label>
                <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                />

                <label>Aantal:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                />

                <button type="submit">Product toevoegen</button>
            </form>
        </div>
    );
};

export default AddProduct;
