import React, { useState, useEffect } from "react";
import {
  getAllTransactionRequest,
  getUsersRequest,
  getBalanceRequest
} from "../../rest/resquest_api";

export default function DashboardAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUsers] = useState([]);
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTransactionRequest();
        setTransactions(response);
        const response_user = await getUsersRequest();
        setUsers(response_user);
        const response_balance = await getBalanceRequest();
        setBalance(response_balance);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };
    fetchData();
    console.log(transactions.length);
    console.log(user.length);
  }, []);

  return (
    <div className="mt-4">
      <div className="row-sm row">
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div className="custom-card card">
            <div className="card-body">
              <div className="card-item-title mb-2"> Nro de Transacciones</div>
              <div className="card-item-body">
                <div className="card-item-stat">
                <h4 className="fw-bold">{transactions.length || 0}</h4>
                </div>   
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div className="custom-card card">
            <div className="card-body">
              <div className="card-item-title mb-2"> Nro de Users</div>
              <div className="card-item-body">
                <div className="card-item-stat">
                <h4 className="fw-bold">{user.length || 0}</h4>
                </div>   
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div className="custom-card card">
            <div className="card-body">
              <div className="card-item-title mb-2"> Nro de Balances</div>
              <div className="card-item-body">
                <div className="card-item-stat">
                <h4 className="fw-bold">{balance.length || 0}</h4>
                </div>   
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <div className="table-responsive tasks">
        <h3 className="mt-3">Lista de Transacciones</h3>
        <table class="card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
          <thead className="table-primary text-white text-center">
            <tr className="">
              <th></th>
              <th colSpan={2}>Bs</th>
              <th colSpan={2}>$us</th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th>Transaccion</th>
              <th>Ingreso</th>
              <th>Egreso</th>
              <th>Ingreso</th>
              <th>Egreso</th>
              <th>Fecha</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(-4).map((item) => (
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
            <tr></tr>
          </tbody>
        </table>
      </div>
      <div className="table-responsive tasks">
        <h3 className="mt-4"> Lista de Usuarios</h3>
        <table class="card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
          <thead className="table-primary text-white text-center">
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {user.slice(-4).map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.password}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
