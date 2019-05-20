import React, { Component } from "react";
import { auth } from "./firebase";
import "./App.css";

// React components
import Content from "./components/Content";
import Modal from "./components/Modal/Modal";
import Navbar from "./components/Navbar";


// The root component of the application
class App extends Component {
  constructor(props) {
    super(props);

    // The default state of the application
    this.state = {
      contentMain: { type: null },
      contentModal: null,
      currentUser: null
    };
  }

  componentDidMount() {
    // Observes changes to the user's sign-in state
    auth.onAuthStateChanged((user) => {
      // Checks if a user is signed in
      if (user) {
        this.setState({
          currentUser: user
        });
      }
      else {
        this.setState({
          currentUser: null
        });
      }
    });
  }

  // Sets the state of the content
  changeContent = (type, content) => {
    this.setState({
      [type]: content
    });
  }

  render() {
    const { contentMain, contentModal, currentUser } = this.state;
    const changeContent = this.changeContent;

    // Displays the content of the application
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Navbar
          currentUser={currentUser}
          changeContent={changeContent}
        />
        <Content
          contentMain={contentMain}
          currentUser={currentUser}
          changeContent={changeContent}
        />
        {contentModal &&
          <Modal
            contentModal={contentModal}
            changeContent={changeContent}
          />
        }
      </div>
    );
  }
}

export default App;
