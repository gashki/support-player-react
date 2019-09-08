import React, { Component } from "react";
import { auth } from "../../firebase";

// React components
import Close from "./Close";
import { ModalLabel, ModalInput, ModalSubmit, ModalError } from "./Form";


// The login content for the modal
function Login({ index, changeState }) {
  // Prevents the modal from closing when the content is clicked
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-content-tabs" onClick={handleClick}>
      <ModalLabel checked={0 === index} label="Login" />
      <ModalLabel checked={1 === index} label="Register" />
      <LoginForm isLogin={true} changeState={changeState} />
      <LoginForm isLogin={false} changeState={changeState} />
      <Close changeState={changeState} />
    </div>
  );
}


// The login and registration form
class LoginForm extends Component {
  constructor(props) {
    super(props);

    // The default state of the form
    this.state = {
      email: "",
      password: "",
      error: null
    };
  }

  // Changes the value of the text inputs
  handleChange = (e, input) => {
    this.setState({ [input]: e.currentTarget.value });
  };

  // Handles the form submission
  handleSubmit = (e) => {
    const { isLogin, changeState } = this.props;
    const { email, password } = this.state;

    // Prevents the form from being submitted
    e.preventDefault();

    this.setState({ error: null });

    // Determines the user authentication method
    const authenticateUser = (a, b) => {
      if (isLogin) {
        return auth.signInWithEmailAndPassword(a, b);
      }

      return auth.createUserWithEmailAndPassword(a, b);
    }

    // Authenticates the user and closes the modal
    authenticateUser(email, password).then((_) => {
      changeState("contentModal", null);
    }).catch((error) => {
      console.log(error);

      this.setState({ error });
    });
  };

  render() {
    const isLogin = this.props.isLogin;
    const { email, password, error } = this.state;
    const handleChange = this.handleChange;
    const handleSubmit = this.handleSubmit;

    if (isLogin) {
      return (
        <form id="modal-form-login" className="modal-form" onSubmit={handleSubmit}>
          {error && <ModalError error={error} />}
          <ModalInput
            label="Email"
            input="email"
            type="email"
            value={email}
            onChange={handleChange}
          />
          <ModalInput
            label="Password"
            input="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <button className="modal-login-forgot" type="button">Forgot Password?</button>
          <ModalSubmit value="Log in" />
        </form>
      );
    }

    return (
      <form id="modal-form-register" className="modal-form" onSubmit={handleSubmit}>
        {error && <ModalError error={error} />}
        <ModalInput
          label="Email"
          input="email"
          type="email"
          value={email}
          onChange={handleChange}
        />
        <ModalInput
          label="Password"
          input="password"
          type="password"
          value={password}
          onChange={handleChange}
        />
        <p className="modal-user-agreement">By clicking Sign Up, you are indicating that you have read and agree to our Terms of Service and Privacy Policy.</p>
        <ModalSubmit value="Sign up" />
      </form>
    );
  }
}


export default Login;
