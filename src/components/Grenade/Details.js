import React, { Component } from "react";
import firebase, { firestore } from "../../firebase";
import { MAPS, NADES } from "../../constants";
import { generateDocId, debounce } from "../../utility";
import { getUserCollections, getNadeConnections } from "../Query";

// Custom scroll bar library
import "../../lib/simplebar.min.css";
import SimpleBar from "../../lib/simplebar.min.js";

// React components
import Close from "../Modal/Close";
import Dialog from "../Modal/Dialog";
import Loader from "../Loader";
import Login from "../Modal/Login";
import Rating from "../Rating";
import { SvgNewFolder } from "../SvgIcons";


// The information section of the grenade content
function Details({ nadeData, currentUser, changeState }) {
  let components = null;

  // Checks if there is grenade data
  if (nadeData) {
    const {
      nade,
      map,
      location,
      movement,
      feature,
      rating,
      source,
      team,
      throw: thrw,
      tickrate,
      timestamp,
      viewmodel,
      views,
      vsettings
    } = nadeData;

    // The title for the header of the details section
    const nadeInfo = `${NADES[nade].title}\u00A0\u00A0|\u00A0\u00A0${MAPS[map].title}`;

    const tempDate = timestamp.toDate();
    const nadeDate = tempDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Opens the "Add to Collection" dialog for saving grenades
    const openCollList = () => {
      // The attributes for the dialog
      const attributes = { nadeData, currentUser, changeState };

      if (currentUser) changeState("contentModal", <CollListDialog {...attributes} />);
      else changeState("contentModal", <Login index={0} changeState={changeState} />);
    };

    // The information for the buttons on the details section
    const nadeBtnInfo = [
      {
        field: "add-to",
        label: "Add To",
        action: openCollList
      },
      {
        field: "share",
        label: "Share",
        action: () => { }
      },
      {
        field: "report",
        label: "Report",
        action: () => { }
      }
    ];

    // The button components displayed on the details section
    const nadeBtnList = nadeBtnInfo.map(btnInfo => {
      const { field, label, action } = btnInfo;
      const key = `grenade-details-buttons-${field}`;

      return (
        <button key={key} type="button" onClick={action}>
          {label}
        </button>
      );
    });

    const nadeMvmt = movement["100"] ? "Stationary" : (movement["001"] ? (movement["010"] ? "Run & Jump" : "Jump") : "Run/Walk");

    // Determines if a link should be displayed for the grenade source
    const hrefReg = /^http(s?):\/\//i;
    const hrefSrc = hrefReg.test(source);
    const tempSrc = hrefSrc && source.replace(hrefReg, "");
    const nadeSrc = hrefSrc ? <a href={source} title={tempSrc} target="_blank" rel="noopener noreferrer"><span>{tempSrc}</span></a> : source;

    // Dictionaries for converting the Firestore data
    const tickDict = { 1: "64 Tick", 2: "64 & 128 Tick", 3: "128 Tick" };
    const teamDict = { 1: "Counter-Terrorist", 2: "Terrorist & Counter-Terrorist", 3: "Terrorist" };
    const thrwDict = { 1: "Left Click", 2: "Right Click", 3: "Left & Right Click" };
    const viewDict = { 1: "Desktop", 2: "Couch", 3: "Classic" };
    const vsettingsDict = { 0: "N/A", 1: "Very Low", 2: "Low", 3: "Medium", 4: "High", 5: "Very High" };

    // Determines the input value from the query values
    const convertQueryValues = (values) => {
      if (values["01"] && values["10"]) return 2;
      if (values["01"]) return 3;
      if (values["10"]) return 1;
    };

    // The data for the grenade characteristics table
    const nadeCharData = [
      {
        field: "start-location",
        title: "Start Location",
        value: location.start
      },
      {
        field: "end-location",
        title: "End Location",
        value: location.end
      },
      {
        field: "movement",
        title: "Movement",
        value: nadeMvmt
      },
      {
        field: "tick-rate",
        title: "Tick Rate",
        value: tickDict[convertQueryValues(tickrate)]
      },
      {
        field: "throw-variation",
        title: "Throw Variation",
        value: thrwDict[thrw]
      },
      {
        field: "viewmodel",
        title: "Viewmodel",
        value: viewDict[viewmodel]
      },
      {
        field: "team",
        title: "Team",
        value: teamDict[convertQueryValues(team)]
      },
      {
        field: "features",
        title: "Features",
        value: feature.oneway && "One-way"
      },
      {
        field: "source",
        title: "Source",
        value: nadeSrc
      }
    ];

    // The data for the minimum video settings table
    const nadeVSetData = [
      {
        field: "global-shadow-quality",
        title: "Global Shadow Quality",
        value: vsettingsDict[vsettings.shadow]
      },
      {
        field: "model-texture-detail",
        title: "Model/Texture Detail",
        value: vsettingsDict[vsettings.texture]
      },
      {
        field: "effect-detail",
        title: "Effect Detail",
        value: vsettingsDict[vsettings.effect]
      },
      {
        field: "shader-detail",
        title: "Shader Detail",
        value: vsettingsDict[vsettings.shader]
      }
    ];

    // Builds the details section when there is grenade data
    components =
      <div>
        <h2>{nadeInfo}</h2>
        <p>{nadeDate}</p>
        <DetailsStats nadeData={{ rating, views }} userData={{ rating: 0 }} />
        <hr />
        <div className="grenade-details-buttons">
          {nadeBtnList}
        </div>
        <hr />
        <h3>Characteristics</h3>
        <DetailsTable tableData={nadeCharData} />
        <h3>Minimum Video Settings</h3>
        <DetailsTable tableData={nadeVSetData} />
      </div>;
  }

  return (
    <div className="grenade-details">
      {components}
    </div>
  );
}


