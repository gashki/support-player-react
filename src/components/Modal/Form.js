import React from "react";

// The label used for modal tabs.
export function ModalLabel({ checked, label }) {
  const temp = label.toLowerCase();
  const id = `modal-radio-${temp}`;

  return ([
    <input key={`ModalLabel-input-${temp}`} defaultChecked={checked} id={id} name="modal-tab" type="radio" />,
    <label key={`ModalLabel-label-${temp}`} className="modal-tab unselectable" htmlFor={id}>{label}</label>
  ]);
}

// The text input used on modal forms.
export function ModalInput(props) {
  const { label, input, type, value, onChange } = props;

  const handleChange = (e) => {
    onChange(e, input);
  };

  return ([
    <label key={`ModalInput-label-${input}`}>{label}</label>,
    <input key={`ModalInput-input-${input}`} className="modal-form-input border-box" type={type} value={value} onChange={handleChange} required />
  ]);
}

// The submit button for modal forms.
export function ModalSubmit({ value }) {
  return (
    <input className="modal-form-submit border-box" type="submit" value={value} />
  );
}

// Used for displaying error messages.
export function ModalError({ error }) {
  return (
    <p className="modal-form-error">{error.message}</p>
  );
}
