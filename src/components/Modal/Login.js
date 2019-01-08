import React, { Component } from "react";
import { auth } from "../../firebase";

// Components
import Close from "./Close";
import { FormLabel, FormInput, FormSubmit, FormError } from "./Form";


// The login content for the modal.
function Login({ index, changeContent }) {
  // Prevents the modal from closing when the content is clicked.
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-content-tabs" onClick={handleClick}>
      <FormLabel checked={0 === index} label="Login" />
      <FormLabel checked={1 === index} label="Register" />
      <LoginForm isLogin={true} changeContent={changeContent} />
      <LoginForm isLogin={false} changeContent={changeContent} />
      <Close changeContent={changeContent} />
    </div>
  );
}


// The login and registration form.
class LoginForm extends Component {
  constructor(props) {
    super(props);

    // The default state of the form.
    this.state = {
      email: "",
      password: "",
      error: null
    };
  }

  // Changes the value of the text inputs.
  handleChange = (e, input) => {
    this.setState({
      [input]: e.target.value
    });
  };

  // Handles the form submission.
  handleSubmit = (e) => {
    const { isLogin, changeContent } = this.props;
    const { email, password } = this.state;

    e.preventDefault();

    this.setState({
      error: null
    });

    // Determines the user authentication method.
    const authenticateUser = (a, b) => {
      if (isLogin) {
        return auth.signInWithEmailAndPassword(a, b);
      }

      return auth.createUserWithEmailAndPassword(a, b);
    }

    // Authenticates the user and closes the modal.
    authenticateUser(email, password).then(() => {
      changeContent("contentModal", null);
    }).catch((error) => {
      console.log(error);

      this.setState({
        error: error
      });
    });
  };

  render() {
    const isLogin = this.props.isLogin;
    const { email, password, error } = this.state;
    const handleChange = this.handleChange;
    const handleSubmit = this.handleSubmit;

    if (isLogin) {
      return (
        <form className="modal-form" id="modal-form-login" onSubmit={handleSubmit}>
          {error && <FormError error={error} />}
          <FormInput
            label="Email"
            input="email"
            type="email"
            value={email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            input="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
          <button className="modal-login-forgot" type="button">Forgot Password?</button>
          <FormSubmit value="Log in" />
        </form>
      );
    }

    return (
      <form className="modal-form" id="modal-form-register" onSubmit={handleSubmit}>
        {error && <FormError error={error} />}
        <FormInput
          label="Email"
          input="email"
          type="email"
          value={email}
          onChange={handleChange}
        />
        <FormInput
          label="Password"
          input="password"
          type="password"
          value={password}
          onChange={handleChange}
        />
        <p className="modal-user-agreement">By clicking Sign Up, you are indicating that you have read and agree to our Terms of Service and Privacy Policy.</p>
        <FormSubmit value="Sign up" />
      </form>
    );
  }
}

export default Login;