// Displays the grenade statistics for the details section
class DetailsStats extends Component {
  constructor(props) {
    super(props);

    // The default state of the rating system
    this.state = {
      mouseover: false,
      overRating: 0,
      userRating: 0
    };
  }

  // TODO: Might need to check componentDidUpdate if nadeRating or userRating updates

  // Calculates the star rating on mouseover
  handleRating = (e) => {
    const currentRect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentNode.getBoundingClientRect();

    // The percentage of the container width at the cursor location
    const percRating = (parentRect.right - currentRect.right) / parentRect.width;

    // The star rating on mouseover
    const overRating = 100 - (percRating * 100);

    this.setState({ overRating });
  };

  render() {
    const { nadeData, userData } = this.props;
    const { mouseover, overRating, userRating } = this.state;
    const { average: avgRating, count: numRating } = nadeData.rating;
    const handleRating = this.handleRating;

    // Adds an -s to the end of plural nouns
    const grammarNumber = (num) => num === 1 ? "" : "s";

    let prevRating, tempRating = "You have not rated this grenade";

    // Checks if the user has rated the grenade
    if (userRating) tempRating = `You rated this ${userRating} star${grammarNumber(userRating)}`;
    else if (prevRating = userData.rating) tempRating = `You previously rated this ${prevRating} star${grammarNumber(prevRating)}`;

    const nadeRating = mouseover ? overRating : avgRating * 20;
    const textRating = mouseover ? tempRating : `${numRating} rating${grammarNumber(numRating)}`;

    const tempViews = nadeData.views + 1;
    const textViews = mouseover ? null : <span>{tempViews} view{grammarNumber(tempViews)}</span>

    // Star outlines to update the rating on mouseover
    const ratingOutline = [];
    for (let i = 0; i < 5; i++) {
      const key = `grenade-details-star-outline-${i}`;
      ratingOutline.push(<div key={key} onMouseEnter={handleRating}></div>);
    }

    return (
      <div className="grenade-details-stats">
        <div
          className="grenade-details-rating"
          onMouseEnter={() => this.setState({ mouseover: true })}
          onMouseLeave={() => this.setState({ mouseover: false })}
        >
          <Rating width={nadeRating} />
          {mouseover && <div className="rating-outline">{ratingOutline}</div>}
        </div>
        <span style={{ flexGrow: 1 }}>&nbsp;&nbsp;{textRating}</span>
        {textViews}
      </div>
    );
  }
}


// The dialog for saving grenades to collections
class CollListDialog extends Component {
  constructor(props) {
    super(props);

    // The default state of the dialog
    this.state = {
      collList: [],
      connList: {},
      loadList: true
    };
  }

  componentDidMount() {
    // Initializes the user data
    this.queryUserData();
  }

  componentDidUpdate(prevProps) {
    const prevUser = prevProps.currentUser;
    const nextUser = this.props.currentUser;

    // Checks if the user data needs to be updated
    if (prevUser !== nextUser) this.queryUserData();
  }

  // Prevents the modal from closing when the content is clicked
  preventClose = (e) => {
    e.stopPropagation();
  };

  // Performs the user data queries to Firestore
  queryUserData = async () => {
    const { nadeData, currentUser } = this.props;
    const loadList = false;

    // Resets the user data if there is no user or grenade
    if (!nadeData || !currentUser) return this.setState({ collList: [], connList: {}, loadList });

    const nadeId = nadeData.docId;
    const userId = currentUser.uid;

    // Performs the queries asynchronously
    const results = await Promise.all([
      getUserCollections(userId),
      getNadeConnections(userId, nadeId)
    ]);

    const collList = results[0];
    const connList = results[1];

    this.setState({ collList, connList, loadList });

    // Initializes the custom scroll bar
    new SimpleBar(document.getElementById("coll-list-simplebar"));
  };

