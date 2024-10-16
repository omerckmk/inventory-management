import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import "../LendProduct.css"; // CSS dosyasını import ediyoruz

const LendProduct = () => {
    const { location } = useParams();
    const navigate = useNavigate();
    const [stockItems, setStockItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [borrower, setBorrower] = useState("");
    const [lender, setLender] = useState("");
    const [date, setDate] = useState("");

    // Stok listesini çekme
    useEffect(() => {
        const fetchStockItems = async () => {
            const q = query(collection(db, "stock"), where("location", "==", location));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStockItems(items);
        };

        fetchStockItems();
    }, [location]);

    // Ürün seçimi
    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = stockItems.find(item => item.id === productId);
        setSelectedProduct(product);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedProduct && quantity > 0) {
            const parsedQuantity = parseInt(quantity);

            // Ödünç işleminde stok miktarı kontrolü
            if (parsedQuantity > selectedProduct.quantity) {
                alert("Stoktaki miktardan fazla ürün ödünç verilemez!");
                return;
            }

            const newQuantity = selectedProduct.quantity - parsedQuantity;  // Ödünç işlemi

            try {
                // Ödünç verilen ürünü loans koleksiyonuna ekle
                await addDoc(collection(db, "loans"), {
                    productId: selectedProduct.id,
                    productName: selectedProduct.productName,
                    productCode: selectedProduct.productCode,
                    size: selectedProduct.size,
                    quantity: parsedQuantity,
                    borrower,
                    lender,
                    date: new Date(date),
                    location
                });

                // Stokta kalan ürünü güncelle
                const productRef = doc(db, "stock", selectedProduct.id);
                await updateDoc(productRef, { quantity: newQuantity });

                // Kullanıcıyı geri yönlendir
                navigate(`/location/${location}`);
            } catch (error) {
                console.error("Hata:", error);
            }
        } else {
            alert("Lütfen geçerli bir ürün ve miktar seçin.");
        }
    };

    return (
        <div className="lend-product-container">
            <h2 className="lend-product-title">{location} Lenen formulier</h2>
            <form onSubmit={handleSubmit} className="lend-product-form">
                <div className="form-group">
                    <label>Kies Product:</label>
                    <select onChange={handleProductChange} required>
                        <option value="">Kies een product</option>
                        {stockItems.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.productName}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedProduct && (
                    <>
                        <div className="form-group">
                            <label>Product Code:</label>
                            <input type="text" value={selectedProduct.productCode} disabled />
                        </div>
                        <div className="form-group">
                            <label>Maat:</label>
                            <input type="text" value={selectedProduct.size} disabled />
                        </div>
                        <div className="form-group">
                            <label>Aantal:</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Lener:</label>
                            <input
                                type="text"
                                value={borrower}
                                onChange={(e) => setBorrower(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Gever:</label>
                            <input
                                type="text"
                                value={lender}
                                onChange={(e) => setLender(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Datum:</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="lend-button">Lenen</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default LendProduct;
