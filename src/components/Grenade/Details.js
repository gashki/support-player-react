import React from "react";
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

    const nadeInfo = `${NADES[nade].title}\u00A0\u00A0|\u00A0\u00A0${MAPS[map].title}`;

    const tempDate = timestamp.toDate();
    const nadeDate = tempDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // The information for the buttons on the details section
    const nadeBtnInfo = [
      {
        field: "favorite",
        label: "Favorite"
      },
      {
        field: "add-to",
        label: "Add To"
      },
      {
        field: "report",
        label: "Report"
      }
    ];

    // The button components displayed on the details section
    const nadeBtnList = nadeBtnInfo.map(btnInfo => {
      const field = btnInfo.field;
      const label = btnInfo.label;
      const key = `grenade-details-buttons-${field}`;

      return (
        <button key={key} type="button">
          {label}
        </button>
      );
    });

    const nadeMvmt = movement["100"] ? "Stationary" : (movement["001"] ? (movement["010"] ? "Run & Jump" : "Jump") : "Run/Walk");

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
        field: "source",
        title: "Source",
        value: source
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

    // TODO: Add views to the right of ratings
    // TODO: Add hyperlinks for sources
    // TODO: Add "One-way" to characteristics table

    // Builds the details section when there is grenade data
    components =
      <div>
        <h2>{nadeInfo}</h2>
        <p>{nadeDate}</p>
        <div className="grenade-details-ratings">
          <Rating width="80" />
          <span>&nbsp;&nbsp;0 ratings</span>
        </div>
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
