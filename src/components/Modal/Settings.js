import React, { Component } from "react";
import firebase from "../../firebase";
import { FormInput, FormSubmit, FormError } from "./Form";
import Close from "./Close";

function Settings(props) {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-content-tabs" onClick={handleClick}>
      <input defaultChecked={true} id="modal-radio-email" name="modal-tab-settings" type="radio" />
      <label className="modal-tab unselectable" htmlFor="modal-radio-email">Email</label>
      <input defaultChecked={false} id="modal-radio-password" name="modal-tab-settings" type="radio" />
      <label className="modal-tab unselectable" htmlFor="modal-radio-password">Password</label>
      <SettingsForm isEmail={true} currentUser={props.currentUser} toggleModal={props.toggleModal} />
      <SettingsForm isEmail={false} currentUser={props.currentUser} toggleModal={props.toggleModal} />
      <Close toggleModal={props.toggleModal} />
    </div>
  );
}

class SettingsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newEmail: props.currentUser.email,
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
      error: null
    }
  }

  handleChange = (e, input) => {
    this.setState({
      [input]: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      error: null
    });

    const credential = firebase.auth.EmailAuthProvider.credential(
      this.props.currentUser.email,
      this.state.currentPassword
    );

    this.props.currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then((_) => {
      if (this.props.isEmail) {
        return this.props.currentUser.updateEmail(this.state.newEmail);
      }

      if (this.state.newPassword !== this.state.confirmPassword) {
        throw new Error("The new password and confirmation password do not match.");
      }

      return this.props.currentUser.updatePassword(this.state.newPassword);
    }).then(() => {
      this.props.toggleModal(null);
    }).catch((error) => {
      console.log(error);

      this.setState({
        error: error
      });
    });
  };

  render() {
    if (this.props.isEmail) {
      return (
        <form className="modal-form" id="modal-form-email" onSubmit={this.handleSubmit}>
          {this.state.error && <FormError error={this.state.error} />}
          <FormInput label="New Email" input="newEmail" type="email" value={this.state.newEmail} onChange={this.handleChange} />
          <FormInput label="Current Password" input="currentPassword" type="password" value={this.state.currentPassword} onChange={this.handleChange} />
          <div style={{ height: 12 }}></div>
          <FormSubmit value="Save" />
        </form>
      );
    }

    return (
      <form className="modal-form" id="modal-form-password" onSubmit={this.handleSubmit}>
        {this.state.error && <FormError error={this.state.error} />}
        <FormInput label="Current Password" input="currentPassword" type="password" value={this.state.currentPassword} onChange={this.handleChange} />
        <FormInput label="New Password" input="newPassword" type="password" value={this.state.newPassword} onChange={this.handleChange} />
        <FormInput label="Confirm Password" input="confirmPassword" type="password" value={this.state.confirmPassword} onChange={this.handleChange} />
        <div style={{ height: 12 }}></div>
        <FormSubmit value="Save" />
      </form>
    );
  }
}

export default Settings;
