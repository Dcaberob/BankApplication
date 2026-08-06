import React, { useState, useEffect } from "react";
import { deleteTransactionsRequest, getAllTransactionRequest } from "../../rest/resquest_api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTransactionRequest();
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };
    fetchData();
    console.log(transactions);
  }, []);

  const deleteAllTransactions = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar todas las transacciones?");
    if (!confirmDelete) return;
  
    try {
      const response = await deleteTransactionsRequest();
      console.log(response);
  
      if (!response) {
        throw new Error("Error al eliminar transacciones");
      }
      localStorage.removeItem("transactions");
      localStorage.removeItem("saldo");
      const data = response;
      alert(data.message);

      setTransactions([]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-center flex-grow-1">Historial Transactions</h4>
        <button className="btn btn-secondary btn-sm" 
          onClick={deleteAllTransactions}>
          Eliminar Transacciones
        </button>
      </div>
      <div className="table-responsive tasks">
        <table class="card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
          <thead className="table-primary text-white text-center">
            <tr className="">
              <th></th>
              <th colSpan={2}>Bolivianos</th>
              <th colSpan={2}>Dolares</th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th>Transacciones</th>
              <th>Ingreso</th>
              <th>Egreso</th>
              <th>Ingreso</th>
              <th>Egreso</th>
              <th>Fecha</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.inBs}</td>
                <td>{item.outBs}</td>
                <td>{item.inSus}</td>
                <td>{item.outSus}</td>
                <td>{item.date}</td>
                <td>{item.user}</td>
              </tr>
            ))}

            {/* Fila del total general */}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
