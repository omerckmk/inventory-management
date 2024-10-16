import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import "../StockList.css"; // CSS dosyasını burada import ediyoruz.

const StockListPage = () => {
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

    // CSV formatında dışa aktarma fonksiyonu
    const exportToCSV = (filename, rows) => {
        const csvContent = [
            Object.keys(rows[0]).join(","), // Header
            ...rows.map(row => Object.values(row).join(",")) // Data rows
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <div className="stock-list-container">
            <header className="header">
                <Link className="homepage-button" to="/">Homepage</Link>
                <h1>{location} Inventary lijst</h1>
                <Link className="add-product-button" to={`/location/${location}/add`}>Nieuw product toevoegen</Link>
            </header>

            <div className="export-buttons-container">
                <button className="export-button" onClick={() => exportToCSV("stock_list.csv", stockItems)}>
                    Exporteer Stoklijst
                </button>
                <button className="export-button" onClick={() => exportToCSV("loan_list.csv", loanItems)}>
                    Exporteer Geleende Lijst
                </button>
            </div>

            <table className="stock-table">
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
                            <button className="delete-button" onClick={() => handleDelete(item.id)}>Verwijder</button>
                            <Link className="update-button" to={`/location/${location}/update/${item.id}`}>Bijwerken</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>{location} Geleende Producten</h2>
            <table className="loan-table">
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
                            <button className="return-button" onClick={() => handleReturnLoan(loan.id, loan.productId, loan.quantity)}>
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

export default StockListPage;
