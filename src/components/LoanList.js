// src/components/LoanList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const LoanList = ({ location }) => {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const fetchLoans = async () => {
            const loanRef = collection(db, 'loans');
            const loanSnapshot = await getDocs(loanRef);
            const loanList = loanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLoans(loanList);
        };

        fetchLoans();
    }, [location]);

    const handleReturn = async (id) => {
        await deleteDoc(doc(db, 'loans', id));
    };

    return (
        <div>
            <h3>Ödünç Listesi ({location})</h3>
            <table>
                <thead>
                <tr>
                    <th>Ürün Adı</th>
                    <th>Beden</th>
                    <th>Adet</th>
                    <th>Alan Kişi</th>
                    <th>Veren Kişi</th>
                    <th>Tarih</th>
                    <th>İade Et</th>
                </tr>
                </thead>
                <tbody>
                {loans.map(loan => (
                    <tr key={loan.id}>
                        <td>{loan.productName}</td>
                        <td>{loan.size}</td>
                        <td>{loan.quantity}</td>
                        <td>{loan.borrower}</td>
                        <td>{loan.lender}</td>
                        <td>{loan.date}</td>
                        <td>
                            <button onClick={() => handleReturn(loan.id)}>İade Et</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LoanList;
