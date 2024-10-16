import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import "../StockList.css"; // CSS dosyasını burada import ediyoruz.

const StockList = () => {
    const { location } = useParams();
    const [stockItems, setStockItems] = useState([]);
    const [loanItems, setLoanItems] = useState([]);

    useEffect(() => {
        const fetchStockItems = async () => {
            const q = query(collection(db, "stock"), where("location", "==", location));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Miktarı 0 olan ürünleri filtrele
            const filteredItems = items.filter(item => item.quantity > 0);
            setStockItems(filteredItems);
        };

        const fetchLoanItems = async () => {
            const q = query(collection(db, "loans"), where("location", "==", location));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLoanItems(items);
        };

        fetchStockItems();
        fetchLoanItems();
    }, [location]);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "stock", id));
        setStockItems(stockItems.filter(item => item.id !== id));
    };

    const handleReturnLoan = async (loanId, productId, quantity) => {
        try {
            await deleteDoc(doc(db, "loans", loanId));
            const productRef = doc(db, "stock", productId);
            const productDoc = await getDoc(productRef);

            if (productDoc.exists()) {
                const currentQuantity = productDoc.data().quantity || 0;
                const newQuantity = parseInt(currentQuantity, 10) + parseInt(quantity, 10);
                await updateDoc(productRef, { quantity: newQuantity });
                setLoanItems(loanItems.filter(item => item.id !== loanId));
            }
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    return (
        <div>
            <header>
                <Link to={`/location/${location}/add`}>Nieuw product toevoegen</Link>
                <Link to="/">Homepage</Link>
                <h1>{location} Inventary lijst</h1>
            </header>
            <table>
            <thead>
                <tr>
                    <th>Product code</th>
                    <th>Product naam</th>
                    <th>Maat</th>
                    <th>Aantal</th>
                    <th>Acties</th>
                </tr>
                </thead>
                <tbody>
                {stockItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.productCode}</td>
                        <td>{item.productName}</td>
                        <td>{item.size}</td>
                        <td>{item.quantity}</td>
                        <td>
                            <button onClick={() => handleDelete(item.id)}>Verwijder</button>
                            <Link to={`/location/${location}/lend?productId=${item.id}`}>Lenen</Link>
                            <Link to={`/location/${location}/update/${item.id}`}>Bijwerken</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>{location} Geleende Producten</h2>
            <table>
                <thead>
                <tr>
                    <th>Productnaam</th>
                    <th>Productcode</th>
                    <th>Maat</th>
                    <th>Aantal</th>
                    <th>Geleend door</th>
                    <th>Gever</th>
                    <th>Datum</th>
                    <th>Acties</th>
                </tr>
                </thead>
                <tbody>
                {loanItems.map((loan) => (
                    <tr key={loan.id}>
                        <td>{loan.productName}</td>
                        <td>{loan.productCode}</td>
                        <td>{loan.size}</td>
                        <td>{loan.quantity}</td>
                        <td>{loan.borrower}</td>
                        <td>{loan.lender}</td>
                        <td>{new Date(loan.date.seconds * 1000).toLocaleDateString()}</td>
                        <td>
                            <button onClick={() => handleReturnLoan(loan.id, loan.productId, loan.quantity)}>
                                Teruggeven
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
