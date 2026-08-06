import React, { useEffect, useState } from "react";
import { getUsersRequest, editUserRequest, deleteUserRequest } from "../../rest/resquest_api";

export default function UserList({ onRefresh }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getUsersRequest();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [onRefresh]); // Refreshes data when `onRefresh` changes.
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditedData({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await editUserRequest(editedData); 
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editedData._id ? editedData : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditedData({});
  };

  const handleDelete = async (id) => {
    console.log(id)
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserRequest(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error.message);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div className="table-responsive tasks">
      <h4 className="text-center mb-4">Users</h4>
      <table className="card-table table-vcenter text-nowrap mb-0 border dashboard-table me-1 table">
        <thead className="table-primary text-white text-center">
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editingUser === user._id ? (
              <tr key={user._id}>
                <td>
                  <input
                    type="text"
                    name="username"
                    value={editedData.username || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="role"
                    value={editedData.role || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="password"
                    name="password"
                    value={editedData.password || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={handleSave}
                  >
                    Guardar
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
