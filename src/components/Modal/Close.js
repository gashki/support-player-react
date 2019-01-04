import React from "react";
import ic_close from "../../svg/ic_close.svg";

function Close(props) {
  return (
    <button className="modal-close" title="Close" type="button" onClick={() => props.toggleModal(null)}>
      <img src={ic_close} alt="" />
    </button>
  );
}

export default Close;
