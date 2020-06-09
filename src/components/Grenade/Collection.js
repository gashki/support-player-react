import React, { Component } from "react";
import firebase, { firestore } from "../../firebase";
import { MAPS, NADES } from "../../constants";
import { throttle } from "../../utility";
import "./Collection.css";

// Custom scroll bar library
import "../../lib/simplebar.min.css";
import SimpleBar from "../../lib/simplebar.min.js";

// React components
import Dialog from "../Modal/Dialog";
import Login from "../Modal/Login";
import { SvgClose, SvgDelete, SvgEdit, SvgLink } from "../SvgIcons";


// The content for the user collection
class Collection extends Component {
  constructor(props) {
    super(props);

    // The default state of the collection
    this.state = {
      collInfo: null,
      nadeList: null
    };
  }

  componentDidMount() {
    // Initializes the collection data
    this.setCollectionData();

    // Initializes the custom scroll bar
    new SimpleBar(document.getElementById("grenade-collection-simplebar"));
  }

  componentDidUpdate(prevProps) {
    const prevColl = prevProps.collData;
    const nextColl = this.props.collData;

    // Checks if the collection data needs to be updated
    if (prevColl !== nextColl) this.setCollectionData();
  }

  // Builds the collection components and sets the state
  setCollectionData = () => {
    const { collData, changeState } = this.props;
    const openRenameDialog = this.openRenameDialog;
    const openDeleteDialog = this.openDeleteDialog;

    let collInfo = null;
    let nadeList = null;

    // Checks if there is collection data
    if (collData) {
      const { docId: collId, name, grenades, activeId, modified } = collData;

      const tempDate = modified.toDate();
      const nadeDate = tempDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      const textDate = `Last updated on ${nadeDate}`;

      // Builds the header section when there is collection data
      collInfo =
        <div className="collection-info">
          <div className="collection-title">
            <h2 title={name}>{name}</h2>
            <div>
              <button title="Rename collection" onClick={openRenameDialog}>
                <SvgEdit color="#bdbdbd" />
              </button>
            </div>
            <div>
              <button title="Delete collection" onClick={openDeleteDialog}>
                <SvgDelete color="#bdbdbd" />
              </button>
            </div>
          </div>
          <span>{textDate}</span>
          <div className="permalink">
            <div className="permalink-icon">
              <SvgLink color="#2f2f2f" />
            </div>
            <input
              type="text"
              value="http://localhost:3000/collections/lT218Td5"
              onClick={(e) => e.currentTarget.select()}
              readOnly
            />
          </div>
        </div>;

      // Sorts the nades by the date they were added to the collection
      const nadeKeys = Object.keys(grenades);
      const nadeSort = nadeKeys.map(docId => ({ docId, ...grenades[docId] }));
      nadeSort.sort((a, b) => a.added.toMillis() - b.added.toMillis());

      // The list of collection nade cards
      nadeList =
        nadeSort.map((nade, index) => {
          const nadeId = nade.docId;
          const active = nadeId === activeId;

          // Prevents additional calls from being invoked
          const throttleFunc = throttle(() => this.handleRemove(nadeId), 5000);

          // Removes the collection card and updates Firestore
          const handleRemove = (e) => {
            // Prevents the content from changing
            e.preventDefault();
            e.stopPropagation();

            throttleFunc();
          };

          return (
            <CollectionCard
              key={nadeId}
              collId={collId}
              active={active}
              nadeData={nade}
              handleRemove={handleRemove}
              changeState={changeState}
            />
          );
        });
    }

    // Sets the content for the collection components
    this.setState({ collInfo, nadeList });
  };

