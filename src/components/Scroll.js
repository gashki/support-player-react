import React from "react";

// A component that fixes scrolling issues
function Scroll(props) {
  return (
    <div className="scroll">
      {props.children}
    </div>
  );
}

export default Scroll;
