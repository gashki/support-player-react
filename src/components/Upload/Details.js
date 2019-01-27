import React from "react";
import Vertical from "../Vertical";


export function UploadSelect({ label, input, options, onChange }) {
  const optionList = options.map((option, index) => {
    const id = `upload-select-${input}-${index}`;

    return (
      <option key={id} value={option.value}>{option.title}</option>
    );
  });

  const handleChange = (e) => {
    onChange(e, input);
  };

  return (
    <div>
      <label className="upload-label">{label}</label>
      <select className="upload-select border-box" onChange={handleChange}>
        {optionList}
      </select>
    </div>
  );
}

export function UploadInput({ label, input, hint, onChange }) {
  const handleChange = (e) => {
    onChange(e, input);
  };

  return (
    <div>
      <label className="upload-label">{label}</label>
      <input className="upload-input border-box" type="text" placeholder={hint} onChange={handleChange} />
    </div>
  );
}

export function UploadRadio({ label, input, options, onChange }) {
  const name = `upload-radio-${input}`;

  const optionList = options.map((option, index) => {
    const id = `${name}-${index}`;

    const handleChange = (e) => {
      e.target.value = index;
      onChange(e, input);
    };

    return (
      <div key={id}>
        <input id={id} name={name} type="radio" onChange={handleChange} required />
        <label htmlFor={id}>{option}</label>
      </div>
    );
  });

  return (
    <div>
      <label className="upload-label">{label}</label>
      <div className="upload-radio border-box">
        {optionList}
      </div>
    </div>
  );
}

export function UploadSwitch({ label, input, onChange }) {
  const id = `upload-switch-${input}`;

  const handleChange = (e) => {
    onChange(e, input);
  };

  return (
    <div>
      <label className="upload-switch-label">{label}</label>
      <input className="upload-switch-input" id={id} type="checkbox" onChange={handleChange} />
      <label htmlFor={id}></label>
      <Vertical />
    </div>
  );
}
