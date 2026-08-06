import React, { useState } from "react";
import { createUserRequest } from "../../rest/resquest_api";

export default function UserForm({ onUserCreated }) {
  const [newUser, setNewUser] = useState({
    username: "",
    role: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.role || !newUser.password) {
      setError("All fields are required.");
      return;
    }
    setError("");
    try {
      await createUserRequest(newUser); 
      setNewUser({ username: "", role: "", password: "" });
      setShowModal(false); 
      onUserCreated(); 
    } catch (error) {
      console.error("Error creating user:", error.message);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <div className="text-center mt-4">
      <button
        className="btn btn-primary btn-lg"
        onClick={() => setShowModal(true)}
      >
        Crear Usuario
      </button>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nuevo Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateUser}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
                    <select
                      className="form-control"
                      id="role"
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccione un rol</option>
                      <option value="admin">Administrador</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                    />
                  </div>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <button type="submit" className="btn btn-success">
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
