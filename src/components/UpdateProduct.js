import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
                console.log("Product not found!");
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
        <div>
            <h1>Ürünü Güncelle</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ürün Kodu:</label>
                    <input
                        type="text"
                        name="productCode"
                        value={product.productCode}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Ürün Adı:</label>
                    <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Beden:</label>
                    <input
                        type="text"
                        name="size"
                        value={product.size}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Adet:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Güncelle</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
