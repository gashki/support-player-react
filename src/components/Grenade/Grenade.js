import React, { Component } from "react";
import { firestore } from "../../firebase";
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
    // Initializes the nade data
    this.queryNadeData();
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

        // Sorts the nades by the date they were added to the collection
        const grenades = collData.grenades;
        const nadeKeys = Object.keys(grenades);
        const nadeSort = nadeKeys.map(docId => ({ docId, ...grenades[docId] }));
        nadeSort.sort((a, b) => a.added.toMillis() - b.added.toMillis());

        // Checks if there is a selected grenade
        nadeId = tempId || nadeSort[0].id;
      }).catch(error => {
        console.log(error);
      });
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
      // Sets the data for the grenade page
      this.setState({ nadeData, collData });
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    const { contentType, currentUser, changeState } = this.props;
    const { nadeData, collData } = this.state;

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
              {collContent && <Collection collData={collData} />}
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
