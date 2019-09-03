import React, { Component } from "react";
import { firestore } from "../../firebase";
import "./Grenade.css";

// React components
import Details from "./Details";
import Display from "./Display";
import Scroll from "../Scroll";


// The content for the individual grenade pages
class Grenade extends Component {
  constructor(props) {
    super(props);

    // The default state of the grenade page
    this.state = {
      nadeData: null
    };
  }

  componentDidMount() {
    const nadeId = this.props.contentState;
    const nadeRef = firestore.collection("nades").where("status", "==", "public").where("id", "==", nadeId).limit(1);

    // Performs the Firestore query
    nadeRef.get().then(snapshot => {
      if (snapshot.empty) return null;

      const nadeData = snapshot.docs[0].data();
      this.setState({ nadeData });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const nadeData = this.state.nadeData;

    return (
      <Scroll>
        <div className="grenade">
          <Display nadeData={nadeData} />
          <Details nadeData={nadeData} />
        </div>
      </Scroll>
    );
  }
}

export default Grenade;
