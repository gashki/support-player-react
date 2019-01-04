import React from "react";
import "./NadeList.css";
import NadeCard from "./NadeCard";

function NadeList() {
  return (
    <ul className="nade-list">
      <NadeCard />
      <NadeCard />
    </ul>
  );
}

export default NadeList;
