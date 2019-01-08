import React from "react";

// The label used for tabs.
export function FormLabel({ checked, label }) {
  const temp = label.toLowerCase();

  return ([
    <input key={`FormLabel-input-${temp}`} defaultChecked={checked} id={`modal-radio-${temp}`} name="modal-tab" type="radio" />,
    <label key={`FormLabel-label-${temp}`} className="modal-tab unselectable" htmlFor={`modal-radio-${temp}`}>{label}</label>
  ]);
}

// The text input used on forms.
export function FormInput(props) {
  const { label, input, type, value, onChange } = props;

  const handleChange = (e) => {
    onChange(e, input);
  };

  return ([
    <label key={`FormInput-label-${input}`}>{label}</label>,
    <input key={`FormInput-input-${input}`} className="modal-form-input border-box" type={type} value={value} onChange={handleChange} required />
  ]);
}

// The submit button for forms.
export function FormSubmit({ value }) {
  return (
    <input className="modal-form-submit border-box" type="submit" value={value} />
  );
}

// Used for displaying error messages.
export function FormError({ error }) {
  return (
    <p className="modal-form-error">{error.message}</p>
  );
}
