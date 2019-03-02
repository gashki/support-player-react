import React from "react";

// React components
import Required from "./Required";
import Vertical from "../Vertical";

// The select input used on the details form
export function UploadSelect(props) {
  const { label, input, options, value, require = false, onChange } = props;

  // Builds a list of select options
  const optionList = options.map((option, index) => {
    const id = `upload-select-${input}-${index}`;

    return (
      <option key={id} value={option.value}>{option.title}</option>
    );
  });

  // Sets the value of the input
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

// The text input used on the details form
export function UploadInput(props) {
  const { label, input, value, hint, require = false, onChange } = props;

  // Sets the value of the input
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

// The radio input used on the details form
export function UploadRadio({ label, input, options, value, onChange }) {
  const name = `upload-radio-${input}`;

  // Builds a list of radio options
  const optionList = options.map((option, index) => {
    const id = `${name}-${index}`;
    const checked = parseInt(value) === index;

    // Sets the value of the input
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

// The switch input used on the details form
export function UploadSwitch({ label, input, value, onChange }) {
  const id = `upload-switch-${input}`;

  // Sets the value of the input
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

// The submit button for the upload page
export function UploadSubmit({ value }) {
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
      <input className="upload-submit" type="submit" value={value} />
    </div>
  );
}
