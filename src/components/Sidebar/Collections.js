import React, { Component } from "react";
import { firestore } from "../../firebase";

// React components
import {
  SvgAddBox,
  SvgFavorite,
  SvgList,
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
      collList.sort((a, b) => (a.title > b.title) - (a.title < b.title));

      this.setState({ collList });
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    const { collList, showMore } = this.state;
    const { currentUser, changeState } = this.props;

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

      // The attributes for the collection link
      const attributes = { key, svg, href, title };

      return (
        <CollectionLink {...attributes} />
      );
    });

    // Builds the components for the user collections
    const userLinks = collList.map(item => {
      const { id, title } = item;
      const key = `collection-user-${id}`;
      const svg = <SvgList color="#f5f5f5" />;
      const href = `/collections/${id}`;

      // The attributes for the collection link
      const attributes = { key, svg, href, title };

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
          <CollectionButton svg={<SvgAddBox color="#f5f5f5" />} title="Create new collection" />
          {showMore && userLinks}
        </ul>
        {showColls &&
          <button className="sidebar-collections-toggle" onClick={showMoreToggle}>
            {showMoreText}
          </button>
        }
      </div>
    );
  }
}


// The component for the collection list links
function CollectionLink({ svg, href, title }) {
  const attributes = { href, title };

  return (
    <li>
      <a className="sidebar-collections-item" {...attributes}>{svg}{title}</a>
    </li>
  );
}


// The component for the collection list buttons
function CollectionButton({ svg, title }) {
  return (
    <li>
      <button title={title}>
        <div className="sidebar-collections-item">{svg}{title}</div>
      </button>
    </li>
  );
}


export default Collections;
