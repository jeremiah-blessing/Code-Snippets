import React, { Component } from "react";
import "../stylesheets/AddComment.css";
import db from "../firestoreInstance";
import { AuthContext } from "../AuthContext";
import Swal from "sweetalert2";

export default class AddComment extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { comment: "", buttonText: "Add Comment" };
  }

  handleAreaResize = (e) => {
    e.target.style.height = "";
    e.target.style.height = e.target.scrollHeight + "px";
    this.setState({ comment: e.target.value });
  };
  handleAddComment = () => {
    if (this.state.comment !== "") {
      this.setState({ buttonText: "Adding.." });
      const { userDetails } = this.context;
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
        .collection("comments")
        .add({ comment: this.state.comment, userUID: userDetails.uid })
        .then(() => {
          this.setState({ comment: "", buttonText: "Add Comment" });
          this.props.fetchComments();
          Toast.fire({
            icon: "success",
            title: `Comment added!`,
          });
        })
        .catch((error) => {
          console.log(error.message);
          Toast.fire({
            icon: "error",
            title: error.message,
          });
        });
    }
  };
  render() {
    return (
      <div className="add-comment mt-4">
        <textarea
          data-sample="code"
          name="comment"
          id="add-comment"
          rows="5"
          onChange={this.handleAreaResize}
          value={this.state.comment}
        ></textarea>
        <span className="code-guide">
          Use &lt;code&gt;&lt;/code&gt; tags for inserting code.
        </span>
        <button
          onClick={this.handleAddComment}
          className="mt-3"
          id="submit-comment"
        >
          {this.state.buttonText}
        </button>
      </div>
    );
  }
}
