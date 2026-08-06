import React, { useState, useEffect } from "react";
import { getBalanceRequest, deleteBalanceRequest } from "../../rest/resquest_api";

export default function Balance() {
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBalanceRequest();
        setBalance(response);
        console.log(response)
      } catch (error) {
        console.error("Error fetching Balances:", error.message);
      }
    };
    fetchData();
    console.log(balance);
  }, []);

  const deleteAllBalance = async () => {
      const confirmDelete = window.confirm("¿Estás seguro de eliminar todas las balances?");
      if (!confirmDelete) return;
    
      try {
        const response = await deleteBalanceRequest();
        console.log(response);
    
        if (!response) {
          throw new Error("Error al eliminar balances");
        }
        const data = response;
        alert(data.message);
  
        setBalance([]);
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-center flex-grow-1">Historial Balances</h4>
        <button className="btn btn-secondary btn-sm" 
        onClick={deleteAllBalance} >
          Eliminar Balances
        </button>
      </div>
      <div className="table-responsive tasks">
        <table class="card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
          <thead className="table-primary text-white text-center">
            
            <tr>
              <th>CycleId</th>
              <th>User</th>
              <th>Dolar</th>
              <th>Bs</th>
              <th>Date</th>
              
            </tr>
          </thead>
          <tbody>
            {balance.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.user}</td>
                <td>{item.sus}</td>
                <td>{item.bs}</td>
                <td>{item.date}</td>
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
