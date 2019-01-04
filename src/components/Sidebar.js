import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        <SidebarSection title="Collections" />
      </div>
    </div>
  );
}

function SidebarSection(props) {
  return (
    <h2 className="sidebar-section">{props.title}</h2>
  );
}

export default Sidebar;
