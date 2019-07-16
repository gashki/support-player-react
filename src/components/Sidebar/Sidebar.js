import React, { Component } from "react";
import "./Sidebar.css";

// Custom scroll bar library
import "../../lib/simplebar.min.css";
import SimpleBar from "../../lib/simplebar.min.js";

// React components
import Collections from "./Collections";
import Filters from "./Filters";


class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    new SimpleBar(document.getElementById("sidebar-simplebar"));
  }

  render() {
    const { contentState, changeState } = this.props;

    const collections = <Collections />;
    const filters = <Filters contentState={contentState} changeState={changeState} />;

    return (
      <div id="sidebar-simplebar" className="sidebar">
        <div className="sidebar-inner">
          <SidebarSection title="Collections" content={collections} />
          <SidebarSection title="Filters" content={filters} />
        </div>
      </div>
    );
  }
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
