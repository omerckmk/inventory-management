import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../StockList.css"; // CSS dosyasını burada import ediyoruz.

const StockListPage = () => {
    const { location } = useParams();
    const [stockItems, setStockItems] = useState([]);
    const navigate = useNavigate(); // Yönlendirme için kullanacağımız hook

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

        fetchStockItems();
    }, [location]);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "stock", id));
        setStockItems(stockItems.filter(item => item.id !== id));
    };

    // Excel formatında dışa aktarma fonksiyonu
    const exportToExcel = (filename, rows) => {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${location} Voorraad Lijst`);

        // Export as Excel file
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    // PDF formatında dışa aktarma fonksiyonu
    const exportToPDF = (filename, rows) => {
        const doc = new jsPDF();

        // Başlık
        doc.text(`${location} Voorraad Lijst`, 20, 10);

        // Tabloyu otomatik oluştur
        doc.autoTable({
            head: [["Location", "Product code", "Product naam", "Maat", "Aantal"]],
            body: rows.map(row => [row.location, row.productCode, row.productName, row.size, row.quantity]),
        });

        doc.save(`${filename}.pdf`);
    };

    return (
        <div className="stock-list-container">
            <header className="header">
                <div className="homepage-button-container">
                    <Link className="homepage-button" to="/">Homepage</Link>
                </div>
                <div className="action-buttons-container">
                    <Link className="add-product-button" to={`/location/${location}/add`}>Nieuw product toevoegen</Link>
                    <Link className="lend-button" to={`/location/${location}/lend`}>Lenen</Link>
                    <button
                        className="loan-page-button"
                        onClick={() => navigate("/loan-products", { state: { location } })}
                    >
                        Geleende Producten
                    </button>
                </div>
            </header>

            <h1 className="page-title">{location} Voorraad</h1>

            <div className="export-buttons-container">
                <button className="export-button" onClick={() => exportToExcel("stock_list", stockItems)}>
                    Exporteer Stoklijst (Excel)
                </button>
                <button className="export-button" onClick={() => exportToPDF("stock_list", stockItems)}>
                    Exporteer Stoklijst (PDF)
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
                        <td className="acties-table">
                            <button className="delete-button" onClick={() => handleDelete(item.id)}>Verwijder</button>
                            <Link className="update-button" to={`/location/${location}/update/${item.id}`}>Bijwerken</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
};

export default StockListPage;
