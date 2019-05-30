import React, { Component } from "react";
import { auth } from "./firebase";
import "./App.css";

// React components
import Content from "./components/Content";
import Login from "./components/Modal/Login";
import Modal from "./components/Modal/Modal";
import Navbar from "./components/Navbar";
import Settings from "./components/Modal/Settings";


// The root component of the application
class App extends Component {
  constructor(props) {
    super(props);

    const contentMain = { type: null, state: null };
    const contentModal = null;
    const currentUser = null;

    // The default state of the application
    this.state = { contentMain, contentModal, currentUser };

    // Enables the browser buttons for content navigation
    window.onpopstate = (_) => this.setContent(false);
  }

  componentDidMount() {
    // Observes changes to the user's sign-in state
    auth.onAuthStateChanged((currentUser) => {
      this.setState({ currentUser }, () => this.setContent(true));
    });
  }

  // Sets the content based on the current URL
  setContent = (replaceState) => {
    // The current URL of the page
    const currentPath = window.location.pathname.slice(1);
    const currentUser = this.state.currentUser;
    const changeState = this.changeState;

    // The default state of the content
    let contentMain = { type: "NadeList", state: null };
    let contentModal = null;

    // Removes extra forward slashes from the path
    let replacePath = currentPath.replace(/\/\/+/g, "/");

    // Removes the last forward slash from the path
    if (replacePath.slice(-1) === "/") {
      replacePath = replacePath.slice(0, -1);
    }

    // Signs out the user and redirects the page
    if ("logout" === replacePath) {
      replacePath = "";

      // Does not sign out anonymous users
      if (currentUser && !currentUser.isAnonymous) {
        auth.signOut();
      }
    }
    // Displays the login and registration content
    else if (/^(login|register)$/.test(replacePath)) {
      // Checks if a user is already signed in
      if (currentUser) {
        replacePath = "";
      }
      else {
        const index = "login" === replacePath ? 0 : 1;
        contentModal = <Login index={index} changeState={changeState} />;
      }
    }
    // Displays the account settings content
    else if ("settings" === replacePath) {
      if (currentUser) {
        contentModal = <Settings currentUser={currentUser} changeState={changeState} />;
      }
      else {
        // Displays the login if there is no user signed in
        contentModal = <Login index={0} changeState={changeState} />;
      }
    }
    // Displays the grenade submission content
    else if ("upload" === replacePath) {
      if (currentUser) {
        contentMain.type = "Upload";
      }
      else {
        // Displays the login if there is no user signed in
        contentModal = <Login index={0} changeState={changeState} />;
      }
    }
    // Replaces the URL if it is invalid
    else {
      replacePath = "";
    }

    // Replaces the current history entry if the URL is invalid
    if (replaceState) {
      window.history.replaceState(null, null, "/" + replacePath);
    }

    // Sets the content of the application
    this.setState({ contentMain, contentModal });
  };

  // Sets the state of the content
  changeState = (type, content, path) => {
    this.setState({
      [type]: content
    });

    // Changes the current URL of the page
    if (path) window.history.pushState(null, null, path);
  };

  render() {
    const { contentMain, contentModal, currentUser } = this.state;
    const changeState = this.changeState;

    // Displays the content of the application
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Navbar
          currentUser={currentUser}
          changeState={changeState}
        />
        <Content
          contentMain={contentMain}
          currentUser={currentUser}
          changeState={changeState}
        />
        {contentModal &&
          <Modal
            contentModal={contentModal}
            changeState={changeState}
          />
        }
      </div>
    );
  }
}

export default App;
