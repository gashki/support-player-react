import React from "react";
import "./Sidebar.css";

// React components
import Collections from "./Collections";
import Filters from "./Filters";


function Sidebar({ contentState, changeState }) {
  const collections = <Collections />;
  const filters = <Filters contentState={contentState} changeState={changeState} />;

  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        <SidebarSection title="Collections" content={collections} />
        <SidebarSection title="Filters" content={filters} />
      </div>
    </div>
  );
}


function SidebarSection({ title, content }) {
  return (
    <section className="sidebar-section">
      <h2>{title}</h2>
      {content}
    </section>
  );
}


export default Sidebar;
