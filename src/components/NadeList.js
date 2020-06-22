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
      initLoad: true,
      loadMore: false
    };
  }

  componentDidMount() {
    // Tracks the mounted status of the component
    this._isMounted = true;

    // Initializes the nade list
    this.queryNadeList();
  }

  componentDidUpdate(prevProps) {
    const prevSearchParam = prevProps.contentState;
    const nextSearchParam = this.props.contentState;

    // Checks if the nade list needs to be updated
    if (prevSearchParam !== nextSearchParam) this.queryNadeList();
  }

  componentWillUnmount() {
    // Prevents updates to unmounted components
    this._isMounted = false;
  }

  // Performs the nade list query to Firestore
  queryNadeList = (startAfter) => {
    const tempList = [];
    const initLoad = false;
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

      if (this._isMounted) this.setState({ nadeList, initLoad, loadMore });
    }).catch(error => console.log(`${error.name} (${error.code}): ${error.message}`));
  };

  render() {
    const { currentUser, changeState } = this.props;
    const { nadeList, initLoad, loadMore } = this.state;

    // The list of nade cards
    const cardList =
      nadeList.map(nade => {
        const nadeData = nade.data();
        nadeData.docId = nade.id;

        return (
          <NadeCard
            key={nadeData.docId}
            nadeData={nadeData}
            currentUser={currentUser}
            changeState={changeState}
          />
        );
      });

    // Blank cards for the initial load
    if (initLoad) {
      for (let i = 0; i < NADE_LIMIT; i++) {
        cardList.push(<li key={`load-nade-${i}`} className="nade-card"></li>);
      }
    }

    // Extra cards to fill the nade list
    if (cardList.length) {
      for (let i = 0; i < 4; i++) {
        cardList.push(<li key={`fill-nade-${i}`} className="nade-card-fill"></li>);
      }
    }

    // Queries more nades to add to the nade list
    const handleClick = () => {
      const listLength = nadeList.length;
      const lastNadeId = nadeList[listLength - 1].id;

      this.queryNadeList(lastNadeId);
    };

    const emptyList = !initLoad && !cardList.length;

    // The component for displaying the nade list
    const nadeCards =
      <ul className="nade-list">
        {cardList}
        {loadMore &&
          <button className="load-more-button" type="button" onClick={handleClick}>
            {"Load More"}
          </button>
        }
      </ul>;

    // Displays a message if the nade list is empty
    const noResults =
      <div className="nade-list-none">
        <div></div>
        <span>No results found</span>
        <div></div>
        <div></div>
      </div>;

    return (
      <Scroll>
        {emptyList ? noResults : nadeCards}
      </Scroll>
    );
  }
}

export default NadeList;
