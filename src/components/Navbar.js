import React from "react";
import { auth } from "../firebase";
import "./Navbar.css";

// React components
import Login from "./Modal/Login";
import Settings from "./Modal/Settings";
import { SvgExit, SvgSettings, SvgUpload } from "./SvgIcons";


// The navigation bar at the top of each page
function Navbar({ currentUser, changeState }) {
  // Resets the content for the home button
  const handleClick = (e) => {
    e.preventDefault();
    changeState("contentMain", { type: "NadeList", state: null }, "/");
  };

  return (
    <nav className="navbar">
      <a className="navbar-logo unselectable" href="/" title="Support Player" onClick={handleClick}>
        <h1>SupportPlayer</h1>
      </a>
      {currentUser
        ? <NavbarAccount currentUser={currentUser} changeState={changeState} />
        : <NavbarLogin changeState={changeState} />
      }
    </nav>
  );
}


// The user account section of the navigation bar
function NavbarAccount({ currentUser, changeState }) {
  // Returns an SVG button used in the user account section
  function AccountButton({ svg, href, title, onClick }) {
    const handleClick = (e) => {
      e.preventDefault();
      onClick();
    };

    // The attributes for the SVG button
    const attributes = { href, title, onClick: handleClick };

    return (
      <a className="navbar-account-button" {...attributes}>{svg}</a>
    );
  }

  // Opens the upload page
  const handleUpload = () => {
    changeState("contentMain", { type: "Upload", state: null }, "/upload");
  };

  // Opens the user settings modal
  const handleSettings = () => {
    changeState("contentModal",
      <Settings currentUser={currentUser} changeState={changeState} />
    );
  };

  // Signs out the user
  const authSignOut = () => auth.signOut().catch(error => console.log(error));

  return (
    <div className="navbar-account">
      <h2 className="navbar-user">{currentUser.email}</h2>
      <div className="navbar-divider"></div>
      <AccountButton
        svg={<SvgUpload color="#f5f5f5" />}
        href="/upload"
        title="Upload"
        onClick={handleUpload}
      />
      <AccountButton
        svg={<SvgSettings color="#f5f5f5" />}
        href="/settings"
        title="Settings"
        onClick={handleSettings}
      />
      <AccountButton
        svg={<SvgExit color="#f5f5f5" />}
        href="/logout"
        title="Log out"
        onClick={authSignOut}
      />
    </div>
  );
}


// The login section of the navigation bar
function NavbarLogin({ changeState }) {
  // Returns a text button used for opening the login modal
  function LoginButton({ index, href, title }) {
    const handleClick = (e) => {
      e.preventDefault();

      // Opens the login modal
      changeState("contentModal",
        <Login index={index} changeState={changeState} />
      );
    };

    return (
      <a className="navbar-login-button" href={href} onClick={handleClick}>
        {title}
      </a>
    );
  }

  return (
    <div className="navbar-login">
      <LoginButton index={0} href="/login" title="Log in" />
      <LoginButton index={1} href="/register" title="Sign up" />
    </div>
  );
}


export default Navbar;
