import React from "react";
import { auth } from "../firebase";
import "./Navbar.css";
import Login from "./Modal/Login";
import Settings from "./Modal/Settings";
import Vertical from "./Vertical";
import ic_upload from "../svg/ic_upload.svg";
import ic_settings from "../svg/ic_settings.svg";
import ic_exit from "../svg/ic_exit.svg";

function Navbar(props) {
  return (
    <nav className="navbar">
      <a className="navbar-logo unselectable" href="/">
        <h1>SupportPlayer</h1>
        <Vertical />
      </a>
      {props.currentUser ? <NavbarAccount currentUser={props.currentUser} toggleModal={props.toggleModal} /> : <NavbarLogin toggleModal={props.toggleModal} />}
    </nav>
  );
}

function NavbarAccount({ currentUser, toggleModal }) {
  function AccountButton(props) {
    const handleClick = (e) => {
      e.preventDefault();

      props.onClick();
    };

    return (
      <a className="navbar-account-button" href={props.href} title={props.title} onClick={handleClick}>
        <img src={props.src} alt="" />
      </a>
    );
  }

  const handleUpload = () => { };

  const handleSettings = () => {
    toggleModal(<Settings currentUser={currentUser} toggleModal={toggleModal} />);
  };

  const authSignOut = () => {
    auth.signOut().catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="navbar-account">
      <h2 className="navbar-user">{currentUser.email}</h2>
      <div className="navbar-divider"></div>
      <AccountButton href="/upload" src={ic_upload} title="Upload" onClick={handleUpload} />
      <AccountButton href="/settings" src={ic_settings} title="Settings" onClick={handleSettings} />
      <AccountButton href="/logout" src={ic_exit} title="Log out" onClick={authSignOut} />
      <Vertical />
    </div>
  );
}

function NavbarLogin({ toggleModal }) {
  function LoginButton(props) {
    const handleClick = (e) => {
      e.preventDefault();
      toggleModal(<Login index={props.index} toggleModal={toggleModal} />);
    };

    return (
      <a className="navbar-login-button" href={props.href} onClick={handleClick}>
        {props.title}
      </a>
    );
  }

  return (
    <div className="navbar-login">
      <LoginButton href="/login" index={0} title="Log in" />
      <LoginButton href="/register" index={1} title="Sign up" />
    </div>
  );
}

export default Navbar;
