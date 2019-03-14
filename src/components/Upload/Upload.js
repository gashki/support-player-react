import React, { Component } from "react";
import { functions } from "../../firebase";
import "./Upload.css";

// React components
import Details from "./Details";
import Media from "./Media";
import { UploadMessage } from "./Form";


// The content for the upload page
class Upload extends Component {
  constructor(props) {
    super(props);

    // The default state of the upload page
    this.state = {
      content: 1,
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

    // Prevents the form from being submitted
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

    // Check for any missing fields
    if (invalidList.length > 0) {
      this.displayMissingFields(invalidList);
    }
    else {
      // Continue to the media form
      this.setState({
        content: 1
      });

      // Scroll to the top of the page
      document.querySelector(".content > .scroll").scrollTop = 0;
    }
  };

  // Verifies the input of the media form
  handleMedia = (e) => {
    const { content, location, alignment, result, video, ...details } = this.state;

    // Prevents the form from being submitted
    e.preventDefault();

    if (content !== 1) {
      return null;
    }

    let invalidList = [];

    if (location.length === 0) {
      invalidList.push("Location");
    }

    if (alignment.length === 0) {
      invalidList.push("Alignment");
    }

    if (result.length === 0) {
      invalidList.push("Result");
    }

    // Check for any missing fields
    if (invalidList.length > 0) {
      this.displayMissingFields(invalidList);
    }
    else {
      const validate = functions.httpsCallable("submitDetails");

      // The number of images expected to be uploaded to storage
      details.images = {
        location: location.length,
        alignment: alignment.length,
        result: result.length
      };

      details.video = video ? true : false;

      console.log(details);
      /*
      validate(details).then(result => {
        console.log(result);
      }).catch(error => {
        console.log(error);
      });*/
    }
  };

  // Displays an error message with the missing fields
  displayMissingFields = (invalidList) => {
    const changeContent = this.props.changeContent;

    // Builds a list of components with the fields
    const invalidInput = invalidList.map((invalid, index) => {
      const id = `missing-field-${index}`;

      return (
        <li key={id}><i style={{ color: "#f5f5f5" }}>{invalid}</i> is a required field</li>
      );
    });

    // The content of the error message
    const content =
      <UploadMessage
        title="Missing Information"
        message="The following information is missing and must be completed before continuing."
        content={<ul>{invalidInput}</ul>}
        changeContent={changeContent}
      />;

    changeContent("contentModal", content);
  };

  render() {
    const { content, location, alignment, result, video, comments, ...details } = this.state;

    const media = {
      location: location,
      alignment: alignment,
      result: result,
      video: video,
      comments: comments
    };

    const handleChange = this.handleChange;
    const handleDetails = this.handleDetails;
    const handleMedia = this.handleMedia;
    const changeContent = this.props.changeContent;

    return (
      <div className="upload">
        <h2>Submit a Grenade</h2>
        <h4>* indicates required field</h4>
        {content === 0
          ? <Details
            {...details}
            handleChange={handleChange}
            handleSubmit={handleDetails}
            changeContent={changeContent}
          />
          : <Media
            {...media}
            handleChange={handleChange}
            handleSubmit={handleMedia}
            changeContent={changeContent}
          />
        }
      </div>
    );
  }
}

export default Upload;
