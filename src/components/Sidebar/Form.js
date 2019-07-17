import React from "react";

// React components
import Rating from "../Rating";

// The select label used for sorting the nades
export function FilterSelect(props) {
  const { legend, input, options, value, onChange } = props;

  // Builds a list of select options
  const optionList = options.map((option, index) => {
    const key = `filter-select-${input}-${index}`;

    return (
      <option key={key} value={index}>{option}</option>
    );
  });

  // Sets the value of the input
  const handleChange = (e) => {
    let value = e.target.value;

    // Converts the value to a number
    if (/^\d+$/.test(value)) value = +value;

    onChange(input, value);
  };

  const filterSelect = <select value={value} onChange={handleChange}>{optionList}</select>;

  return (
    <Fieldset legend={legend} filters={filterSelect} />
  );
}

// The checkbox label used for filtering the nades
export function FilterCheckbox({ legend, options, onChange }) {
  // Builds a list of checkboxes for related filters
  const optionList = options.map(option => {
    const { id, title, value } = option;
    const key = `filter-checkbox-${id}`;

    // Sets the value of the input
    const handleChange = (e) => {
      const value = e.target.checked;
      onChange(id, value);
    };

    return (
      <label key={key} className="border-box">
        <input type="checkbox" checked={value} onChange={handleChange} />
        <span>{title}</span>
      </label>
    );
  });

  return (
    <Fieldset legend={legend} filters={optionList} />
  );
}

// The checkbox label used for filtering by ratings
export function FilterRating({ options, onChange }) {
  // Builds a list of rating checkboxes
  const optionList = options.map(option => {
    const { id, title, value } = option;
    const key = `filter-checkbox-${id}`;

    // Sets the value of the input
    const handleChange = (e) => {
      const value = e.target.checked;
      onChange(id, value);
    };

    return (
      <label key={key} className="border-box">
        <input type="checkbox" checked={value} onChange={handleChange} />
        <Rating width={title} />
        <span>&nbsp;&amp; Up</span>
      </label>
    );
  });

  return (
    <Fieldset legend="Rating" filters={optionList} />
  );
}

// The fieldset component that groups related filters
function Fieldset({ legend, filters }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {filters}
    </fieldset>
  );
}