  // Removes the grenade from the collection
  handleRemove = (nadeId) => {
    const { collData, currentUser } = this.props;
    const nadeList = this.state.nadeList;

    // Checks for user and collection data
    if (!collData || !currentUser) return null;

    const userId = currentUser.uid;
    const collId = collData.docId;

    // Sentinel values used for writing to document fields
    const svrTime = firebase.firestore.FieldValue.serverTimestamp();
    const deleKey = firebase.firestore.FieldValue.delete();

    // References to the user's Firestore documents
    const collRef = firestore.doc(`users/${userId}/collections/${collId}`);
    const connRef = firestore.doc(`users/${userId}/connections/${nadeId}`);

    // The data for the Firestore documents
    const collDoc = { modified: svrTime, recent: nadeId, grenades: { [nadeId]: deleKey } };
    const connDoc = { modified: svrTime, recent: collId, collections: { [collId]: deleKey } };

    // Removes the grenade from the collection document
    return collRef.set(collDoc, { merge: true }).then((_) => {
      // Updates the connection between the grenade and the collection
      return connRef.set(connDoc, { merge: true });
    }).then((_) => {
      // Removes the collection card from the nade list
      const tempList = nadeList.filter(nadeData => nadeId !== nadeData.key);
      this.setState({ nadeList: tempList });
    }).catch(error => console.log(`${error.name} (${error.code}): ${error.message}`));
  };

  // Opens the "Rename Collection" dialog
  openRenameDialog = () => {
    const { collData, currentUser, changeState } = this.props;
    const title = "Rename Collection";
    const message = "Collections allow you to group grenades together and share them. Enter a new name for your collection.";

    // Updates the collection in Firestore
    const onSubmit = (input) => {
      // Checks if there is a user is signed in
      if (!currentUser) return null;

      const userId = currentUser.uid;
      const collId = collData.docId;

      // References to the user's Firestore document and collections
      const userRef = firestore.doc(`users/${userId}`);
      const collRef = firestore.doc(`users/${userId}/collections/${collId}`);

      // The data for the Firestore document
      const collName = input.trim();
      const collTime = firebase.firestore.FieldValue.serverTimestamp();

      const collDoc = { name: collName, modified: collTime };
      const userDoc = { collections: { [collId]: collName }, modified: collTime, recent: collId };

      // Checks for valid input for the collection name
      if (collName === collData.name) return changeState("contentModal", null);

      // Updates the name of the collection in the collection document
      return collRef.set(collDoc, { merge: true }).then((_) => {
        // Updates the name of the collection in the user document
        return userRef.set(userDoc, { merge: true }).then((_) => {
          // The ID for the active nade of the collection
          const nadeId = collData.activeId.split("-")[1];

          // Forces a requery of the collection data
          changeState("contentMain", { type: "Collection", state: `${collId}#${nadeId}#${collName}` });
        });
      }).catch(error => error);
    };

    // The attributes for the dialog
    const attributes = { title, message, action: "Update", onSubmit, changeState };

    // Displays the dialog if there is a user signed in
    if (currentUser) changeState("contentModal", <Dialog {...attributes} />);
    else changeState("contentModal", <Login index={0} changeState={changeState} />);
  };

  openDeleteDialog = () => {

  };

  render() {
    const { collInfo, nadeList } = this.state;

    return (
      <div className="grenade-collection">
        {collInfo}
        <div id="grenade-collection-simplebar">
          <ul className="collection-nade-list">
            {nadeList}
          </ul>
        </div>
      </div>
    );
  }
}


// The card used to display nades in the collection
function CollectionCard(props) {
  const { collId, active, nadeData, handleRemove, changeState } = props;
  const { id: nadeId, nade, map, location, thumbnail } = nadeData;

  const collState = `${collId}#${nadeId}`;
  const href = `/collections/${collState}`;

  // Sets the grenade to display in the collection
  const handleClick = (e) => {
    e.preventDefault();
    changeState("contentMain", { type: "Collection", state: collState }, href);
  };

  // The attributes for the remove button
  const attributes = { title: "Remove from collection", type: "button", onClick: handleRemove };

  return (
    <li>
      <a className="collection-card" href={href} onClick={handleClick}>
        <div className="collection-card-media">
          <img src={thumbnail} />
        </div>
        <div className="collection-card-details">
          <span>{NADES[nade].title}</span>
          <span>{MAPS[map].title}</span>
          <span>{`${location.start} to ${location.end}`}</span>
        </div>
        <button className="collection-card-remove" {...attributes}>
          <SvgClose color="#bdbdbd" />
        </button>
        {active && <span className="collection-card-active"></span>}
      </a>
    </li>
  );
}


export default Collection;
