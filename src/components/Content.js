import React from "react";
import "./Content.css";

// React components
import NadeList from "./NadeList";
import Sidebar from "./Sidebar";
import Upload from "./Upload/Upload";


function Content(props) {
  const contentType = props.contentMain.type;
  //types of content: browse(default/null),search,upload,nade,collection,error
  function renderContent() {
    switch (contentType) {
      case "Collection":
        return <div></div>;
      case "Grenade":
        return <div></div>;
      case "NadeList":
        return [<Sidebar key={1} />, <NadeList key={2} />];
      case "Upload":
        return <Upload changeState={props.changeState} />;
      default:
        return null;
    }
  }

  return (
    <div className="content">
      {renderContent()}
    </div>
  );
}


export default Content;
