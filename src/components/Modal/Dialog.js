import React from "react";

// The dialog component used for accepting user input
function Dialog(props) {
  const { title, message, action, type = "text", onSubmit, changeState } = props;

  // Prevents the modal from closing when the content is clicked
  const handleClick = (e) => {
    e.stopPropagation();
  };

  const closeModal = () => {
    changeState("contentModal", null);
  };

  return (
    <div className="modal-dialog" onClick={handleClick}>
      <h3>{title}</h3>
      <p>{message}</p>
      <input className="modal-form-input border-box" type={type} maxLength={140} required />
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <button type="button" onClick={onSubmit}>{action}</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default Dialog;
