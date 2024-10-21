import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../StockList.css";

const StockListPage = () => {
    const { location } = useParams();
    const [stockItems, setStockItems] = useState([]);
    const [openAccordions, setOpenAccordions] = useState({});
    const navigate = useNavigate();

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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock List");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    // PDF formatında dışa aktarma fonksiyonu
    const exportToPDF = (filename, rows) => {
        const doc = new jsPDF();
        doc.text("Voorraad List", 20, 10);
        doc.autoTable({
            head: [["Location", "Product code", "Product naam", "Maat", "Aantal"]],
            body: rows.map(row => [row.location, row.productCode, row.productName, row.size, row.quantity]),
        });
        doc.save(`${filename}.pdf`);
    };

    // Ürünleri productCode'a göre gruplama fonksiyonu
    const groupByProductCode = (items) => {
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.productCode]) {
                acc[item.productCode] = [];
            }
            acc[item.productCode].push(item);
            return acc;
        }, {});
        return Object.keys(grouped).map(productCode => ({
            productCode,
            products: grouped[productCode]
        }));
    };

    // Accordion toggle işlemi
    const toggleAccordion = (productCode) => {
        setOpenAccordions((prevState) => ({
            ...prevState,
            [productCode]: !prevState[productCode]
        }));
    };

    const groupedItems = groupByProductCode(stockItems);

    return (
        <div className="stock-list-container">
            <header className="header">
                <div className="homepage-button-container">
                    <Link className="homepage-button" to="/">Homepage</Link>
                </div>
                <div className="action-buttons-container">
                    <Link className="add-product-button" to={`/location/${location}/add`}>Nieuw product toevoegen</Link>
                    <Link className="lend1-button" to={`/location/${location}/lend`}>Lenen</Link>
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
                </tr>
                </thead>
                <tbody>
                {groupedItems.map((group) => (
                    <React.Fragment key={group.productCode}>
                        <tr onClick={() => toggleAccordion(group.productCode)} className="accordion-header">
                            <td>{group.productCode}</td>
                            <td>{group.products[0].productName}</td>
                        </tr>
                        {openAccordions[group.productCode] && (
                            <tr>
                                <td colSpan="3">
                                    <table className="accordion-content">
                                        <thead>
                                        <tr>
                                            <th>Maat</th>
                                            <th>Aantal</th>
                                            <th>Acties</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {group.products.map((product) => (
                                            <tr key={product.size}>
                                                <td>{product.size}</td>
                                                <td>{product.quantity}</td>
                                                <td>
                                                   <div className="acties-button-container" >
                                                    <button className="delete-button" onClick={() => handleDelete(product.id)}>
                                                        Verwijder
                                                    </button>
                                                    <Link className="update-button" to={`/location/${location}/update/${product.id}`}>
                                                        Bijwerken
                                                    </Link>
                                                   </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockListPage;
