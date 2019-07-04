import React, { Component } from "react";
import { firestore } from "../firebase";
import { buildSearchQuery } from "./Query";
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
    // Initializes the nade list
    this.queryNadeList();
  }

  componentDidUpdate(prevProps) {
    const prevSearchParam = prevProps.contentState;
    const nextSearchParam = this.props.contentState;

    // Checks if the nade list needs to be updated
    if (prevSearchParam !== nextSearchParam) this.queryNadeList();
  }

  // Performs the nade list query to Firestore
  queryNadeList = () => {
    const nadeList = [];
    const searchParam = this.props.contentState;

    // Builds the Firestore query from the search parameter
    const nadeListRef = buildSearchQuery(searchParam);

    // TODO: ADD LIMIT AND ORDER
    // TODO: ADD SECURITY RULES

    // Performs the Firestore query
    nadeListRef.get().then(snapshot => {
      // Builds the nade list
      snapshot.forEach(nade => {
        const id = `nade-${nade.id}`;
        nadeList.push(<NadeCard key={id} nade={nade} />);
      });

      this.setState({ nadeList });
    }).catch(error => {
      console.log(error);
    });
  };

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
          {blankList}
        </ul>
      </Scroll>
    );
  }
}

export default NadeList;
