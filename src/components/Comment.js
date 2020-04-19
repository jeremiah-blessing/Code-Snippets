import React, { Component } from "react";
import "../stylesheets/Comment.css";
import { AuthContext } from "../AuthContext";
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
import jdenticon from "jdenticon/dist/jdenticon.min.js";
import db from "../firestoreInstance";
export default class Comment extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      deletState: false,
      finalComment: <span></span>,
      commentedUserName: null,
    };
  }
  componentDidMount() {
    jdenticon.config = {
      hues: [191],
      lightness: {
        color: [0.63, 1.0],
        grayscale: [0.63, 1.0],
      },
      saturation: {
        color: 1.0,
        grayscale: 1.0,
      },
      backColor: "#275373ff",
    };
    this.displayComment().then(() => {
      jdenticon();
    });
  }
  componentDidUpdate() {
    jdenticon();
  }
  displayComment = async () => {
    const toGetUserName = await db
      .collection("users")
      .doc(this.props.userUID)
      .get();
    var finalComment = [],
      remainingComment = this.props.comment,
      reachedEnd = false;
    while (reachedEnd !== true) {
      let startCodeIndex = remainingComment.indexOf("<code>");
      if (startCodeIndex !== -1) {
        finalComment.push(
          <span key={startCodeIndex}>
            {remainingComment.substr(0, startCodeIndex)}
          </span>
        );
        remainingComment = remainingComment.substr(
          startCodeIndex,
          remainingComment.length
        );
        let finalCodeIndex = remainingComment.indexOf("</code>");
        if (finalCodeIndex !== -1) {
          let codemirrorI = (
            <CodeMirror
              key={Math.random()}
              value={remainingComment.substring(6, finalCodeIndex)}
              options={{
                mode: this.props.snippetLanguage,
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
          );
          finalComment.push(codemirrorI);
          remainingComment = remainingComment.substring(
            finalCodeIndex + 7,
            remainingComment.length
          );
        } else {
          finalComment.push(
            <span key={finalCodeIndex}>{remainingComment}</span>
          );
          reachedEnd = true;
        }
      } else {
        finalComment.push(<span key={Math.random()}>{remainingComment}</span>);
        reachedEnd = true;
      }
    }
    this.setState({
      finalComment: finalComment,
      commentedUserName: toGetUserName.data().displayName,
    });
  };
  render() {
    var commentorName = null;
    if (this.state.commentedUserName !== null)
      commentorName = (this.state.commentedUserName + "")
        .split(" ")
        .join("_")
        .substring(0, 9);
    const { isSignedIn, userDetails } = this.context;
    return (
      <div
        className={
          this.state.deletState
            ? "indi-comment mt-4 delete-state"
            : "indi-comment mt-4"
        }
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-3 user-profile">
              <svg
                className="identicon-svg"
                data-jdenticon-value={this.state.commentedUserName}
                width="60"
                height="60"
              >
                Fallback text or image for browsers not supporting inline svg.
              </svg>
              <span className="user-profile-name">{commentorName}</span>
            </div>
            <div className="col-9 comment-text">{this.state.finalComment}</div>
          </div>
        </div>
        {isSignedIn &&
        (userDetails.uid === this.props.userUID ||
          this.props.thissnippetUserUID === userDetails.uid) ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="comment-delete"
            onClick={() => {
              this.props.handleDelete(this.props.commentID);
              this.setState({ deletState: true });
            }}
          >
            <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
          </svg>
        ) : (
          ""
        )}
      </div>
    );
  }
}
