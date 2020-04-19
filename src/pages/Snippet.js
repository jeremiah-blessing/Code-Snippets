import React, { Component } from "react";
import SnippetLoader from "../components/SnippetLoader";
import { Link } from "react-router-dom";
import "../stylesheets/Snippet.css";
import SureDelete from "../components/SureDelete";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";

import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbarsFinal.css";
import "codemirror/mode/python/python";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import db from "../firestoreInstance";
import { AuthContext } from "../AuthContext";
import jdenticon from "jdenticon/dist/jdenticon.min.js";
import CommentsSection from "../components/CommentsSection";

export default class Snippet extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      language: "",
      mode: "",
      description: "",
      author: null,
      snippetID: "",
      comments: [""],
      title: "",
      userUID: "",
      loading: true,
      deleteDialog: false,
      dontexist: false,
    };
  }
  handleDelete = () => {
    alert("delete");
  };
  handleDeleteDialog = () => {
    this.setState({ deleteDialog: !this.state.deleteDialog });
  };
  componentDidMount() {
    this.handleSnippetLoad();
  }
  componentDidUpdate() {
    jdenticon();
  }
  handleSnippetLoad = async () => {
    const { user, snippetID } = this.props.match.params;
    const snippet = await db
      .collection("users")
      .doc(user)
      .collection("snippets")
      .doc(snippetID)
      .get();
    const displayName = await db.collection("users").doc(user).get();
    if (snippet.exists && displayName.exists) {
      const data = snippet.data();
      this.setState({
        code: data.code,
        language: data.language,
        mode: data.mode,
        description: data.description,
        title: data.title,
        snippetID: snippet.id,
        userUID: data.userUID,
        author: displayName.data().displayName,
        loading: false,
      });
    } else {
      this.setState({ dontexist: true });
    }
  };
  render() {
    if (this.state.dontexist)
      return <h1 className="sde">snippet_doesn't_exist_or_deleted</h1>;
    if (this.state.loading) {
      return <SnippetLoader />;
    }
    const { userDetails } = this.context;
    const editDeleteButton =
      userDetails !== null && userDetails.uid === this.state.userUID ? (
        <>
          <Link
            to={`/edit/${this.state.snippetID}`}
            className="snippet-edit mt-2"
          >
            <span className="sn-bt-text">Edit</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" />
            </svg>
          </Link>
          <button
            className="snippet-delete mt-2"
            onClick={this.handleDeleteDialog}
          >
            <span className="sn-bt-text">Delete</span>
            <svg
              style={{ pointerEvents: "none" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
            </svg>
          </button>
        </>
      ) : (
        ""
      );
    return (
      <div className="snippet">
        {this.state.deleteDialog ? (
          <SureDelete
            handleClose={this.handleDeleteDialog}
            snippetID={this.state.snippetID}
            userUID={this.state.userUID}
          />
        ) : (
          ""
        )}
        <h1 className="heading">{this.state.title}</h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-7 mt-5">
              <CodeMirror
                value={this.state.code}
                options={{
                  value: this.state.code,
                  mode: this.state.mode,
                  theme: "dracula",
                  lineWrapping: true,
                  lineNumbers: true,
                  scrollbarStyle: "simple",
                  readOnly: true,
                }}
                onBeforeChange={(editor, data, code) => {}}
                onChange={(editor, data, value) => {}}
                onSelection={(editor, data) => {}}
              />
              <div className="snippet-buttons mt-2">
                <button className="snippet-language mt-2">
                  {this.state.language}
                </button>
                {editDeleteButton}
                <button className="snippet-share mt-2">
                  <span className="sn-bt-text">Share</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-md-5 mt-5 comments">
              <h3 className="discussion">_discussion_</h3>

              <CommentsSection
                snippetLanguage={this.state.mode}
                isAuth={userDetails !== null ? true : false}
                userDetails={userDetails}
                snippetID={this.state.snippetID}
                userUID={this.state.userUID}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h3 className="description">description</h3>
              <p className="description-content">{this.state.description}</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h3 className="author">Author</h3>
            </div>
          </div>
          <div className="row justify-content-start align-items-center mt-2">
            <div className="col">
              <Link
                to={`/users/${this.state.userUID}`}
                className="snippet-author"
              >
                <div className="identicon">
                  <svg
                    className="identicon-svg"
                    data-jdenticon-value={this.state.author}
                    width="60"
                    height="60"
                  >
                    Fallback text or image for browsers not supporting inline
                    svg.
                  </svg>
                </div>
                <span className="author-name">{this.state.author}</span>
              </Link>
            </div>
          </div>
        </div>{" "}
      </div>
    );
  }
}
