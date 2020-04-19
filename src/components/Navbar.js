import React, { Component } from "react";
import "../stylesheets/Navbar.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import jdenticon from "jdenticon/dist/jdenticon.min.js";

export default class Navbar extends Component {
  static contextType = AuthContext;
  componentDidMount() {
    jdenticon.config = {
      hues: [191],
      lightness: {
        color: [0.63, 1.0],
        grayscale: [0.63, 1.0],
      },
      saturation: {
        color: 1.0,
        grayscale: 1.0,
      },
      backColor: "#275373ff",
    };
    jdenticon();
  }
  componentDidUpdate() {
    jdenticon();
  }

  render() {
    const { userDetails } = this.context;
    var dn = "login_to_view";
    var dnForIdenticon = null;
    if (userDetails !== null && userDetails !== undefined) {
      dnForIdenticon = userDetails.displayName + "";
      dn = (userDetails.displayName + "").split(" ").join("_").toLowerCase();
    }
    return (
      <nav className="navbar">
        <ul>
          <li className="logo">
            <NavLink exact to="/" activeClassName="nav-selected">
              <span className="link-text">
                <span style={{ color: "#ffffff" }}>&lt;</span>
                <span style={{ color: "#3B7DAD" }}>code</span>
                <span style={{ color: "#ffffff" }}>_</span>
                <span style={{ color: "#9EFFFF" }}>snippets</span>
                <span style={{ color: "#ffffff" }}>&gt;</span>
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-new" activeClassName="nav-selected">
              <svg
                className="nav-icon"
                id="Add_New"
                data-name="Add New"
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
              >
                <circle
                  id="Ellipse_BG"
                  data-name="Ellipse BG"
                  cx="40"
                  cy="40"
                  r="40"
                  fill="#275373"
                />
                <path
                  id="Main_Path"
                  data-name="Main Path"
                  d="M44.926,16.982c2.475,1.28,1.94,2.683,0,3.989s-14.975,7.388-14.975,7.388V24.185l10.558-5.21L29.951,13.753V9.591s12.5,6.11,14.975,7.39Zm-29.951,7.2L4.418,18.975l10.558-5.223V9.591S2.513,15.621,0,16.982s-2.121,2.687,0,3.989,14.975,7.388,14.975,7.388V24.185ZM28.167,4c.3-1.313-3.631-1.036-3.89,0s-7.33,29.295-7.508,29.951,3.726.538,3.88,0S27.871,5.313,28.167,4Z"
                  transform="translate(18 22)"
                  fill="#9effff"
                />
                <line
                  id="Line_1"
                  data-name="Line 1"
                  y2="8"
                  transform="translate(56.5 18.5)"
                  fill="none"
                  stroke="#9effff"
                  strokeWidth="2"
                />
                <line
                  id="Add_2"
                  data-name="Add 2"
                  y2="8"
                  transform="translate(60.5 22.5) rotate(90)"
                  fill="none"
                  stroke="#9effff"
                  strokeWidth="2"
                />
              </svg>

              <span className="link-text">create_new_snippet</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-snippets" activeClassName="nav-selected">
              <svg
                className="nav-icon"
                id="snippets"
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
              >
                <circle
                  id="Ellipse_BG"
                  data-name="Ellipse BG"
                  cx="40"
                  cy="40"
                  r="40"
                  fill="#275373"
                />
                <path
                  id="Main_Path"
                  data-name="Main Path"
                  d="M0,16V37H42V16ZM38.5,33.5H3.5v-14h35ZM0,12.5V2H12.25c2.966,3.4,4.149,5.25,7,5.25H42V12.5H38.5V10.75H19.25c-4.1,0-6.19-2.429-8.6-5.25H3.5v7Z"
                  transform="translate(19 21)"
                  fill="#9effff"
                />
              </svg>
              <span className="link-text">my_snippets</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" activeClassName="nav-selected">
              <svg
                className="nav-icon"
                id="Notifications"
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
              >
                <circle
                  id="Ellipse_BG"
                  data-name="Ellipse BG"
                  cx="40"
                  cy="40"
                  r="40"
                  fill="#275373"
                />
                <path
                  className={
                    this.props.noOfNotifications !== null &&
                    this.props.noOfNotifications !== undefined &&
                    this.props.noOfNotifications > 0
                      ? "n-bell"
                      : ""
                  }
                  id="Main_Path"
                  data-name="Main Path"
                  d="M18.849,38.5a6.038,6.038,0,0,1-4.239,1.75,5.92,5.92,0,0,1-4.158-1.708,6.2,6.2,0,0,1-.042-8.481Zm19-38.5a4.234,4.234,0,0,0-3,1.244l0,.005a4.176,4.176,0,0,1-4.025,1.1C20.451-.408,11.557,16.032,2.459,11.41L0,13.871,28.131,42l2.457-2.461c-4.622-9.095,11.823-17.99,9.063-28.368a4.179,4.179,0,0,1,1.1-4.022l0-.005a4.237,4.237,0,0,0,1.248-3A4.138,4.138,0,0,0,37.853,0ZM31.764,23.525c-3.545,5.175-4.776,7.408-5.495,11.669L6.8,15.726l.922-.154c3.915-.655,7.546-3.141,10.752-5.336,3.871-2.653,7.88-5.464,11.452-4.506a8.832,8.832,0,0,1,6.342,6.342C37.209,15.589,34.564,19.444,31.764,23.525ZM39.382,5.432a1.989,1.989,0,1,1,0-2.814A1.991,1.991,0,0,1,39.382,5.432Z"
                  transform="translate(17 19)"
                  fill="#76ffff"
                />
              </svg>

              <span className="link-text">notifications</span>
              <span className="link-text n-tag">
                {this.props.noOfNotifications || ""}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" activeClassName="nav-selected">
              <svg
                className="nav-icon"
                id="Search"
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
              >
                <circle
                  id="Ellipse_BG"
                  data-name="Ellipse BG"
                  cx="40"
                  cy="40"
                  r="40"
                  fill="#275373"
                />
                <path
                  id="Main_Path"
                  data-name="Main Path"
                  d="M36.138,32.855,26.72,23.437A14.777,14.777,0,1,0,23.1,26.96l9.468,9.468ZM4.332,14.769A10.438,10.438,0,1,1,14.77,25.207,10.45,10.45,0,0,1,4.332,14.769Z"
                  transform="translate(22 22)"
                  fill="#9effff"
                />
              </svg>

              <span className="link-text">search</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-profile" activeClassName="nav-selected">
              <div className="identicon">
                <svg
                  className="identicon-svg"
                  data-jdenticon-value={dnForIdenticon}
                  width="60"
                  height="60"
                >
                  Fallback text or image for browsers not supporting inline svg.
                </svg>
              </div>
              <span className="link-text">
                {dn.length > 15 ? dn.substr(0, 15) + ".." : dn}
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}
