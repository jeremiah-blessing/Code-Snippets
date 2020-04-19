import React, { Component } from "react";
import "../stylesheets/welcome.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
export default class Welcome extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      loginDialog: false,
    };
  }
  render() {
    const { isSignedIn } = this.context;
    return (
      <div className="welcome">
        <h1 className="welcome-head">&lt;code_snippets&gt;</h1>
        <h3 className="welcome-subhead wsh">
          <span>code</span> | <span>share</span> | <span>discuss</span> |{" "}
          <span>improve</span>
        </h3>
        <div className="welcome-buttons">
          {isSignedIn ? (
            <Link to="/my-profile" className="w-b">
              profile
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.218 19l-1.782-1.75 5.25-5.25-5.25-5.25 1.782-1.75 6.968 7-6.968 7z" />
              </svg>
            </Link>
          ) : (
            <Link to="/login" className="w-b">
              logIn
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    );
  }
}
