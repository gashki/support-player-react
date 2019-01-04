import React, { Component } from "react";
import { auth } from "../../firebase";
import { FormInput, FormSubmit, FormError } from "./Form";
import Close from "./Close";

function Login(props) {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-content-tabs" onClick={handleClick}>
      <input defaultChecked={0 === props.index} id="modal-radio-login" name="modal-tab-login" type="radio" />
      <label className="modal-tab unselectable" htmlFor="modal-radio-login">Login</label>
      <input defaultChecked={1 === props.index} id="modal-radio-register" name="modal-tab-login" type="radio" />
      <label className="modal-tab unselectable" htmlFor="modal-radio-register">Register</label>
      <LoginForm isLogin={true} toggleModal={props.toggleModal} />
      <LoginForm isLogin={false} toggleModal={props.toggleModal} />
      <Close toggleModal={props.toggleModal} />
    </div>
  );
}

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null
    };
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

    const authenticateUser = (a, b) => {
      if (this.props.isLogin) {
        return auth.signInWithEmailAndPassword(a, b);
      }

      return auth.createUserWithEmailAndPassword(a, b);
    }

    authenticateUser(this.state.email, this.state.password).then(() => {
      this.props.toggleModal(null);
    }).catch((error) => {
      console.log(error);

      this.setState({
        error: error
      });
    });
  };

  render() {
    if (this.props.isLogin) {
      return (
        <form className="modal-form" id="modal-form-login" onSubmit={this.handleSubmit}>
          {this.state.error && <FormError error={this.state.error} />}
          <FormInput label="Email" input="email" type="email" value={this.state.email} onChange={this.handleChange} />
          <FormInput label="Password" input="password" type="password" value={this.state.password} onChange={this.handleChange} />
          <button className="modal-login-forgot" type="button">Forgot Password?</button>
          <FormSubmit value="Log in" />
        </form>
      );
    }

    return (
      <form className="modal-form" id="modal-form-register" onSubmit={this.handleSubmit}>
        {this.state.error && <FormError error={this.state.error} />}
        <FormInput label="Email" input="email" type="email" value={this.state.email} onChange={this.handleChange} />
        <FormInput label="Password" input="password" type="password" value={this.state.password} onChange={this.handleChange} />
        <p className="modal-user-agreement">By clicking Sign Up, you are indicating that you have read and agree to our Terms of Service and Privacy Policy.</p>
        <FormSubmit value="Sign up" />
      </form>
    );
  }
}

export default Login;
