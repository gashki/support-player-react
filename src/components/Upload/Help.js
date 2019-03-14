import React from "react";
import { UploadMessage } from "./Form";
import ic_help from "../../svg/ic_help.svg";

// The button used for opening a help message
function Help({ message, content, changeContent }) {
  const handleClick = () => {
    // The content of the help message
    const help =
      <UploadMessage
        title="Additional Information"
        message={message}
        content={content}
        changeContent={changeContent}
      />;

    changeContent("contentModal", help);
  };

  // The attributes for the help button
  const attributes = { title: "Help", type: "button", onClick: handleClick };

  return (
    <button className="upload-help" {...attributes}>
      <img src={ic_help} alt="" />
    </button>
  );
}

export default Help;
