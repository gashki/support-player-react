import React, { Component } from "react";
import { auth } from "./firebase";
import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Modal from "./components/Modal/Modal";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      mainContent: null,
      modalContent: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
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

  toggleModal = (modalContent) => {
    this.setState({
      modalContent: modalContent
    });
  };

  render() {
    return (
      <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
        <Navbar currentUser={this.state.currentUser} toggleModal={this.toggleModal} />
        <Content />
        {this.state.modalContent && <Modal modalContent={this.state.modalContent} toggleModal={this.toggleModal} />}
      </div>
    );
  }
}

export default App;
