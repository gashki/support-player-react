import React, { Component } from "react";
import { functions, storage } from "../../firebase";
import "./Upload.css";

// Custom progress bar library
import "../../lib/loading-bar.css";
import "../../lib/loading-bar.min.js";

// React components
import Details from "./Details";
import Media from "./Media";
import Scroll from "../Scroll";
import { UploadMessage } from "./Form";


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
    this.setState({ [input]: value });
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

    if (start.trim() === "") {
      invalidList.push("Start Location");
    }

    if (end.trim() === "") {
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
      this.setState({ content: 1 });

      // Scroll to the top of the page
      document.querySelector(".content > .scroll").scrollTop = 0;
    }
  };

  // Verifies the input of the media form
  handleMedia = (e) => {
    const { content, location, alignment, result, video, ...details } = this.state;
    const changeState = this.props.changeState;

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
      const media = { location, alignment, result, video };

      // The number of images expected to be uploaded to storage
      details.images = {
        location: location.length,
        alignment: alignment.length,
        result: result.length
      };

      details.video = video ? true : false;

      // Displays the loading icon
      changeState("contentModal", <UploadLoader details={details} media={media} changeState={changeState} />);
    }
  };

  // Displays an error message with the missing fields
  displayMissingFields = (invalidList) => {
    const changeState = this.props.changeState;

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
        changeState={changeState}
      />;

    changeState("contentModal", content);
  };

  render() {
    const { content, location, alignment, result, video, comments, ...details } = this.state;
    const media = { location, alignment, result, video, comments };

    const handleChange = this.handleChange;
    const handleDetails = this.handleDetails;
    const handleMedia = this.handleMedia;
    const changeState = this.props.changeState;

    return (
      <Scroll>
        <div className="upload">
          <h2>Submit a Grenade</h2>
          <h4>* indicates required field</h4>
          {content === 0
            ? <Details
              {...details}
              handleChange={handleChange}
              handleSubmit={handleDetails}
              changeState={changeState}
            />
            : <Media
              {...media}
              handleChange={handleChange}
              handleSubmit={handleMedia}
              changeState={changeState}
            />
          }
        </div>
      </Scroll>
    );
  }
}


// The loading icon that is displayed when the form is submitted
class UploadLoader extends Component {
  constructor(props) {
    super(props);

    // The default state of the upload dialog
    this.state = { complete: false };
  }

  componentDidMount() {
    /* eslint-disable */
    // Initializes the progress bar
    const ldbar = new ldBar("#upload-ldbar", {
      "aspect-ratio": "none",
      "stroke": "data:ldbar/res,gradient(0,1,#f99,#ff9)"
    });
    /* eslint-enable */

    // The percentage of the progress bar designated for the details
    const detailsPercent = 10;

    ldbar.set(detailsPercent / 2);

    const { details, media } = this.props;
    const validate = functions.httpsCallable("submitDetails");

    // Validates the form data
    validate(details).then(result => {
      const nadeId = result.data.nadeId;
      const fileRef = storage.ref(`temp/${nadeId}`);
      const imageSets = ["location", "alignment", "result"];

      // Arrays hold the names and files that will be uploaded to storage
      const nameArray = [];
      const fileArray = [];
      const sizeArray = [];

      let totalBytes = 0;

      // Iterate through the image sets and get the names and files
      imageSets.forEach(imageSet => {
        const files = media[imageSet];

        // Generate the name for each file
        files.forEach((file, index) => {
          nameArray.push(`${imageSet}_${index}`);
          fileArray.push(file);
          sizeArray.push(0);
          totalBytes += file.size;
        });
      });

      // Checks if there is a video submitted
      if (media.video) {
        nameArray.push("demo");
        fileArray.push(media.video);
        sizeArray.push(0);
        totalBytes += media.video.size;
      }

      // Sets the value of the progress bar
      const setProgress = () => {
        const sumBytes = sizeArray.reduce((total, num) => total + num);
        const value = detailsPercent + ((sumBytes / totalBytes) * (100 - detailsPercent));

        ldbar.set(value);
      };

      // The details portion is completed
      setProgress();

      return Promise.all(
        nameArray.map((name, index) => {
          const upload = fileRef.child(name).put(fileArray[index]);

          // Observes the state changes of the upload task
          upload.on("state_changed", (snapshot) => {
            sizeArray[index] = snapshot.bytesTransferred;
            setProgress();
          });

          return upload;
        })
      );
    }).then((_) => {
      this.setState({ complete: true });
    }).catch(error => {
      console.log(error);
    });
  }

  // Prevents the loading modal from closing
  preventClose = (e) => {
    e.stopPropagation();
  };

  // Returns the user to the home page when the upload is complete
  handleReturn = () => {
    const changeState = this.props.changeState;
    changeState("contentMain", { type: "NadeList", state: null }, "/");
    changeState("contentModal", null);
  };

  render() {
    const complete = this.state.complete;
    const preventClose = this.preventClose;
    const handleReturn = this.handleReturn;
    let title, message, content;

    // Checks the state of the upload dialog
    if (complete) {
      title = "Submission Successful";
      message = <p>Thank you for submitting a grenade. Your submission will be<br />processed within 24 hours.</p>;
      content =
        <span style={{ display: "flex", flexDirection: "row-reverse" }}>
          <button type="button" onClick={handleReturn}>Return Home</button>
        </span>;
    }
    else {
      title = "Submitting Grenade";
      message = <p>Please wait while the data is processing and the files<br />are uploading.</p>;
      content = <div id="upload-ldbar" style={{ height: "40px", width: "380px" }} />;
    }

    return (
      <div className="upload-loader" onClick={preventClose}>
        <div className="upload-progress">
          <h3>{title}</h3>
          {message}
          {content}
        </div>
      </div>
    );
  }
}


export default Upload;
