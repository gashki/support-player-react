import React from "react";
import "./Content.css";

// React components
import NadeList from "./NadeList";
import Sidebar from "./Sidebar";
import Upload from "./Upload/Upload";


function Content(props) {
  //types of content: browse(default/null),search,upload,nade,collection,error
  function renderContent() {
    switch (props.contentMain.type) {
      case "upload":
        return <Upload changeContent={props.changeContent} />;
      default:
        return [<Sidebar key={1} />, <NadeList key={2} />];
    }
  }

  return (
    <div className="content">
      {renderContent()}
    </div>
  );
}


export default Content;
