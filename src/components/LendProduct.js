import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import "../LendProduct.css";

const LendProduct = () => {
    const { location } = useParams();
    const navigate = useNavigate();
    const [groupedProducts, setGroupedProducts] = useState({});
    const [selectedProductGroup, setSelectedProductGroup] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [borrower, setBorrower] = useState("");
    const [lender, setLender] = useState("");
    const [date, setDate] = useState("");

    // Stok listesini çekme ve ürünleri gruplama
    useEffect(() => {
        const fetchStockItems = async () => {
            const q = query(collection(db, "stock"), where("location", "==", location));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Ürünleri productCode'a göre gruplama
            const grouped = items.reduce((acc, item) => {
                if (!acc[item.productCode]) {
                    acc[item.productCode] = {
                        productName: item.productName,
                        sizes: [],
                    };
                }
                acc[item.productCode].sizes.push(item);
                return acc;
            }, {});

            setGroupedProducts(grouped);
        };

        fetchStockItems();
    }, [location]);

    // Ürün seçimi
    const handleProductChange = (e) => {
        const productCode = e.target.value;
        if (productCode) {
            setSelectedProductGroup({
                productCode,
                ...groupedProducts[productCode],
            });
            setSelectedSize(""); // Beden seçimini sıfırla
        } else {
            setSelectedProductGroup(null);
            setSelectedSize("");
        }
    };

    // Beden seçimi
    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedProductGroup && selectedSize && quantity > 0) {
            const parsedQuantity = parseInt(quantity);
            const selectedProduct = selectedProductGroup.sizes.find(item => item.size === selectedSize);

            if (!selectedProduct) {
                alert("Kies alstublieft een geldige maat");
                return;
            }

            // Stok miktarı kontrolü
            if (parsedQuantity > selectedProduct.quantity) {
                alert("Er kunnen geen producten worden uitgeleend die de voorraad overschrijden!");
                return;
            }

            const newQuantity = selectedProduct.quantity - parsedQuantity;

            try {
                // Ödünç işlemini kaydet
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
                console.error("Error:", error);
            }
        } else {
            alert("Kies alstublieft een geldig product, maat en hoeveelheid.");
        }
    };

    return (
        <div className="lend-product-container">
            <div className="back-container">
                <Link className="homepage-button" to="/">Homepage</Link>
                <button className="back-button" onClick={() => navigate(-1)}>
                    Vorige pagina
                </button>
            </div>
            <h2 className="lend-product-title">{location} Lenen formulier</h2>

            <form onSubmit={handleSubmit} className="lend-product-form">
                <div className="form-group">
                    <label>Kies Product:</label>
                    <select onChange={handleProductChange} required>
                        <option value="">Kies een product</option>
                        {Object.entries(groupedProducts).map(([productCode, productGroup]) => (
                            <option key={productCode} value={productCode}>
                                {productGroup.productName} ({productCode})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedProductGroup && (
                    <>
                        <div className="form-group">
                            <label>Kies Maat:</label>
                            <select onChange={handleSizeChange} required>
                                <option value="">Kies een maat</option>
                                {selectedProductGroup.sizes.map(product => (
                                    <option key={product.size} value={product.size}>
                                        {product.size} (aantal: {product.quantity})
                                    </option>
                                ))}
                            </select>
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
                            <label>Lener (met personeelnummer):</label>
                            <input
                                type="text"
                                value={borrower}
                                onChange={(e) => setBorrower(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Uitlener:</label>
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
