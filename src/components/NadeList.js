import React, { Component } from "react";
import { NADE_LIMIT } from "../constants";
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
      nadeList: [],
      loadMore: false
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
  queryNadeList = (startAfter) => {
    const tempList = [];
    const searchParam = this.props.contentState;

    // Builds the Firestore query from the search parameter
    let nadeListRef = buildSearchQuery(searchParam);

    // Checks if there is a start point for the query
    if (startAfter) nadeListRef = nadeListRef.startAfter(startAfter);

    // Performs the Firestore query
    nadeListRef.get().then(snapshot => {
      // Builds the nade list
      snapshot.forEach(nade => tempList.push(nade));

      // Concatenates the nade list if there is a starting point
      const nadeList = startAfter ? [...this.state.nadeList, ...tempList] : tempList;

      // Determines if the "Load More" button should be shown
      const loadMore = !!(searchParam && tempList.length === NADE_LIMIT);

      this.setState({ nadeList, loadMore });
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    const changeState = this.props.changeState;
    const nadeList = this.state.nadeList;
    const loadMore = this.state.loadMore;

    // The list of nade cards
    const nadeCards =
      nadeList.map(nade => <NadeCard key={nade.id} nadeData={nade.data()} changeState={changeState} />);

    // Does not work in Internet Explorer
    //const blankList = new Array(4).fill(<li className="nade-card-blank"></li>);

    // Blank cards to fill the nade list
    const blankList = [];
    for (let i = 0; i < 4; i++) {
      blankList.push(<li key={`blank-nade-${i}`} className="nade-card-blank"></li>);
    }

    // Queries more nades to add to the nade list
    const handleClick = () => {
      const listLength = nadeList.length;
      const lastNadeId = nadeList[listLength - 1].id;

      this.queryNadeList(lastNadeId);
    };

    return (
      <Scroll>
        <ul className="nade-list">
          {nadeCards}
          {blankList}
          {loadMore &&
            <button className="load-more-button" type="button" onClick={handleClick}>
              {"Load More"}
            </button>
          }
        </ul>
      </Scroll>
    );
  }
}

export default NadeList;
