import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import * as XLSX from "xlsx"; // Excel export için gerekli
import jsPDF from "jspdf"; // PDF export için gerekli
import "jspdf-autotable"; // jsPDF ile tablo oluşturma
import "../LoanProductPage.css"; // CSS dosyası

const LoanProductPage = () => {
    const [loanItems, setLoanItems] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const { location: currentLocation } = state || {};

    useEffect(() => {
        const fetchLoanItems = async () => {
            const q = query(collection(db, "loans"), where("location", "==", currentLocation));
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLoanItems(items);
        };

        fetchLoanItems();
    }, [currentLocation]);


    const handleReturnLoan = async (loanId, productId, quantity, productData) => {
        try {
            await deleteDoc(doc(db, "loans", loanId));

            const productRef = doc(db, "stock", productId);
            const productDoc = await getDoc(productRef);

            if (productDoc.exists()) {
                const currentQuantity = productDoc.data().quantity || 0;
                const newQuantity = parseInt(currentQuantity, 10) + parseInt(quantity, 10);
                await updateDoc(productRef, { quantity: newQuantity });
            } else {
                await setDoc(productRef, {
                    ...productData,
                    quantity: quantity
                });
            }

            setLoanItems(loanItems.filter(item => item.id !== loanId));
        } catch (error) {
            console.error("Ürün iade hatası:", error);
        }
    };

    // Excel formatında dışa aktarma fonksiyonu
    const exportToExcel = (filename, rows) => {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Voorraad List");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    // PDF formatında dışa aktarma fonksiyonu
    const exportToPDF = (filename, rows) => {
        const doc = new jsPDF();
        doc.text(`${currentLocation} Geleende Producten Lijst`, 20, 10);
        doc.autoTable({
            head: [["Productcode", "Product naam",  "Maat", "Aantal", "Geleend door", "Lener", "Datum","Location"]],
            body: rows.map(row => [
                row.productCode,
                row.productName,
                row.size,
                row.quantity,
                row.borrower,
                row.lender,
                new Date(row.date.seconds * 1000).toLocaleDateString(),
                row.location
            ]),
        });
        doc.save(`${filename}.pdf`);
    };

    return (
        <div className="loan-list-container">
            <header className="header">
                <h1>{currentLocation} Geleende Producten</h1>
            </header>


            <div className="export-buttons-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    Vorige pagina
                </button>
                <button className="export-button" onClick={() => exportToExcel("loan_list", loanItems)}>
                    Exporteer Geleende Lijst (Excel)
                </button>
                <button className="export-button" onClick={() => exportToPDF("loan_list", loanItems)}>
                    Exporteer Geleende Lijst (PDF)
                </button>
            </div>

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
                            <button
                                className="return-button"
                                onClick={() => handleReturnLoan(loan.id, loan.productId, loan.quantity, {
                                    productName: loan.productName,
                                    productCode: loan.productCode,
                                    size: loan.size,
                                    location: currentLocation
                                })}
                            >
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

export default LoanProductPage;
