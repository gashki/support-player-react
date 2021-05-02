import React from "react";
import "./Content.css";

// React components
import Grenade from "./Grenade/Grenade";
import NadeList from "./NadeList";
import Sidebar from "./Sidebar/Sidebar";
import Upload from "./Upload/Upload";


// Displays the content components for the current state
function Content(props) {
  const { contentMain, currentUser, changeState } = props;
  const contentType = contentMain.type;
  const contentState = contentMain.state;

  // Determines the components to render
  function renderState() {
    switch (contentType) {
      case "Grenade":
      case "Collection":
      case "Permalink":
        return <Grenade
          contentType={contentType}
          contentState={contentState}
          currentUser={currentUser}
          changeState={changeState}
        />;
      case "NadeList":
        return [
          <Sidebar key={"content-sidebar"} contentState={contentState} currentUser={currentUser} changeState={changeState} />,
          <NadeList key={"content-nadelist"} contentState={contentState} currentUser={currentUser} changeState={changeState} />
        ];
      case "Upload":
        return <Upload changeState={changeState} />;
      default:
        return null;
    }
  }

  return (
    <div className="content">
      {renderState()}
    </div>
  );
}

export default Content;
