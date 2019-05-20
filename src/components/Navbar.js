import React from "react";
import { auth } from "../firebase";
import "./Navbar.css";

// React components
import Login from "./Modal/Login";
import Settings from "./Modal/Settings";
import { SvgExit, SvgSettings, SvgUpload } from "./SvgIcons";
import Vertical from "./Vertical";


// The navigation bar at the top of each page
function Navbar({ currentUser, changeContent }) {
  return (
    <nav className="navbar">
      <a className="navbar-logo unselectable" href="/">
        <h1>SupportPlayer</h1>
        <Vertical />
      </a>
      {currentUser
        ? <NavbarAccount currentUser={currentUser} changeContent={changeContent} />
        : <NavbarLogin changeContent={changeContent} />
      }
    </nav>
  );
}


// The user account section of the navigation bar
function NavbarAccount({ currentUser, changeContent }) {
  // Returns an SVG button used in the user account section
  function AccountButton({ svg, href, title, onClick }) {
    const handleClick = (e) => {
      e.preventDefault();
      onClick();
    };

    // The attributes for the SVG button
    const attributes = { href: href, title: title, onClick: handleClick };

    return (
      <a className="navbar-account-button" {...attributes}>{svg}</a>
    );
  }

  // Opens the upload page
  const handleUpload = () => {
    changeContent("contentMain", { "type": "upload" });
  };

  // Opens the user settings modal
  const handleSettings = () => {
    changeContent("contentModal",
      <Settings currentUser={currentUser} changeContent={changeContent} />
    );
  };

  // Signs out the user
  const authSignOut = () => {
    auth.signOut().catch((error) => {
      console.log(error);
    });
  };

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
      <Vertical />
    </div>
  );
}


// The login section of the navigation bar
function NavbarLogin({ changeContent }) {
  // Returns a text button used for opening the login modal
  function LoginButton({ index, href, title }) {
    const handleClick = (e) => {
      e.preventDefault();

      // Opens the login modal
      changeContent("contentModal",
        <Login index={index} changeContent={changeContent} />
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
