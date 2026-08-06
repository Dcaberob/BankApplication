import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AlertModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-confirm">
        <div className="modal-content">
          <div className="modal-header">
            <div className="icon-box">
              <i className="material-icons">&#xE5CD;</i>
            </div>
            <h4 className="modal-title w-100">Error!</h4>
          </div>
          <div className="modal-body">
            <p className="text-center">
              Existe un balance ya iniciado, por favor concluya este.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
