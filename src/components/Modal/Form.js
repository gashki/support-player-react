import React from "react";

export function FormInput(props) {
  function handleChange(e) {
    props.onChange(e, props.input);
  }

  return (
    <div>
      <label>{props.label}</label>
      <input className="modal-form-input border-box" type={props.type} value={props.value} onChange={handleChange} required />
    </div>
  );
}

export function FormSubmit(props) {
  return (
    <input className="modal-form-submit border-box" type="submit" value={props.value} />
  );
}

export function FormError(props) {
  return (
    <p className="modal-form-error">{props.error.message}</p>
  );
}
