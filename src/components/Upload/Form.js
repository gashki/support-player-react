import React from "react";

// React components
import Help from "./Help";
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
  const {
    label,
    input,
    value,
    hint,
    length = 0,
    help,
    require = false,
    onChange,
    changeContent
  } = props;

  // Sets the value of the input
  const handleChange = (e) => {
    const value = e.target.value;
    onChange(input, value);
  };

  // Prevents the label from opening the help message
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <label className="upload-details-label" onClick={handleClick}>
        {label}
        {require && <Required />}
        {help && <Help message={help} changeContent={changeContent} />}
      </label>
      <input
        className="upload-input border-box"
        type="text"
        value={value}
        placeholder={hint}
        maxLength={length}
        onChange={handleChange}
      />
    </div>
  );
}

// The radio input used on the details form
export function UploadRadio({ label, input, options, value, help, onChange, changeContent }) {
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
        <input
          id={id}
          name={name}
          type="radio"
          defaultChecked={checked}
          onChange={handleChange}
        />
        <label htmlFor={id}>{option}</label>
      </div>
    );
  });

  // Prevents the label from opening the help message
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <label className="upload-details-label" onClick={handleClick}>
        {label}
        <Required />
        {help && <Help message={help} changeContent={changeContent} />}
      </label>
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
      <input
        id={id}
        className="upload-switch-input"
        type="checkbox"
        defaultChecked={value}
        onChange={handleChange}
      />
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

// The error/help message used for the upload page
export function UploadMessage({ title, message, content, changeContent }) {
  // Prevents the modal from closing when the content is clicked
  const handleClick = (e) => {
    e.stopPropagation();
  };

  const closeModal = () => {
    changeContent("contentModal", null);
  };

  return (
    <div className="upload-message" onClick={handleClick}>
      <h3>{title}</h3>
      <p>{message}</p>
      {content}
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <button type="button" onClick={closeModal}>Dismiss</button>
      </div>
    </div>
  );
}
