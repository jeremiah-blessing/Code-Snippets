import React, { Component } from "react";
import "../stylesheets/Newsnippet.css";

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
// import "codemirror/mode/clike/clike";
// Import Firestore
import db from "../firestoreInstance";
// Context
import { AuthContext } from "../AuthContext";
// React Router Dom
import { Redirect } from "react-router-dom";
// Swal
import Swal from "sweetalert2";

import LanguageSelector from "../components/LanguageSelector";
// End Import

export default class Newsnippet extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      code: "",
      description: "",
      language: "Python",
      mode: "python",
      saveComplete: false,
      buttonText: "saveSnippet",
    };
    this.handleInputchange = this.handleInputchange.bind(this);
    this.handeleTextarea = this.handeleTextarea.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleAddSnippet = this.handleAddSnippet.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.instance = null;
  }
  handleLanguageChange(details) {
    this.setState({ language: details.language, mode: details.mode });
  }
  handleInputchange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handeleTextarea(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    this.setState({ [e.target.name]: e.target.value }, () => {});
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
    const { userDetails } = this.context;
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
        },
      });
    } else {
      this.setState({ buttonText: "saving.." });
      let s = this.state;
      db.collection("users")
        .doc(userDetails.uid)
        .collection("snippets")
        .add({
          title: s.title,
          code: s.code,
          mode: s.mode,
          description: s.description,
          language: s.language,
          userUID: userDetails.uid,
          created: new Date().toString(),
        })
        .then(() => {
          this.setState({ buttonText: "saved!" });
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
            customClass: { title: "SwalOwnText" },
          });

          Toast.fire({
            icon: "success",
            title: "Snippet Saved!",
          }).then(() => {
            this.setState({ saveComplete: true });
          });
        });
    }
  }

  render() {
    if (this.state.saveComplete) {
      return <Redirect to="/my-snippets" />;
    }
    return (
      <div className="newsnippet">
        <h1 className="heading">
          new_snippet
          <svg
            className="page-icon"
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
              d="M44.926,16.982v3.989L29.951,28.359V24.185l10.558-5.21L29.951,13.753V9.591l14.975,7.39Zm-29.951,7.2L4.418,18.975l10.558-5.223V9.591L0,16.982v3.989l14.975,7.388V24.185ZM28.167,4h-3.89L16.769,33.951h3.88L28.167,4Z"
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
        </h1>
        <div className="container-fluid p-0">
          <div className="title-group row">
            <label className="col-12" htmlFor="title">
              Title
              <span className="optional"> &lt;required&gt;</span>
            </label>
            <div className="col-12 col-md-6">
              <input
                name="title"
                type="text"
                id="title"
                onChange={this.handleInputchange}
              />
            </div>
          </div>
          <div className="select-language-group row justify-content-start">
            <div className="col-auto lang-sel">
              <label htmlFor="select-language" style={{ marginRight: "10px" }}>
                select_language :{" "}
              </label>
              <LanguageSelector
                handleLanguageChange={this.handleLanguageChange}
              />
            </div>
            <div className="col"></div>
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
                  autofocus: false,
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
