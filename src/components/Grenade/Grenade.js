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

    // Checks if the content to display is a collection
    if (/^(Collection|Permalink)$/.test(contentType)) {
      const userId = currentUser.uid;

      // Parses the content state of the collection
      const collState = contentState.split("#");
      const collId = collState[0];
      const tempId = collState[1];

      const collRef = firestore.doc(`users/${userId}/collections/${collId}`);

      // Performs a Firestore query to get the collection data
      await collRef.get().then(collection => {
        if (!collection.exists) return null;

        collData = collection.data();
        collData.docId = collection.id;

        // Adds a collection name for default collections
        if (COLLECTIONS[collId]) collData.name = COLLECTIONS[collId].title;

        // Sorts the nades by the date they were added to the collection
        const grenades = collData.grenades;
        const nadeKeys = Object.keys(grenades);
        const nadeSort = nadeKeys.map(docId => ({ docId, ...grenades[docId] }));
        nadeSort.sort((a, b) => a.added.toMillis() - b.added.toMillis());

        // Checks if there is a selected grenade
        nadeId = tempId || (nadeSort.length ? nadeSort[0].id : "");
      }).catch(error => console.log(`${error.name} (${error.code}): ${error.message}`));
    }
    else {
      nadeId = contentState;
    }

    const nadeRef = firestore.collection("nades").where("status", "==", "public").where("id", "==", nadeId).limit(1);

    // Performs a Firestore query to get the grenade data
    return nadeRef.get().then(snapshot => {
      if (snapshot.empty) return null;

      nadeData = snapshot.docs[0].data();
      nadeData.docId = snapshot.docs[0].id;
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
          <Display nadeData={nadeData} />
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
