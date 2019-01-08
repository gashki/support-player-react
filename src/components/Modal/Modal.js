import React from "react";
import "./Modal.css";

// The modal to display over the main content.
function Modal({ contentModal, changeContent }) {
  const handleClick = () => {
    changeContent("contentModal", null);
  };

  return (
    <div className="modal" onClick={handleClick}>
      {contentModal}
    </div>
  );
}

export default Modal;
