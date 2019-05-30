import React from "react";

// React components
import {
  UploadSelect,
  UploadInput,
  UploadRadio,
  UploadSwitch,
  UploadSubmit
} from "./Form";


// The details form of the upload page
function Details(props) {
  const {
    nade,
    map,
    start,
    end,
    movement,
    viewmodel,
    vsettings,
    move,
    tick,
    thrw,
    team,
    view,
    source,
    oneway,
    shadow,
    texture,
    effect,
    shader
  } = props;

  const handleChange = props.handleChange;
  const handleSubmit = props.handleSubmit;
  const changeState = props.changeState;


  // The options for the type of grenade
  const nades = [
    { value: "", title: "Select a Grenade" },
    { value: "weapon_smokegrenade", title: "Smoke Grenade" },
    { value: "weapon_firegrenade", title: "Incendiary/Molotov" },
    //{ value: "weapon_molotov", title: "Molotov Cocktail" },
    //{ value: "weapon_incgrenade", title: "Incendiary Grenade" },
    { value: "weapon_flashbang", title: "Flashbang" },
    { value: "weapon_hegrenade", title: "HE Grenade" },
    //{ value: "weapon_decoy", title: "Decoy Grenade" }
  ];

  // The options for the map
  const maps = [
    { value: "", title: "Select a Map" },
    { value: "de_cache", title: "Cache" },
    { value: "de_cbble", title: "Cobblestone" },
    { value: "de_dust2", title: "Dust II" },
    { value: "de_inferno", title: "Inferno" },
    { value: "de_mirage", title: "Mirage" },
    { value: "de_nuke", title: "Nuke" },
    { value: "de_overpass", title: "Overpass" },
    { value: "de_train", title: "Train" }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h3>General Information</h3>
      <div className="upload-row">
        <UploadSelect
          label="Grenade"
          input="nade"
          options={nades}
          value={nade}
          require={true}
          onChange={handleChange}
        />
        <UploadSelect
          label="Map"
          input="map"
          options={maps}
          value={map}
          require={true}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadInput
          label="Start Location"
          input="start"
          value={start}
          hint="Tetris, T Spawn, A Long, etc."
          length={25}
          help="The start location where the player throws the grenade. The input should be a call-out on the map that the player can easily recognize."
          require={true}
          onChange={handleChange}
          changeState={changeState}
        />
        <UploadInput
          label="End Location"
          input="end"
          value={end}
          hint="Cat, Jungle, Heaven, etc."
          length={25}
          help="The end location of the grenade after it has been thrown. The input should be a call-out on the map that the player can easily recognize."
          require={true}
          onChange={handleChange}
          changeState={changeState}
        />
      </div>
      <div className="upload-row">
        <UploadInput
          label="Source"
          input="source"
          value={source}
          hint="Reddit, Twitter, YouTube, etc. (Optional)"
          length={140}
          help="The source of this grenade throw. This can be a link to a Reddit/Imgur post or to a YouTube video/channel."
          onChange={handleChange}
          changeState={changeState}
        />
      </div>
      <h3>Characteristics</h3>
      {nade === "weapon_smokegrenade" &&
        <div className="upload-row">
          <UploadSwitch
            label="Does this smoke grenade create a one-way?"
            input="oneway"
            value={oneway}
            onChange={handleChange}
          />
        </div>
      }
      <div className="upload-row">
        <UploadSwitch
          label="Does throwing this grenade require movement such as running or jumping?"
          input="movement"
          value={movement}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadSwitch
          label="Does aligning this grenade require a specific viewmodel?"
          input="viewmodel"
          value={viewmodel}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadSwitch
          label="Does aligning this grenade require minimum video settings?"
          input="vsettings"
          value={vsettings}
          onChange={handleChange}
        />
      </div>
      <div style={{ height: 4 }}></div>
      {movement &&
        <div>
          <div className="upload-row">
            <UploadRadio
              label="Movement"
              input="move"
              options={["Jump", "Run/Walk", "Both"]}
              value={move}
              onChange={handleChange}
            />
          </div>
          <div className="upload-row">
            <UploadRadio
              label="Tick Rate"
              input="tick"
              options={["64 Tick", "128 Tick", "Both"]}
              value={tick}
              onChange={handleChange}
            />
          </div>
          <Margin />
        </div>
      }
      <div className="upload-row">
        <UploadRadio
          label="Throw Variation"
          input="thrw"
          options={["Left Click", "Right Click", "Both"]}
          value={thrw}
          help="The action that triggers the grenade throw. A left click is an overhand (long) throw and a right click is an underhand (short) throw."
          onChange={handleChange}
          changeState={changeState}
        />
      </div>
      {viewmodel &&
        <div className="upload-row">
          <UploadRadio
            label="Viewmodel"
            input="view"
            options={["Desktop", "Couch", "Classic"]}
            value={view}
            onChange={handleChange}
          />
        </div>
      }
      <div className="upload-row">
        <UploadRadio
          label="Team"
          input="team"
          options={["Counter-Terrorist", "Terrorist", "Both"]}
          value={team}
          help="The team that benefits the most from this grenade throw and are most likely to use it in a competitive match."
          onChange={handleChange}
          changeState={changeState}
        />
      </div>
      {vsettings &&
        <div>
          <h3>Minimum Video Settings</h3>
          <div className="upload-row">
            <UploadSelect
              label="Global Shadow Quality"
              input="shadow"
              options={[
                { value: 0, title: "N/A" },
                { value: 1, title: "Very Low" },
                { value: 2, title: "Low" },
                { value: 3, title: "Medium" },
                { value: 4, title: "High" }
              ]}
              value={shadow}
              onChange={handleChange}
            />
            <UploadSelect
              label="Model/Texture Detail"
              input="texture"
              options={[
                { value: 0, title: "N/A" },
                { value: 2, title: "Low" },
                { value: 3, title: "Medium" },
                { value: 4, title: "High" }
              ]}
              value={texture}
              onChange={handleChange}
            />
          </div>
          <div className="upload-row">
            <UploadSelect
              label="Effect Detail"
              input="effect"
              options={[
                { value: 0, title: "N/A" },
                { value: 2, title: "Low" },
                { value: 3, title: "Medium" },
                { value: 4, title: "High" }
              ]}
              value={effect}
              onChange={handleChange}
            />
            <UploadSelect
              label="Shader Detail"
              input="shader"
              options={[
                { value: 0, title: "N/A" },
                { value: 2, title: "Low" },
                { value: 3, title: "Medium" },
                { value: 4, title: "High" },
                { value: 5, title: "Very High" }
              ]}
              value={shader}
              onChange={handleChange}
            />
          </div>
          <Margin />
        </div>
      }
      <UploadSubmit value="Continue" />
    </form>
  );
}


// A component that fixes margin issues
function Margin() {
  return (
    <div style={{ display: "none" }}></div>
  );
}


export default Details;
