import React from "react";
import "./Content.css";
import Sidebar from "./Sidebar";
import NadeList from "./NadeList";

function Content() {
  return (
    <div className="content">
      <Sidebar />
      <NadeList />
    </div>
  );
}

export default Content;
