import React from "react";
import "./Content.css";

// React components
import NadeList from "./NadeList";
import Sidebar from "./Sidebar/Sidebar";
import Upload from "./Upload/Upload";


function Content(props) {
  const contentType = props.contentMain.type;
  const contentState = props.contentMain.state;
  const changeState = props.changeState;
  //types of content: browse(default/null),search,upload,nade,collection,error
  function renderContent() {
    switch (contentType) {
      case "Collection":
        return <div></div>;
      case "Grenade":
        return <div></div>;
      case "NadeList":
        return [
          <Sidebar key={1} contentState={contentState} changeState={changeState} />,
          <NadeList key={2} contentState={contentState} changeState={changeState} />
        ];
      case "Upload":
        return <Upload changeState={changeState} />;
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
