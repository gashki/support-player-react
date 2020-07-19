import React, { Component } from "react";
import { auth } from "../../firebase";

// React components
import Close from "./Close";
import Dialog from "./Dialog";
import { ModalLabel, ModalInput, ModalSubmit, ModalError } from "./Form";


// The login content for the modal
function Login({ index, changeState }) {
  // Prevents the modal from closing when the content is clicked
  const preventClose = (e) => e.stopPropagation();

  return (
    <div className="modal-content-tabs" onMouseDown={preventClose}>
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
    }).catch(error => {
      if (this._isMounted) this.setState({ error });
    });
  };

  // Opens the "Reset Password" dialog
  openDialog = () => {
    const changeState = this.props.changeState;
    const title = "Reset Password";
    const message = "Enter your email address and we'll send you a link to reset your password.";

    // Sends an email to reset the user's password
    const onSubmit = (input) => auth.sendPasswordResetEmail(input).catch(error => error);

    // The attributes for the dialog
    const attributes = { title, message, action: "Send", type: "email", onSubmit, changeState };

    changeState("contentModal", <Dialog {...attributes} />);
  };

  render() {
    const isLogin = this.props.isLogin;
    const { email, password, error } = this.state;
    const handleChange = this.handleChange;
    const handleSubmit = this.handleSubmit;
    const openDialog = this.openDialog;

    const formId = isLogin ? "modal-form-login" : "modal-form-register";
    const action = isLogin ? "Log in" : "Sign up";
    const agreement = "By clicking Sign Up, you are indicating that you have read and agree to our Terms of Service and Privacy Policy.";

    return (
      <form id={formId} className="modal-form" onSubmit={handleSubmit}>
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
        {isLogin
          ? <button className="modal-login-forgot" type="button" onClick={openDialog}>Forgot Password?</button>
          : <p className="modal-user-agreement">{agreement}</p>
        }
        <ModalSubmit value={action} />
      </form>
    );
  }
}


export default Login;
