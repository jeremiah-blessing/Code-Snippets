import React, { Component } from "react";
import "../stylesheets/Notifications.css";
import Notification from "../components/Notification";
import fetchNotifications from "../components/fetchNotifications";

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [], loaded: false };
  }
  componentDidMount() {
    this.retrieveNotifications(this.props.uid);
    setTimeout(() => {
      this.props.resetNotification();
    }, 4500);
  }
  retrieveNotifications = async (uid) => {
    let x = await fetchNotifications(uid);
    this.setState({ notifications: x, loaded: true });
  };
  render() {
    return (
      <div className="notifications">
        <h1 className="heading">
          notifications
          <svg
            className="page-icon"
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
              id="Main_Path"
              data-name="Main Path"
              d="M18.849,38.5a6.038,6.038,0,0,1-4.239,1.75,5.92,5.92,0,0,1-4.158-1.708,6.2,6.2,0,0,1-.042-8.481Zm19-38.5a4.234,4.234,0,0,0-3,1.244l0,.005a4.176,4.176,0,0,1-4.025,1.1C20.451-.408,11.557,16.032,2.459,11.41L0,13.871,28.131,42l2.457-2.461c-4.622-9.095,11.823-17.99,9.063-28.368a4.179,4.179,0,0,1,1.1-4.022l0-.005a4.237,4.237,0,0,0,1.248-3A4.138,4.138,0,0,0,37.853,0ZM31.764,23.525c-3.545,5.175-4.776,7.408-5.495,11.669L6.8,15.726l.922-.154c3.915-.655,7.546-3.141,10.752-5.336,3.871-2.653,7.88-5.464,11.452-4.506a8.832,8.832,0,0,1,6.342,6.342C37.209,15.589,34.564,19.444,31.764,23.525ZM39.382,5.432a1.989,1.989,0,1,1,0-2.814A1.991,1.991,0,0,1,39.382,5.432Z"
              transform="translate(17 19)"
              fill="#76ffff"
            />
          </svg>
        </h1>
        {this.state.loaded && this.state.notifications.length === 0 ? (
          <h1 className="sde">&lt;empty&gt;</h1>
        ) : (
          ""
        )}

        {this.state.notifications.map((notification, index) => (
          <Notification {...notification} key={index} />
        ))}
      </div>
    );
  }
}
