import React, { Component } from "react";
import "../stylesheets/SureDelete.css";
import db from "../firestoreInstance";
import Swal from "sweetalert2";
import { Redirect } from "react-router-dom";
export default class SureDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      canExit: true,
      deleteMessage: "Deleting...",
      deleted: false,
    };
  }

  handleOut = (e) => {
    e.stopPropagation();
    if (
      (e.target.id === "sure-delete" || e.target.name === "sure-delete") &&
      this.state.canExit
    ) {
      this.props.handleClose();
    }
  };
  handleYes = (e) => {
    e.stopPropagation();
    this.setState({ deleting: !this.state.deleting, canExit: false });
    //   FIREBASE FUNCTION HERE
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
      customClass: { title: "SwalOwnText" },
    });

    db.collection("users")
      .doc(this.props.userUID)
      .collection("snippets")
      .doc(this.props.snippetID)
      .delete()
      .then(() => {
        Toast.fire({
          icon: "success",
          title: "Snippet deleted!",
        });
        this.setState({ deleted: true });
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: error.message,
        });
      });
  };
  render() {
    if (this.state.deleted) {
      return <Redirect to="/my-snippets" />;
    }
    return (
      <div id="sure-delete" onClick={this.handleOut}>
        <div id="sure-delete-in">
          <h3 className={this.state.deleting ? "sd-hide" : ""}>
            Are you sure?
          </h3>
          <div className={this.state.deleting ? "sd-hide" : "sd-buttons"}>
            <button
              name="sure-delete"
              className="sd-no"
              onClick={this.handleOut}
            >
              No
            </button>
            <button className="sd-yes" onClick={this.handleYes}>
              Delete
            </button>
          </div>
          <h4 className={this.state.deleting ? "delete-message" : "sd-hide"}>
            {this.state.deleteMessage}
          </h4>
        </div>
      </div>
    );
  }
}
