import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// being added back in SAD-005 when I've made it persist - easy fix but wanted to get 004 up to source control first.
const SideMenu = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <nav
      className="navbar is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a
            role="button"
            className={`navbar-burger burger ${isOpen && "is-active"}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setOpen(!isOpen)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${isOpen && "is-active"}`}>
          <div className="navbar-start">
            <NavLink className="navbar-item" activeClassName="is-active" to="/">
              Home
            </NavLink>

            <NavLink
              className="navbar-item"
              to="/RegistrationForm"
            >
              Register
            </NavLink>

          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="interesting-button-to-change">Log in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideMenu;