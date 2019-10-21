import React, { Component } from "react";
import { MAPS, NADES } from "../../constants";

// React components
import Rating from "../Rating";


// The information section of the grenade content
function Details({ nadeData }) {
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

    // The information for the buttons on the details section
    const nadeBtnInfo = [
      {
        field: "add-to",
        label: "Add To"
      },
      {
        field: "share",
        label: "Share"
      },
      {
        field: "report",
        label: "Report"
      }
    ];

    // The button components displayed on the details section
    const nadeBtnList = nadeBtnInfo.map(btnInfo => {
      const { field, label } = btnInfo;
      const key = `grenade-details-buttons-${field}`;

      return (
        <button key={key} type="button">
          {label}
        </button>
      );
    });

    const nadeMvmt = movement["100"] ? "Stationary" : (movement["001"] ? (movement["010"] ? "Run & Jump" : "Jump") : "Run/Walk");

    // Determines if a link should be displayed for the grenade source
    const hrefSrc = /^http(s?):\/\//i.test(source);
    const tempSrc = hrefSrc && source.replace(/^http(s?):\/\//i, "");
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
    <div className="grenade-details border-box">
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
