import React, { Component } from "react";
import { firestore } from "../firebase";
import "./NadeList.css";

// React components
import NadeCard from "./NadeCard";
import Scroll from "./Scroll";


// The list of nades for the main page
class NadeList extends Component {
  constructor(props) {
    super(props);

    // The default state of the nade list
    this.state = {
      nadeList: []
    };
  }

  componentDidMount() {
    const nadeList = [];
    const nadeListRef = firestore.collection("nades").where("status", "==", "public");

    nadeListRef.get().then(snapshot => {
      if (snapshot.empty) return null;

      snapshot.forEach(nade => {
        const id = `nade-${nade.id}`;
        nadeList.push(<NadeCard key={id} nade={nade} />);
      });

      this.setState({ nadeList });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const nadeList = this.state.nadeList;

    // Does not work in Internet Explorer
    //const blankList = new Array(4).fill(<li className="nade-card-blank"></li>);

    const blankList = [];
    for (let i = 0; i < 4; i++) {
      blankList.push(<li key={`blank-nade-${i}`} className="nade-card-blank"></li>);
    }

    return (
      <Scroll>
        <ul className="nade-list">
          {nadeList}
          {nadeList}
          {nadeList}
          {nadeList}
          {nadeList}
          {nadeList}
          {blankList}
        </ul>
      </Scroll>
    );
  }
}

export default NadeList;
