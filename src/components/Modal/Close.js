import React from "react";
import { SvgClose } from "../SvgIcons";

// The button used for closing the modal
function Close({ changeContent }) {
  const handleClick = () => {
    changeContent("contentModal", null);
  };

  // The attributes for the close button
  const attributes = { title: "Close", type: "button", onClick: handleClick };

  return (
    <button className="modal-close" {...attributes}>
      <SvgClose color="#bdbdbd" />
    </button>
  );
}

export default Close;
