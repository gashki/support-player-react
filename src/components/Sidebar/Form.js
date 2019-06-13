import React from "react";

// React components
import Rating from "../Rating";

// The select label used for sorting the nades
export function FilterSelect({ legend, input, options, value }) {
  // Builds a list of select options
  const optionList = options.map((option, index) => {
    const key = `filter-select-${input}-${index}`;

    return (
      <option key={key} value={index}>{option}</option>
    );
  });

  const filterSelect = <select value={value}>{optionList}</select>;

  return (
    <Fieldset legend={legend} filters={filterSelect} />
  );
}

// The checkbox label used for filtering the nades
export function FilterCheckbox({ legend, options }) {
  // Builds a list of checkboxes for related filters
  const optionList = options.map(option => {
    const { id, title, value } = option;
    const key = `filter-checkbox-${id}`;

    return (
      <label key={key} className="border-box">
        <input type="checkbox" defaultChecked={value} />
        <span>{title}</span>
      </label>
    );
  });

  return (
    <Fieldset legend={legend} filters={optionList} />
  );
}

// The checkbox label used for filtering by ratings
export function FilterRating({ options }) {
  // Builds a list of rating checkboxes
  const optionList = options.map(option => {
    const { id, title, value } = option;
    const key = `filter-checkbox-${id}`;

    return (
      <label key={key} className="border-box">
        <input type="checkbox" defaultChecked={value} />
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
