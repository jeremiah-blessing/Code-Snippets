import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../stylesheets/Newsnippet.css";
import SnippetLoader from "../components/SnippetLoader";
// Import Code Mirror Utitilies
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
// Add-ons
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbarsFinal.css";
// Individual Languages
import "codemirror/mode/python/python";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
// Import Firestore
import db from "../firestoreInstance";
import { AuthContext } from "../AuthContext";
import Swal from "sweetalert2";
// End Import

export default class Editsnippet extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      code: "",
      description: "",
      language: "",
      mode: "",
      snippetID: "",
      loading: true,
      buttonText: "saveChanges",
      edited: false,
    };
    this.handleInputchange = this.handleInputchange.bind(this);
    this.handeleTextarea = this.handeleTextarea.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleAddSnippet = this.handleAddSnippet.bind(this);
    this.instance = null;
  }

  handleInputchange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handeleTextarea(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    this.setState({ [e.target.name]: e.target.value }, () => {});
  }
  componentDidMount() {
    const { userDetails } = this.context;
    const snippetID = this.props.match.params.snippetID;
    db.collection("users")
      .doc(userDetails.uid)
      .collection("snippets")
      .doc(snippetID)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        this.setState({
          code: data.code,
          description: data.description,
          language: data.language,
          mode: data.mode,
          title: data.title,
          loading: false,
          snippetID: snapshot.id,
        });
      });
  }
  handleValidation() {
    let errorMessages = [];
    if (this.state.code === "") errorMessages.push("Code");
    if (this.state.title === "") errorMessages.push("Title");
    if (errorMessages.length === 2) {
      return "Code and Title can't be empty";
    } else if (errorMessages.length === 1) {
      return `${errorMessages[0]} can't be empty`;
    } else return false;
  }
  handleAddSnippet() {
    // Check for validation
    const errorMessage = this.handleValidation();
    if (errorMessage) {
      Swal.fire({
        icon: "warning",
        title: "Oopsie",
        text: errorMessage,
        customClass: {
          title: "SwalOwnTitle",
          content: "SwalOwnText",
          popup: "SwalOwnPopup",
        },
      });
    } else {
      this.setState({ buttonText: "saving.." });
      let s = this.state;
      const { userDetails } = this.context;
      db.collection("users")
        .doc(userDetails.uid)
        .collection("snippets")
        .doc(this.state.snippetID)
        .update({
          title: s.title,
          code: s.code,
          description: s.description,
        })
        .then(() => {
          this.setState({ buttonText: "saved", edited: true });
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2200,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
            customClass: { title: "SwalOwnText" },
          });

          Toast.fire({
            icon: "success",
            title: "Changes saved!",
          });
        });
    }
  }

  render() {
    const { userDetails } = this.context;
    if (this.state.edited) {
      return (
        <Redirect
          to={`/users/${userDetails.uid}/snippets/${this.state.snippetID}`}
        />
      );
    }
    if (this.state.loading) {
      return (
        <div className="newsnippet">
          <h1 className="heading">
            edit_snippet
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" />
            </svg>
          </h1>
          <SnippetLoader />
        </div>
      );
    }
    return (
      <div className="newsnippet">
        <h1 className="heading">
          edit_snippet
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" />
          </svg>
        </h1>
        <div className="container-fluid p-0">
          <div className="title-group row">
            <label className="col-12" htmlFor="title">
              Title<span className="optional"> &lt;required&gt;</span>
            </label>
            <div className="col-12 col-md-6">
              <input
                name="title"
                type="text"
                id="title"
                onChange={this.handleInputchange}
                value={this.state.title}
              />
            </div>
          </div>
          <div className="select-language-group row">
            <div className="col">
              <label htmlFor="select-language">
                language : {this.state.language}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 mt-5">
              <CodeMirror
                value={this.state.code}
                options={{
                  mode: this.state.mode,
                  theme: "dracula",
                  lineWrapping: true,
                  lineNumbers: true,
                  autoCloseBrackets: true,
                  scrollbarStyle: "simple",
                  matchBrackets: true,
                  autoCloseTags: true,
                  autofocus: true,
                }}
                onBeforeChange={(editor, data, code) => {
                  this.setState({ code });
                }}
                onChange={(editor, data, value) => {}}
                onSelection={(editor, data) => {}}
                editorDidMount={(editor) => {
                  this.instance = editor;
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col mt-5">
              <label className="desc-label" htmlFor="description">
                description <span className="optional">&lt;optional&gt;</span>
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col mt-3">
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="5"
                onChange={this.handleInputchange}
                value={this.state.description}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col mt-5">
              <button className="saveBtn" onClick={this.handleAddSnippet}>
                {this.state.buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M15.003 3h2.997v5h-2.997v-5zm8.997 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
