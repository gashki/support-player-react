import React from "react";
import "./Modal.css";

// The modal to display over the main content
function Modal({ contentModal, changeContent }) {
  // Closes the modal when the background is clicked
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
