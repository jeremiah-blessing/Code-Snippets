import "../stylesheets/Notification.css";
import db from "../firestoreInstance";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import jdenticon from "jdenticon/dist/jdenticon.min.js";

export default class Notification extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      commentorName: "",
      snippetName: "",
      snippetLink: "",
      loading: true,
      errorMessage: "",
    };
  }
  componentDidMount() {
    this.getNotificationDetails(this.props);
  }
  componentDidUpdate() {
    jdenticon();
  }
  getNotificationDetails = async (props) => {
    const { userDetails } = this.context;
    const userSnap = await db
      .collection("users")
      .doc(props.commentedUserUID)
      .get();
    const snippetSnap = await db
      .collection("users")
      .doc(userDetails.uid)
      .collection("snippets")
      .doc(props.yourSnippetID)
      .get();

    if (snippetSnap.exists) {
      this.setState(
        {
          commentorName: userSnap.data().displayName,
          snippetName: snippetSnap.data().title,
          snippetLink: `/users/${snippetSnap.data().userUID}/snippets/${
            snippetSnap.id
          }`,
          loading: false,
        }
        // Add a method to change this notification read to true
      );
      db.collection("users")
        .doc(userDetails.uid)
        .collection("notifications")
        .doc(this.props.notificationID)
        .update({ read: true });
    } else {
      this.setState({
        loading: false,
        errorMessage: "[your snippet is deleted]",
      });
      db.collection("users")
        .doc(userDetails.uid)
        .collection("notifications")
        .doc(this.props.notificationID)
        .delete();
    }

    // See for deletion of the snippet/user
    // If anything is yes remove the notification then
  };
  render() {
    if (this.state.loading) {
      return (
        <div className="wrapper mt-3 col-md-8">
          <div className="wrap-row">
            <div className="br animate wrap-head"></div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={
          this.props.read
            ? "notification mt-3 col-md-8 noti-read"
            : "notification mt-3 col-md-8"
        }
      >
        {this.state.errorMessage !== "" ? (
          <p className="notification-msg">{this.state.errorMessage}</p>
        ) : (
          <>
            <div className="noti-identicon">
              <svg
                className="identicon-svg"
                data-jdenticon-value={this.state.commentorName}
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
              ></svg>
            </div>
            <p className="notification-msg">
              <Link to={`/users/${this.props.commentedUserUID}`}>
                {this.state.commentorName}
              </Link>
              <span className="com-on"> commented on </span>
              <Link to={this.state.snippetLink}>{this.state.snippetName}</Link>
            </p>
          </>
        )}
      </div>
    );
  }
}
