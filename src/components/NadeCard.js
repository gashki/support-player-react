import React, { Component } from "react";
import { MAPS, NADES } from "../constants";
import "./NadeCard.css";

// React components
import Loader from "./Loader";
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
    const changeState = this.props.changeState;

    // The data for the nade card
    const nadeData = this.props.nadeData;
    const nadeId = nadeData.id;

    const timestamp = nadeData.timestamp.toMillis();
    const relativeTime = getRelativeTime(timestamp);

    const views = nadeData.views;
    const viewCount = `${views} view${views === 1 ? "" : "s"}`;

    const map = MAPS[nadeData.map]["title"];
    const nade = nadeData.nade;
    const team = nadeData.team;

    let icon = NADES[nade]["icon"];

    // Determines the appropriate fire grenade icon
    if ("weapon_firegrenade" === nade) {
      const type = team["10"] ? "weapon_incgrenade" : "weapon_molotov";
      icon = icon[type];
    }

    const thumbnail = nadeData["images"]["thumb_medium"];
    const preview = nadeData["videos"]["preview"];

    const mouseover = this.state.mouseover;
    const showPreview = mouseover && preview;

    // Sets the content of the main page to the grenade
    const handleClick = (e) => {
      e.preventDefault();
      changeState("contentMain", { type: "Grenade", state: nadeId }, `/nades/${nadeId}`);
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
          href={`/nades/${nadeId}`}
          onClick={handleClick}
          onMouseEnter={() => this.setState({ mouseover: true })}
          onMouseLeave={() => this.setState({ mouseover: false })}
        >
          <img src={thumbnail} alt="Grenade thumbnail" />
          {showPreview && <div className="nade-card-loader"><Loader size="small" /></div>}
          {showPreview && <video src={preview} onCanPlay={handleVideo} autoPlay loop muted playsInline />}
          {mouseover && <ScheduleButton />}
          {mouseover || <div className="nade-card-type">{icon}</div>}
          {mouseover || <span className="nade-card-map">{map}</span>}
          <Vertical />
        </a>
        <div className="nade-card-details">
          <span>{viewCount}&nbsp;&nbsp;&bull;&nbsp;&nbsp;{relativeTime}</span>
          <Rating width="20" />
        </div>
      </li>
    );
  }
}


// The button used for adding the nade to the "View later" collection
function ScheduleButton() {
  const handleClick = (e) => {
    //TODO: FIX COMMENT; prevents a link from opening
    e.preventDefault();
    //TODO: FIX COMMENT; prevents card from changing content
    e.stopPropagation();
    console.log("schedule button clicked");
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
