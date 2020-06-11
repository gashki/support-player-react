import React, { Component } from "react";
import firebase, { firestore } from "../firebase";
import { MAPS, NADES } from "../constants";
import { throttle } from "../utility";
import "./NadeCard.css";

// React components
import Loader from "./Loader";
import Login from "./Modal/Login";
import Rating from "./Rating";
import { SvgSchedule } from "./SvgIcons";
import Vertical from "./Vertical";


// The card used to display nades in the nade list
class NadeCard extends Component {
  constructor(props) {
    super(props);

    // The default state of the card
    this.state = { mouseover: false };
  }

  render() {
    const { nadeData, currentUser, changeState } = this.props;
    const mouseover = this.state.mouseover;

    const { id: nadeId, nade, map, team, views, timestamp } = nadeData;

    // The data for building the nade card
    const href = `/nades/${nadeId}`;
    const textViews = `${views} view${views === 1 ? "" : "s"}`;
    const textTime = getRelativeTime(timestamp.toMillis());

    let icon = NADES[nade].icon;

    // Determines the appropriate fire grenade icon
    if ("weapon_firegrenade" === nade) {
      const type = team["10"] ? "weapon_incgrenade" : "weapon_molotov";
      icon = icon[type];
    }

    // The storage URLs to the thumbnail and preview
    const thumbnail = nadeData["images"]["thumb_medium"];
    const preview = nadeData["videos"]["preview"];
    const showPreview = mouseover && preview;

    // Sets the content of the main page to the grenade
    const handleClick = (e) => {
      e.preventDefault();
      changeState("contentMain", { type: "Grenade", state: nadeId }, href);
    };

    // Adds a background color for previews that are not 16:9
    const handleVideo = (e) => {
      const videoElement = e.currentTarget;
      videoElement.style.backgroundColor = "#bdbdbd";
    };

    return (
      <li className="nade-card">
        <a
          className="nade-card-media unselectable"
          href={href}
          onClick={handleClick}
          onMouseEnter={() => this.setState({ mouseover: true })}
          onMouseLeave={() => this.setState({ mouseover: false })}
        >
          <img src={thumbnail} alt="Grenade thumbnail" />
          {showPreview && <div className="nade-card-loader"><Loader size="small" /></div>}
          {showPreview && <video src={preview} onCanPlay={handleVideo} autoPlay loop muted playsInline />}
          {mouseover &&
            <ScheduleButton
              nadeData={nadeData}
              currentUser={currentUser}
              changeState={changeState}
            />
          }
          {mouseover || <div className="nade-card-type">{icon}</div>}
          {mouseover || <span className="nade-card-map">{MAPS[map].title}</span>}
          <Vertical />
        </a>
        <div className="nade-card-details">
          <span>{textViews}&nbsp;&nbsp;&bull;&nbsp;&nbsp;{textTime}</span>
          <Rating width="20" />
        </div>
      </li>
    );
  }
}


// The button used for adding the nade to the "View later" collection
function ScheduleButton({ nadeData, currentUser, changeState }) {
  // Prevents additional calls from being invoked
  const throttleFunc = throttle(() => {
    // Checks for user and grenade data
    if (!nadeData || !currentUser) return null;

    const { docId: nadeId, id, nade, map, location, images } = nadeData;
    const userId = currentUser.uid;
    const collId = "view-later";

    // References to the user's Firestore documents
    const collRef = firestore.doc(`users/${userId}/collections/${collId}`);
    const connRef = firestore.doc(`users/${userId}/connections/${nadeId}`);

    // The data for the Firestore documents
    const svrTime = firebase.firestore.FieldValue.serverTimestamp();
    const nadeDoc = { id, nade, map, location, thumbnail: images["thumb_small"], added: svrTime };

    const collDoc = { modified: svrTime, recent: nadeId, grenades: { [nadeId]: nadeDoc } };
    const connDoc = { modified: svrTime, recent: collId, collections: { [collId]: svrTime } };

    // Adds the grenade to the collection document
    return collRef.set(collDoc, { merge: true }).then((_) => {
      // Updates the connection between the grenade and the collection
      return connRef.set(connDoc, { merge: true });
    }).catch(error => console.log(`${error.name} (${error.code}): ${error.message}`));
  }, 5000);

  // Adds the grenade to the "View later" collection
  const handleClick = (e) => {
    // Prevents the content from changing
    e.preventDefault();
    e.stopPropagation();

    // Updates the collection if there is a user signed in
    if (currentUser) throttleFunc();
    else changeState("contentModal", <Login index={0} changeState={changeState} />);
  };

  // The attributes for the schedule button
  const attributes = { title: "View later", type: "button", onClick: handleClick };

  return (
    <button className="nade-card-button" {...attributes}>
      <SvgSchedule color="#f5f5f5" />
    </button>
  );
}


// Determines the relative time since the nade submission
function getRelativeTime(timestamp) {
  // The number of milliseconds for each unit of time
  const msPerSec = 1000;
  const msPerMin = msPerSec * 60;
  const msPerHour = msPerMin * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMnth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  // The string representations for each unit of time
  const timeUnits = [
    { msec: msPerYear, unit: "year" },
    { msec: msPerMnth, unit: "month" },
    { msec: msPerWeek, unit: "week" },
    { msec: msPerDay, unit: "day" },
    { msec: msPerHour, unit: "hour" },
    { msec: msPerMin, unit: "minute" },
    { msec: msPerSec, unit: "second" }
  ];

  // The number of milliseconds since the nade submission
  const elapsed = Date.now() - timestamp;

  let tempNum, tempStr;

  for (const timeUnit of timeUnits) {
    tempNum = Math.floor(elapsed / timeUnit.msec);
    tempStr = timeUnit.unit;

    // Checks if the unit of time is correct
    if (tempNum > 0) break;
  }

  return `${tempNum} ${tempStr}${tempNum === 1 ? "" : "s"} ago`;
}


export default NadeCard;
