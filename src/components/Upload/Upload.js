import React, { Component } from "react";
import "./Upload.css";

// Components
import Details from "./Details";

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nade: "",
      map: "",
      movement: false,
      move: null,
      throw: null,
      tick: null,
      team: null,
      start: "",
      end: "",
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
    e.preventDefault();
  };

  render() {
    const nade = this.state.nade;
    const movement = this.state.movement;
    const handleChange = this.handleChange;
    const handleDetails = this.handleDetails;

    return (
      <div className="upload">
        <h2>Submit a Grenade</h2>
        <Details
          nade={nade}
          movement={movement}
          handleChange={handleChange}
          handleSubmit={handleDetails}
        />
      </div>
    );
  }
}

export default Upload;
