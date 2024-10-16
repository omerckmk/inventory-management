import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import '../UpdateProduct.css'; // CSS dosyasını dahil et

const UpdateProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        productCode: "",
        productName: "",
        size: "",
        quantity: 0,
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const productRef = doc(db, "stock", productId);
            const productDoc = await getDoc(productRef);
            if (productDoc.exists()) {
                setProduct(productDoc.data());
            } else {
                console.log("product niet gevonden!");
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productRef = doc(db, "stock", productId);
        await updateDoc(productRef, product);
        navigate(`/location/${product.location}`); // Güncellenmiş ürün listesini görmek için geri dön
    };

    return (
        <div className="update-product-container">
            <Link to={`/location/${product.location}`} className="back-link">Vorige pagina</Link>
            <h1>Product bijwerken</h1>
            <form onSubmit={handleSubmit} className="update-form">
                <div className="form-group">
                    <label>Product code:</label>
                    <input
                        type="text"
                        name="productCode"
                        value={product.productCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product naam:</label>
                    <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Maat:</label>
                    <input
                        type="text"
                        name="size"
                        value={product.size}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Aantal:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>
                <button type="submit" className="green-button">Bijwerken</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
