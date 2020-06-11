import React, { Component } from "react";
import { ModalError } from "./Form";

// The dialog component used for accepting user input
class Dialog extends Component {
  constructor(props) {
    super(props);

    // The default state of the dialog
    this.state = {
      value: "",
      error: null
    };
  }

  // Prevents the modal from closing when the content is clicked
  preventClose = (e) => {
    e.stopPropagation();
  };

  // Sets the value of the input
  handleChange = (e) => {
    const value = e.currentTarget.value;
    this.setState({ value });
  };

  // Submits the user input to be processed
  handleSubmit = async (e) => {
    const { type = "text", close = true, onSubmit, changeState } = this.props;
    const { value, error } = this.state;
    const input = value.trim();

    // Prevents the form from being submitted
    e.preventDefault();

    // Resets the error message
    if (error) this.setState({ error: null });

    // Prevents submitting invalid input
    if (type && !input) return null;

    // TODO: Add loading icon
    // TODO: Add success message

    const result = await onSubmit(input);

    // Sets the error message or closes the modal
    if (result) this.setState({ error: result });
    else if (close) changeState("contentModal", null);
  };

  closeDialog = () => {
    const changeState = this.props.changeState;
    changeState("contentModal", null);
  };

  render() {
    const { title, message, action, type = "text" } = this.props;
    const { value, error } = this.state;

    const preventClose = this.preventClose;
    const handleChange = this.handleChange;
    const handleSubmit = this.handleSubmit;
    const closeDialog = this.closeDialog;

    // The attributes for the text input
    const attributes = { type, value, maxLength: 140, onChange: handleChange };

    return (
      <form className="modal-dialog" onMouseDown={preventClose} onSubmit={handleSubmit}>
        <h3>{title}</h3>
        {error && <ModalError error={error} />}
        <p className="modal-dialog-message">{message}</p>
        {type && <input className="modal-form-input" {...attributes} autoFocus required />}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
          <button type="button" onClick={closeDialog}>Cancel</button>
          <button type="submit">{action}</button>
        </div>
      </form>
    );
  }
}

export default Dialog;
