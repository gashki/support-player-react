import React from "react";
import "./Modal.css";

function Modal(props) {
  return (
    <div className="modal" onClick={() => props.toggleModal(null)}>
      {props.modalContent}
    </div>
  );
}

export default Modal;
