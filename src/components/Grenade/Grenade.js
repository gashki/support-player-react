import React, { Component } from "react";
import firebase, { firestore } from "../../firebase";
import { COLLECTIONS } from "../../constants";
import "./Grenade.css";

// React components
import Collection from "./Collection";
import Details from "./Details";
import Display from "./Display";
import Scroll from "../Scroll";


// The content for the individual grenade pages
class Grenade extends Component {
  constructor(props) {
    super(props);

    // The default state of the grenade page
    this.state = {
      nadeData: null,
      collData: null
    };
  }

  componentDidMount() {
    // Tracks the mounted status of the component
    this._isMounted = true;

    // Initializes the nade data
    this.queryNadeData();
  }

  componentDidUpdate(prevProps) {
    const prevNade = prevProps.contentState;
    const nextNade = this.props.contentState;

    // Checks if the nade data needs to be updated
    if (prevNade !== nextNade) this.queryNadeData();
  }

  componentWillUnmount() {
    // Prevents updates to unmounted components
    this._isMounted = false;
  }

  // Performs the nade data queries to Firestore
  queryNadeData = async () => {
    const { contentType, contentState, currentUser } = this.props;

    let nadeData = null;
    let collData = null;
    let nadeId = "";

    const queries = [];

    // Checks if the content to display is a collection
    if (/^(Collection|Permalink)$/.test(contentType)) {
      let collRef = null;

      // Parses the content state of the collection
      const collState = contentState.split("#");
      const collId = collState[0];
      const tempId = collState[1];

      // Determines the type of collection
      const isDflt = !!COLLECTIONS[collId];
      const isPerm = "Permalink" === contentType;

      if (isPerm) {
        collRef = firestore.collectionGroup("collections").where("permalink", "==", collId).limit(1);
      }
      else {
        // Checks for user data
        if (!currentUser) return null;

        const userId = currentUser.uid;
        collRef = firestore.doc(`users/${userId}/collections/${collId}`);
      }

      // Performs a Firestore query to get the collection data
      await collRef.get().then(result => {
        let document = null;

        if (isPerm) {
          if (result.empty) return null;
          document = result.docs[0];
        }
        else {
          if (!result.exists) return null;
          document = result;
        }

        collData = document.data();
        collData.docId = document.id;

        collData.isDflt = isDflt;
        collData.isPerm = isPerm;

        // Adds a collection name for default collections
        if (isDflt) collData.name = COLLECTIONS[collId].title;

        // Sorts the nades by the date they were added to the collection
        const grenades = collData.grenades;
        const nadeKeys = Object.keys(grenades);
        const nadeSort = nadeKeys.map(docId => ({ docId, ...grenades[docId] }));
        nadeSort.sort((a, b) => a.added.toMillis() - b.added.toMillis());

        // Checks if there is a selected grenade
        nadeId = tempId || (nadeSort.length ? nadeSort[0].id : "");
      }).catch(error => console.log(`${error.name} (${error.code}): ${error.message}`));
    }
    else nadeId = contentState;

    queries.push(firestore.collection("nades").where("status", "==", "public").where("id", "==", nadeId).limit(1));
    if (currentUser) queries.push(firestore.doc(`users/${currentUser.uid}/collections/ratings`));

    // Performs Firestore queries to get the grenade and user data
    return Promise.all(queries.map(query => query.get())).then(results => {
      const nadeResult = results[0];
      const userResult = results[1];

      if (nadeResult.empty) return null;

      nadeData = nadeResult.docs[0].data();
      nadeData.docId = nadeResult.docs[0].id;

      nadeData.rating.user = 0;

      let ratingCnt = 0;
      let ratingSum = 0;

      // Calculates the rating count and average for the grenade
      for (let i = 1; i <= 5; i++) {
        const tempStar = `${i}-star`;
        const tempCount = nadeData.rating.counts[tempStar];

        ratingCnt += tempCount;
        ratingSum += tempCount * i;
      }

      nadeData.rating.count = ratingCnt;
      nadeData.rating.average = ratingCnt && ratingSum / ratingCnt;

      // Gets the user's previous rating for the grenade
      if (currentUser && userResult.exists) {
        const nadeRate = userResult.data().grenades[nadeData.docId];
        if (nadeRate) nadeData.rating.user = nadeRate.rating;
      }
    }).then((_) => {
      if (!this._isMounted) return null;

      // Sets the data for the grenade page
      this.setState({ nadeData, collData });

      // Checks for grenade data
      if (!nadeData) return null;

      // The data for the Firestore documents
      const svrTime = firebase.firestore.FieldValue.serverTimestamp();
      const nadeRef = firestore.doc(`nades/${nadeData.docId}`);
      const nadeDoc = { views: nadeData.views + 1, modified: svrTime };

      // Updates the view count for the grenade
      return nadeRef.update(nadeDoc);
    }).catch(error => console.log(`${error.name} (${error.code}): ${error.message}`));
  };

  render() {
    const { contentType, currentUser, changeState } = this.props;
    const { nadeData, collData } = this.state;

    // Sets the active nade for the collection
    if (nadeData && collData) collData.activeId = nadeData.docId;

    const collContent = /^(Collection|Permalink)$/.test(contentType);
    const grenadeTabs = [
      <input key="GrenadeTab-input-collection" id="grenade-radio-collection" name="grenade-tab" type="radio" defaultChecked={true} />,
      <label key="GrenadeTab-label-collection" className="grenade-tab unselectable" htmlFor="grenade-radio-collection">Collection</label>,
      <input key="GrenadeTab-input-details" id="grenade-radio-details" name="grenade-tab" type="radio" defaultChecked={false} />,
      <label key="GrenadeTab-label-details" className="grenade-tab unselectable" htmlFor="grenade-radio-details">Details</label>
    ];

    return (
      <Scroll>
        <div className="grenade">
          <Display nadeData={nadeData} changeState={changeState} />
          <div className="grenade-sidebar">
            <div className="grenade-sidebar-inner">
              {collContent && grenadeTabs}
              {collContent &&
                <Collection
                  collData={collData}
                  currentUser={currentUser}
                  changeState={changeState}
                />
              }
              <Details
                nadeData={nadeData}
                currentUser={currentUser}
                changeState={changeState}
              />
            </div>
          </div>
        </div>
      </Scroll>
    );
  }
}

export default Grenade;
