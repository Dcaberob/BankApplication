import React, { useState, useEffect } from "react";
import { getAllTransactionRequest } from "../rest/resquest_api";

export default function History() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"))
      console.log(user.username);
      try {
        const response = await getAllTransactionRequest(user.username);
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };
    fetchData();
    console.log(transactions)
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Historial de transactions</h2>
      <table class="table table-striped table-bordered">
        <thead className="table-primary text-white text-center" >
          <tr className="">
            <th colSpan={3}></th>
            <th colSpan={2}>Bolivianos</th>
            <th colSpan={2}>Dolares</th>
            
          </tr>
          <tr>
            <th>Ciclo</th>
            <th>Tipo de transacción</th>
            <th>Fecha</th>
            <th>Ingreso</th>
            <th>Salida</th>
            <th>Ingreso</th>
            <th>Salida</th>
            
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item._id}>
              <td>{item.cycleId}</td>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.inBs}</td>
              <td>{item.outBs}</td>
              <td>{item.inSus}</td>
              <td>{item.outSus}</td>
            </tr>
          ))}

          {/* Fila del total general */}
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
}
