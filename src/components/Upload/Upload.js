import React, { Component } from "react";
import "./Upload.css";

// Components
import Details from "./Details";
import Media from "./Media";

class Upload extends Component {
  constructor(props) {
    super(props);

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
      thrw: null,
      tick: null,
      team: null,
      view: 0,
      source: "",
      oneway: false,
      shadow: 0,
      texture: 0,
      effect: 0,
      shader: 0
    };
  }

  handleChange = (e, input) => {
    const target = e.target;
    const type = target.type === "checkbox";

    this.setState({
      [input]: type ? target.checked : target.value
    });
  };

  handleDetails = (e) => {
    const {
      nade,
      map,
      start,
      end,
      movement,
      viewmodel,
      move,
      thrw,
      tick,
      team,
      view
    } = this.state;

    const changeContent = this.props.changeContent;

    e.preventDefault();

    let invalidList = [];

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

    if (thrw === null) {
      invalidList.push("Throw Variation");
    }

    if (tick === null) {
      invalidList.push("Tick Rate");
    }

    if (team === null) {
      invalidList.push("Team");
    }

    if (viewmodel && parseInt(view) === 0) {
      invalidList.push("Viewmodel Position");
    }

    if (invalidList.length > 0) {
      const invalidInput = invalidList.map((invalid, index) => {
        return (
          <li><i style={{ color: "#f5f5f5" }}>{invalid}</i> is a required field</li>
        );
      });

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
      // no errors
    }
  };

  // Does the alignment of this grenade require specific video settings?
  // Does the alignment of this grenade require a specific viewmodel?

  render() {
    const { content, ...details } = this.state;
    const handleChange = this.handleChange;
    const handleDetails = this.handleDetails;

    return (
      <div className="upload">
        <h2>Submit a Grenade</h2>
        <h4>* indicates required field</h4>
        {true
          ? <Details
            {...details}
            handleChange={handleChange}
            handleSubmit={handleDetails}
          />
          : <Media />}
      </div>
    );
  }
}

function UploadMessage({ title, message, content, changeContent }) {
  // Prevents the modal from closing when the content is clicked.
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
