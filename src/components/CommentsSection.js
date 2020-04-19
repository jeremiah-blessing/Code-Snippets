import React, { Component } from "react";
import Comment from "./Comment";
import AddComment from "./AddComment";
import db from "../firestoreInstance";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default class CommentsSection extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: [], loading: true };
  }
  handleDelete = (commentID) => {
    db.collection("users")
      .doc(this.props.userUID)
      .collection("snippets")
      .doc(this.props.snippetID)
      .collection("comments")
      .doc(commentID)
      .delete()
      .then(() => {
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
        Toast.fire({
          icon: "success",
          title: "Comment deleted!",
        });
        this.fetchComments();
      });
  };
  componentDidMount() {
    this.fetchComments();
  }
  fetchComments = () => {
    db.collection("users")
      .doc(this.props.userUID)
      .collection("snippets")
      .doc(this.props.snippetID)
      .collection("comments")
      .get()
      .then((snapshot) => {
        let comments = [];
        snapshot.forEach((snap) => {
          comments.push({ ...snap.data(), commentID: snap.id });
        });
        this.setState({ comments: comments, loading: false });
      });
  };
  render() {
    if (this.state.loading) {
      return (
        <h3 style={{ color: "#275373" }} className="comment-loading">
          Loading..
        </h3>
      );
    }
    return (
      <div
        className={
          this.props.isAuth ? "comments-container" : "comments-container sitcc"
        }
      >
        {this.state.comments.map((comment) => (
          <Comment
            snippetLanguage={this.props.snippetLanguage}
            thissnippetUserUID={this.props.userUID}
            {...comment}
            key={comment.commentID}
            handleDelete={this.handleDelete}
          />
        ))}
        {this.props.isAuth ? (
          <AddComment
            userUID={this.props.userUID}
            snippetID={this.props.snippetID}
            fetchComments={this.fetchComments}
          />
        ) : (
          <Link to="/login" className="sitc">
            Sign in to Comment
          </Link>
        )}
      </div>
    );
  }
}
