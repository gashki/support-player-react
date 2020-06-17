import React, { Component } from "react";
import firebase from "../../firebase";

// React components
import Close from "./Close";
import { ModalLabel, ModalInput, ModalSubmit, ModalError } from "./Form";


// The settings content for the modal
function Settings({ currentUser, changeState }) {
  // Prevents the modal from closing when the content is clicked
  const preventClose = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-content-tabs" onMouseDown={preventClose}>
      <ModalLabel checked={true} label="Email" />
      <ModalLabel checked={false} label="Password" />
      <SettingsForm
        isEmail={true}
        currentUser={currentUser}
        changeState={changeState}
      />
      <SettingsForm
        isEmail={false}
        currentUser={currentUser}
        changeState={changeState}
      />
      <Close changeState={changeState} />
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

  componentDidMount() {
    // Tracks the mounted status of the component
    this._isMounted = true;
  }

  componentWillUnmount() {
    // Prevents updates to unmounted components
    this._isMounted = false;
  }

  // Changes the value of the text inputs
  handleChange = (e, input) => {
    this.setState({ [input]: e.currentTarget.value });
  };

  // Handles the form submission
  handleSubmit = (e) => {
    const { isEmail, currentUser, changeState } = this.props;
    const { newEmail, newPassword, confirmPassword, currentPassword } = this.state;

    // Prevents the form from being submitted
    e.preventDefault();

    this.setState({ error: null });

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
      changeState("contentModal", null);
    }).catch(error => {
      if (this._isMounted) this.setState({ error });
    });
  };

  render() {
    const isEmail = this.props.isEmail;
    const { newEmail, newPassword, confirmPassword, currentPassword, error } = this.state;
    const handleChange = this.handleChange;
    const handleSubmit = this.handleSubmit;

    const formId = isEmail ? "modal-form-email" : "modal-form-password";

    return (
      <form id={formId} className="modal-form" onSubmit={handleSubmit}>
        {error && <ModalError error={error} />}
        {isEmail &&
          <ModalInput
            label="New Email"
            input="newEmail"
            type="email"
            value={newEmail}
            onChange={handleChange}
          />
        }
        <ModalInput
          label="Current Password"
          input="currentPassword"
          type="password"
          value={currentPassword}
          onChange={handleChange}
        />
        {isEmail ||
          <ModalInput
            label="New Password"
            input="newPassword"
            type="password"
            value={newPassword}
            onChange={handleChange}
          />
        }
        {isEmail ||
          <ModalInput
            label="Confirm Password"
            input="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
          />
        }
        <div style={{ height: 12 }}></div>
        <ModalSubmit value="Save" />
      </form>
    );
  }
}


export default Settings;
