import React, { Component } from "react";
import "../stylesheets/Snippetpreview.css";
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

import DeleteDialog from "../components/SureDelete";

import { Link } from "react-router-dom";

export default class Snippetpreview extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", delete_dialog: false };
  }
  static defaultProps = {
    title: "The react bootstrap",
    language: "python",
    code: "def apple(): \n\tprint('This is a apple function')",
    date: "March 20, 2020",
    snippetID: "usquy2",
    userUID: null,
    userSnippet: false,
  };
  handleDeleteDialog = (e) => {
    this.setState({ delete_dialog: !this.state.delete_dialog });
  };

  render() {
    const deleteDialog = this.state.delete_dialog ? (
      <DeleteDialog handleClose={this.handleDeleteDialog} />
    ) : (
      ""
    );

    return (
      <Link
        to={`/users/${this.props.userUID}/snippets/${this.props.snippetID}`}
        className="col-12 col-md-5 snippet-preview mt-3 mt-md-5 ml-1 mr-1 ml-md-auto mr-md-auto"
      >
        {deleteDialog}
        <h2 className="snippet-name">{this.props.title}</h2>
        <div className="snippet-code">
          <CodeMirror
            value={this.props.code}
            options={{
              value: this.props.code,
              mode: this.props.mode,
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
        </div>
        <div className="snippet-buttons mt-2 mb-3">
          <button className="snippet-language mt-2">
            {this.props.language}
          </button>
        </div>
        <h3 className="snippet-date">
          {this.props.created.substring(4, 15).split(" ").join("_")}
        </h3>
      </Link>
    );
  }
}
