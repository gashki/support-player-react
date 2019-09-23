import React, { Component } from "react";
import "./Sidebar.css";

// Custom scroll bar library
import "../../lib/simplebar.min.css";
import SimpleBar from "../../lib/simplebar.min.js";

// React components
import Collections from "./Collections";
import Filters from "./Filters";


// The sidebar for the main page
class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Initializes the custom scroll bar
    new SimpleBar(document.getElementById("sidebar-simplebar"));
  }

  render() {
    const { contentState, currentUser, changeState } = this.props;

    // The collections content for the sidebar
    const collections =
      <Collections currentUser={currentUser} changeState={changeState} />;

    // The filters content for the sidebar
    const filters =
      <Filters contentState={contentState} changeState={changeState} />;

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


// Displays the content for the sidebar sections
function SidebarSection({ title, content }) {
  return (
    <section className="sidebar-section">
      <h2>{title}</h2>
      {content}
    </section>
  );
}


export default Sidebar;