  // Opens the "New Collection" dialog
  openDialog = () => {
    const { nadeData, currentUser, changeState } = this.props;
    const title = "New Collection";
    const message = "Collections allow you to group grenades together and share them. Enter a name for your new collection.";

    // Creates a new collection in Firestore
    const onSubmit = (input) => {
      // Checks if there is a user is signed in
      if (!currentUser) return null;

      const userId = currentUser.uid;
      const collId = generateDocId("LLNNNLLN");

      // References to the user's Firestore document and collections
      const userRef = firestore.doc(`users/${userId}`);
      const collRef = firestore.doc(`users/${userId}/collections/${collId}`);

      // The data for the Firestore document
      const collName = input.trim();
      const collTime = firebase.firestore.FieldValue.serverTimestamp();
      const collDoc = { name: collName, created: collTime, grenades: {}, modified: collTime, recent: "" };

      // Adds the new collection document in Firestore
      return collRef.set(collDoc).then((_) => {
        const userDoc = { collections: { [collId]: collName }, modified: collTime, recent: collId };

        // Updates the user's document with the new collection ID
        return userRef.set(userDoc, { merge: true }).then((_) => {
          // The attributes for the dialog
          const attributes = { nadeData, currentUser, changeState };

          // Reopens the "Add to Collection" dialog
          changeState("contentModal", <CollListDialog {...attributes} />);
        });
      }).catch(error => {
        console.log(error);
        return error;
      });
    };

    // The attributes for the dialog
    const attributes = { title, message, action: "Create", close: false, onSubmit, changeState };

    // Displays the dialog if there is a user signed in
    if (currentUser) changeState("contentModal", <Dialog {...attributes} />);
    else changeState("contentModal", <Login index={0} changeState={changeState} />);
  };

  render() {
    const { collList, connList, loadList } = this.state;
    const { nadeData, currentUser, changeState } = this.props;

    const preventClose = this.preventClose;
    const openDialog = this.openDialog;

    // The list of components to display in the dialog
    const listItems = [];

    // The custom checkbox component for selecting collections
    function ListItem({ id: collId, title }) {
      const checked = !!connList[collId];

      // Executes after the last event has stopped being invoked for 0.5 seconds
      const updateUserCollection = debounce((insert) => {
        // Checks for user and grenade data
        if (!nadeData || !currentUser) return null;

        const userId = currentUser.uid;
        const { docId: nadeId, id, nade, map, location, images } = nadeData;

        // Sentinel values used for writing to document fields
        const svrTime = firebase.firestore.FieldValue.serverTimestamp();
        const deleKey = firebase.firestore.FieldValue.delete();

        // References to the user's Firestore documents
        const collRef = firestore.doc(`users/${userId}/collections/${collId}`);
        const connRef = firestore.doc(`users/${userId}/connections/${nadeId}`);

        // The data for the Firestore documents
        const nadeDoc = { id, nade, map, location, thumbnail: images["thumb_small"], added: svrTime };
        const collMap = { [nadeId]: (insert ? nadeDoc : deleKey) };
        const connMap = { [collId]: (insert ? svrTime : deleKey) };

        const collDoc = { modified: svrTime, recent: nadeId, grenades: collMap };
        const connDoc = { modified: svrTime, recent: collId, collections: connMap };

        // Adds/removes the grenade to/from the collection document
        return collRef.set(collDoc, { merge: true }).then((_) => {
          // Updates the connection between the grenade and the collection
          return connRef.set(connDoc, { merge: true });
        }).catch(error => {
          console.log(error);
          return error;
        });
      }, 500);

      // Calls a debounce function to update the Firestore documents
      const handleChange = (e) => {
        const value = e.currentTarget.checked;
        updateUserCollection(value);
      };

      return (
        <li>
          <label>
            <input type="checkbox" defaultChecked={checked} onChange={handleChange} />
            <div />
            <span>{title}</span>
          </label>
        </li>
      );
    }

    // The default collections to display
    const defaultList = [
      { id: "favorites", title: "Favorites" },
      { id: "view-later", title: "View later" }
    ];

    // Builds the components for the default collections
    defaultList.forEach(item => {
      const key = `grenade-coll-list-${item.id}`;
      listItems.push(<ListItem key={key} {...item} />);
    });

    // Builds the components for the user collections
    collList.forEach(item => {
      const key = `grenade-coll-list-${item.id}`;
      listItems.push(<ListItem key={key} {...item} />);
    });

    // The loading icon when the collections are being queried
    const listLoader =
      <div className="grenade-coll-list-loader">
        <Loader size="medium" />
      </div>;

    return (
      <div className="grenade-coll-list" onMouseDown={preventClose}>
        <h3>Add to Collection</h3>
        <ul id="coll-list-simplebar">
          {loadList ? listLoader : listItems}
        </ul>
        <button className="grenade-coll-list-button" type="button" onClick={openDialog}>
          <div>
            <SvgNewFolder color="#bdbdbd" /><span>Create new collection</span>
          </div>
        </button>
        <Close changeState={changeState} />
      </div>
    );
  }
}


// Displays the table data for the details section
function DetailsTable({ tableData }) {
  // Builds the table rows from the data
  const tableRows = tableData.map(rowData => {
    const { field, title, value } = rowData;
    const key = `grenade-details-table-${field}`;

    // Ignores rows with false values
    if (!value) return null;

    return (
      <tr key={key}>
        <th>{title}</th>
        <td>{value}</td>
      </tr>
    );
  });

  return (
    <table>
      <tbody>
        {tableRows}
      </tbody>
    </table>
  );
}


export default Details;
