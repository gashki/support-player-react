import React, { Component } from "react";
import "./Upload.css";

// React components
import Details from "./Details";
import Media from "./Media";


// The content for the upload page
class Upload extends Component {
  constructor(props) {
    super(props);

    // The default state of the upload page
    this.state = {
      content: 0,
      nade: "",
      map: "",
      start: "",
      end: "",
      movement: false,
      viewmodel: false,
      vsettings: false,
      move: null,
      tick: null,
      thrw: null,
      team: null,
      view: null,
      source: "",
      oneway: false,
      shadow: 0,
      texture: 0,
      effect: 0,
      shader: 0,
      location: [],
      alignment: [],
      result: [],
      video: null,
      comments: {
        location: "",
        alignment: "",
        result: ""
      }
    };
  }

  // Sets the state of an input
  handleChange = (input, value) => {
    this.setState({
      [input]: value
    });
  };

  // Verifies the input of the details form
  handleDetails = (e) => {
    const {
      nade,
      map,
      start,
      end,
      movement,
      viewmodel,
      move,
      tick,
      thrw,
      team,
      view
    } = this.state;

    const changeContent = this.props.changeContent;

    // Prevents the form from being submitted
    e.preventDefault();

    let invalidList = [];

    // Checks for any missing input
    if (nade === "") {
      invalidList.push("Grenade");
    }

    if (map === "") {
      invalidList.push("Map");
    }

    if (start === "") {
      invalidList.push("Start Location");
    }

    if (end === "") {
      invalidList.push("End Location");
    }

    if (movement && move === null) {
      invalidList.push("Movement");
    }

    if (movement && tick === null) {
      invalidList.push("Tick Rate");
    }

    if (thrw === null) {
      invalidList.push("Throw Variation");
    }

    if (team === null) {
      invalidList.push("Team");
    }

    if (viewmodel && view === null) {
      invalidList.push("Viewmodel");
    }

    // Displays an error message if there is missing input
    if (invalidList.length > 0) {
      // Builds a list of components with the missing inputs
      const invalidInput = invalidList.map((invalid, index) => {
        const id = `missing-field-${index}`;

        return (
          <li key={id}><i style={{ color: "#f5f5f5" }}>{invalid}</i> is a required field</li>
        );
      });

      // The error message to display
      const content =
        <UploadMessage
          title="Missing Information"
          message="The following information is missing and must be completed before continuing."
          content={<ul>{invalidInput}</ul>}
          changeContent={changeContent}
        />;

      changeContent("contentModal", content);
    }
    else {
      // Continue to the media form
      this.setState({
        content: 1
      });
    }
  };

  render() {
    const {
      content,
      location,
      alignment,
      result,
      video,
      comments,
      ...details
    } = this.state;

    const media = {
      location: location,
      alignment: alignment,
      result: result,
      video: video,
      comments: comments
    };

    const handleChange = this.handleChange;
    const handleDetails = this.handleDetails;

    return (
      <div className="upload">
        <h2>Submit a Grenade</h2>
        <h4>* indicates required field</h4>
        {content === 0
          ? <Details
            {...details}
            handleChange={handleChange}
            handleSubmit={handleDetails}
          />
          : <Media
            {...media}
            handleChange={handleChange}
          />
        }
      </div>
    );
  }
}


// The error message used for the upload page
function UploadMessage({ title, message, content, changeContent }) {
  // Prevents the modal from closing when the content is clicked
  const handleClick = (e) => {
    e.stopPropagation();
  };

  const closeModal = () => {
    changeContent("contentModal", null);
  };

  return (
    <div className="upload-message" onClick={handleClick}>
      <h3>{title}</h3>
      <p>{message}</p>
      {content}
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <button type="button" onClick={closeModal}>Dismiss</button>
      </div>
    </div>
  );
}


export default Upload;
