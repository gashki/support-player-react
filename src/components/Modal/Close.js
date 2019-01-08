import React from "react";
import ic_close from "../../svg/ic_close.svg";

// The button used for closing the modal.
function Close({ changeContent }) {
  const handleClick = () => {
    changeContent("contentModal", null);
  };

  // The attributes for the close button.
  const attributes = { title: "Close", type: "button", onClick: handleClick };

  return (
    <button className="modal-close" {...attributes}>
      <img src={ic_close} alt="" />
    </button>
  );
}

export default Close;
