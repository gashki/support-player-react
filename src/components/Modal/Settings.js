import React, { Component } from "react";
import firebase from "../../firebase";

// React components
import Close from "./Close";
import { ModalLabel, ModalInput, ModalSubmit, ModalError } from "./Form";


// The settings content for the modal
function Settings({ currentUser, changeContent }) {
  // Prevents the modal from closing when the content is clicked
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-content-tabs" onClick={handleClick}>
      <ModalLabel checked={true} label="Email" />
      <ModalLabel checked={false} label="Password" />
      <SettingsForm
        isEmail={true}
        currentUser={currentUser}
        changeContent={changeContent}
      />
      <SettingsForm
        isEmail={false}
        currentUser={currentUser}
        changeContent={changeContent}
      />
      <Close changeContent={changeContent} />
    </div>
  );
}


// The user settings form
class SettingsForm extends Component {
  constructor(props) {
    super(props);

    // The default state of the form
    this.state = {
      newEmail: props.currentUser.email,
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
      error: null
    }
  }

  // Changes the value of the text inputs
  handleChange = (e, input) => {
    this.setState({
      [input]: e.target.value
    });
  };

  // Handles the form submission
  handleSubmit = (e) => {
    const { isEmail, currentUser, changeContent } = this.props;
    const { newEmail, newPassword, confirmPassword, currentPassword } = this.state;

    // Prevents the form from being submitted
    e.preventDefault();

    this.setState({
      error: null
    });

    const credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    // Reauthenticates the user
    currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then((_) => {
      if (isEmail) {
        return currentUser.updateEmail(newEmail);
      }

      if (newPassword !== confirmPassword) {
        throw new Error("The new password and confirmation password do not match.");
      }

      return currentUser.updatePassword(newPassword);
    }).then(() => {
      changeContent("contentModal", null);
    }).catch((error) => {
      console.log(error);

      this.setState({
        error: error
      });
    });
  };

  render() {
    const isEmail = this.props.isEmail;
    const { newEmail, newPassword, confirmPassword, currentPassword, error } = this.state;
    const handleChange = this.handleChange;
    const handleSubmit = this.handleSubmit;

    if (isEmail) {
      return (
        <form className="modal-form" id="modal-form-email" onSubmit={handleSubmit}>
          {error && <ModalError error={error} />}
          <ModalInput
            label="New Email"
            input="newEmail"
            type="email"
            value={newEmail}
            onChange={handleChange}
          />
          <ModalInput
            label="Current Password"
            input="currentPassword"
            type="password"
            value={currentPassword}
            onChange={handleChange}
          />
          <div style={{ height: 12 }}></div>
          <ModalSubmit value="Save" />
        </form>
      );
    }

    return (
      <form className="modal-form" id="modal-form-password" onSubmit={handleSubmit}>
        {error && <ModalError error={error} />}
        <ModalInput
          label="Current Password"
          input="currentPassword"
          type="password"
          value={currentPassword}
          onChange={handleChange}
        />
        <ModalInput
          label="New Password"
          input="newPassword"
          type="password"
          value={newPassword}
          onChange={handleChange}
        />
        <ModalInput
          label="Confirm Password"
          input="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleChange}
        />
        <div style={{ height: 12 }}></div>
        <ModalSubmit value="Save" />
      </form>
    );
  }
}

export default Settings;
