import React from "react";

// Components
import {
  UploadSelect,
  UploadInput,
  UploadRadio,
  UploadSwitch,
  UploadSubmit
} from "./Form";

function Details(props) {
  const { nade, movement, handleChange, handleSubmit } = props;

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
          require={true}
          onChange={handleChange}
        />
        <UploadSelect
          label="Map"
          input="map"
          options={maps}
          require={true}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadInput
          label="Start Location"
          input="start"
          hint="Tetris, T Spawn, etc."
          require={true}
          onChange={handleChange}
        />
        <UploadInput
          label="End Location"
          input="end"
          hint=""
          require={true}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadInput
          label="Source"
          input="source"
          hint="Twitter, Reddit, YouTube, etc. (Optional)"
          onChange={handleChange}
        />
      </div>
      <h3>Characteristics</h3>
      {nade === "weapon_smokegrenade" &&
        <div className="upload-row">
          <UploadSwitch
            label="Does this smoke grenade create a one-way?"
            input="oneway"
            onChange={handleChange}
          />
        </div>
      }
      <div className="upload-row">
        <UploadSwitch
          label="Does throwing this grenade require movement such as running or jumping?"
          input="movement"
          onChange={handleChange}
        />
      </div>
      <div style={{ height: 4 }}></div>
      {movement &&
        <div className="upload-row">
          <UploadRadio
            label="Movement"
            input="move"
            options={["Jump", "Run/Walk", "Both"]}
            onChange={handleChange}
          />
        </div>
      }
      <div className="upload-row">
        <UploadRadio
          label="Throw Variation"
          input="thrw"
          options={["Left Click", "Right Click", "Both"]}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadRadio
          label="Tick Rate"
          input="tick"
          options={["64 Tick", "128 Tick", "Both"]}
          onChange={handleChange}
        />
      </div>
      <div className="upload-row">
        <UploadRadio
          label="Team"
          input="team"
          options={["Counter-Terrorist", "Terrorist", "Both"]}
          onChange={handleChange}
        />
      </div>
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
          onChange={handleChange}
        />
      </div>
      <UploadSubmit value="Continue" />
    </form>
  );
}

export default Details;
