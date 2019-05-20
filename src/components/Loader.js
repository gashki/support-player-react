import React from "react";
import "./Loader.css";

function Loader({ size = "medium" }) {
  return (
    <div className={`loader loader-${size}`}>
      <div /><div /><div /><div /><div /><div />
      <div /><div /><div /><div /><div /><div />
    </div>
  );
}

export default Loader;
