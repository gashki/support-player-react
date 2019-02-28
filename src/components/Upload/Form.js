import React from "react";

// Components
import Required from "./Required";
import Vertical from "../Vertical";

export function UploadSelect(props) {
  const { label, input, options, value, require = false, onChange } = props;

  const optionList = options.map((option, index) => {
    const id = `upload-select-${input}-${index}`;

    return (
      <option key={id} value={option.value}>{option.title}</option>
    );
  });

  const handleChange = (e) => {
    const value = e.target.value;
    onChange(input, value);
  };

  return (
    <div>
      <label className="upload-details-label">{label}{require && <Required />}</label>
      <select className="upload-select border-box" value={value} onChange={handleChange}>
        {optionList}
      </select>
    </div>
  );
}

export function UploadInput(props) {
  const { label, input, value, hint, require = false, onChange } = props;

  const handleChange = (e) => {
    const value = e.target.value;
    onChange(input, value);
  };

  return (
    <div>
      <label className="upload-details-label">{label}{require && <Required />}</label>
      <input className="upload-input border-box" type="text" value={value} placeholder={hint} onChange={handleChange} />
    </div>
  );
}

export function UploadRadio({ label, input, options, value, onChange }) {
  const name = `upload-radio-${input}`;

  const optionList = options.map((option, index) => {
    const id = `${name}-${index}`;
    const checked = parseInt(value) === index;

    const handleChange = (_) => {
      const value = index;
      onChange(input, value);
    };

    return (
      <div key={id}>
        <input id={id} name={name} type="radio" defaultChecked={checked} onChange={handleChange} />
        <label htmlFor={id}>{option}</label>
      </div>
    );
  });

  return (
    <div>
      <label className="upload-details-label">{label}<Required /></label>
      <div className="upload-radio border-box">
        {optionList}
      </div>
    </div>
  );
}

export function UploadSwitch({ label, input, value, onChange }) {
  const id = `upload-switch-${input}`;

  const handleChange = (e) => {
    const value = e.target.checked;
    onChange(input, value);
  };

  return (
    <div>
      <label className="upload-switch-label">{label}<Required /></label>
      <input className="upload-switch-input" id={id} type="checkbox" defaultChecked={value} onChange={handleChange} />
      <label htmlFor={id}></label>
      <Vertical />
    </div>
  );
}

export function UploadSubmit({ value }) {
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
      <input className="upload-submit" type="submit" value={value} />
    </div>
  );
}
