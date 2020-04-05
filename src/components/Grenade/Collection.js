import React, { Component } from "react";
import { MAPS, NADES } from "../../constants";
import "./Collection.css";

// Custom scroll bar library
import "../../lib/simplebar.min.css";
import SimpleBar from "../../lib/simplebar.min.js";

// React components
import { SvgClose, SvgDelete, SvgEdit, SvgLink } from "../SvgIcons";


// The content for the user collection
class Collection extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Initializes the custom scroll bar
    new SimpleBar(document.getElementById("grenade-collection-simplebar"));
  }

  render() {
    const { collData, changeState } = this.props;

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
            <h2>{name}</h2>
            <div>
              <SvgEdit color="#bdbdbd" />
            </div>
            <div>
              <SvgDelete color="#bdbdbd" />
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
        nadeSort.map(nade => {
          const nadeId = nade.docId;
          const active = nadeId === activeId;

          return (
            <CollectionCard
              key={nadeId}
              collId={collId}
              active={active}
              nadeData={nade}
              changeState={changeState}
            />
          );
        });
    }

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
function CollectionCard({ collId, active, nadeData, changeState }) {
  const { id: nadeId, nade, map, location, thumbnail } = nadeData;

  const collState = `${collId}#${nadeId}`;
  const href = `/collections/${collState}`;

  // Sets the grenade to display in the collection
  const handleClick = (e) => {
    e.preventDefault();
    changeState("contentMain", { type: "Collection", state: collState }, href);
  };

  // Removes the grenade from the collection
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
