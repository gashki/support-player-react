import React, { Component } from "react";
import firebase, { firestore } from "../../firebase";

// React components
import { CollectionLink, CollectionButton } from "./Form";
import Dialog from "../Modal/Dialog";
import Login from "../Modal/Login";
import {
  SvgFavorite,
  SvgFolder,
  SvgNewFolder,
  SvgSchedule,
  SvgUpload
} from "../SvgIcons";


// The collections to display on the sidebar
class Collections extends Component {
  constructor(props) {
    super(props);

    // The default state of the collections
    this.state = {
      collList: [],
      showMore: false
    };
  }

  componentDidMount() {
    // Initializes the collections
    this.queryCollections();
  }

  componentDidUpdate(prevProps) {
    const prevUser = prevProps.currentUser;
    const nextUser = this.props.currentUser;

    // Checks if the collections need to be updated
    if (prevUser !== nextUser) this.queryCollections();
  }

  // Performs the collections query to Firestore
  queryCollections = () => {
    const currentUser = this.props.currentUser;

    // Resets the collections if there is no user
    if (!currentUser) return this.setState({ collList: [], showMore: false });

    const userUid = currentUser.uid;
    const userRef = firestore.doc(`users/${userUid}`);

    // Performs the Firestore query
    userRef.get().then(user => {
      if (!user.exists) return null;

      const collections = user.data().collections;
      if (!collections) return null;

      const collKeys = Object.keys(collections);
      const collList = collKeys.map(key => ({ id: key, title: collections[key] }));

      // Sorts the collections by the title
      collList.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        return (aTitle > bTitle) - (aTitle < bTitle);
      });

      this.setState({ collList });
    }).catch(error => {
      console.log(error);
    });
  };

  // Opens the "New Collection" dialog
  openDialog = () => {
    const { currentUser, changeState } = this.props;
    const collList = this.state.collList;
    const title = "New Collection";
    const message = "Collections allow you to group grenades together and share them. Enter the name of your new collection.";

    // Creates a new collection in Firestore
    const onSubmit = (input) => {
      // Checks if there is a user is signed in
      if (!currentUser) return null;

      // References to the user's Firestore document and collections
      const userUid = currentUser.uid;
      const userRef = firestore.doc(`users/${userUid}`);
      const collRef = firestore.collection(`users/${userUid}/collections`);

      // The data for the Firestore document
      const collName = input.trim();
      const collTime = firebase.firestore.FieldValue.serverTimestamp();
      const collection = { name: collName, created: collTime, modified: collTime };

      // Adds the new grenade collection document in Firestore
      collRef.add(collection).then(document => {
        const collId = document.id;
        const userDoc = { collections: { [collId]: collName }, modified: collTime, recent: collId };

        // Updates the user's document with the new collection ID
        return userRef.set(userDoc, { merge: true }).then((_) => {
          // Adds the new collection to the sidebar
          const collItem = { id: collId, title: collName };
          this.setState({ collList: [collItem, ...collList], showMore: true });
        });
      }).catch(error => {
        console.log(error);
        return error;
      });
    };

    // The attributes for the dialog
    const attributes = { title, message, action: "Create", onSubmit, changeState };

    // Displays the dialog if there is a user signed in
    if (currentUser) changeState("contentModal", <Dialog {...attributes} />);
    else changeState("contentModal", <Login index={0} changeState={changeState} />);
  };

  render() {
    const { collList, showMore } = this.state;
    const { currentUser, changeState } = this.props;
    const openDialog = this.openDialog;

    // The default collections to show on the sidebar
    const defaultItems = [
      {
        field: "favorites",
        title: "Favorites",
        svg: <SvgFavorite color="#f5f5f5" />
      },
      {
        field: "uploaded",
        title: "Uploaded",
        svg: <SvgUpload color="#f5f5f5" />
      },
      {
        field: "view-later",
        title: "View later",
        svg: <SvgSchedule color="#f5f5f5" />
      }
    ];

    // Builds the components for the default collections
    const defaultLinks = defaultItems.map(item => {
      const { field, title, svg } = item;
      const key = `collection-basic-${field}`;

      // Sets the href if there is a user logged in
      const href = currentUser ? `/collections/${field}` : "/login";

      // Sets the content when the default link is clicked
      const handleClick = () => {
        if (currentUser) {
          changeState("contentMain", { type: "Collection", state: field }, href);
        }
        else {
          changeState("contentModal", <Login index={0} changeState={changeState} />);
        }
      };

      // The attributes for the collection link
      const attributes = { key, svg, href, title, onClick: handleClick };

      return (
        <CollectionLink {...attributes} />
      );
    });

    // Builds the components for the user collections
    const userLinks = collList.map(item => {
      const { id, title } = item;
      const key = `collection-user-${id}`;
      const svg = <SvgFolder color="#f5f5f5" />;
      const href = `/collections/${id}`;

      // Opens the collection page
      const handleClick = () => {
        changeState("contentMain", { type: "Collection", state: id }, href);
      };

      // The attributes for the collection link
      const attributes = { key, svg, href, title, onClick: handleClick };

      return (
        <CollectionLink {...attributes} />
      );
    });

    // Determines if the "Show More" button should be shown
    const showColls = collList.length > 0;
    const showMoreText = showMore ? "Show Less" : "Show More";
    const showMoreToggle = () => this.setState({ showMore: !showMore });

    return (
      <div style={{ paddingBottom: "8px" }}>
        <ul className="sidebar-collections">
          {defaultLinks}
          <CollectionButton
            svg={<SvgNewFolder color="#f5f5f5" />}
            title="Create new collection"
            onClick={openDialog}
          />
          {showMore && userLinks}
        </ul>
        {showColls &&
          <button className="sidebar-collections-toggle" type="button" onClick={showMoreToggle}>
            {showMoreText}
          </button>
        }
      </div>
    );
  }
}

export default Collections;
