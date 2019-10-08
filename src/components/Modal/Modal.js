import React from "react";
import "./Modal.css";

// The modal to display over the main content
function Modal({ contentModal, changeState }) {
  // Closes the modal when the background is clicked
  const handleClick = () => {
    changeState("contentModal", null);
  };

  return (
    <div className="modal" onMouseDown={handleClick}>
      {contentModal}
    </div>
  );
}

export default Modal;
