import React, { Component } from "react";
import "../stylesheets/Publicprofile.css";
import db from "../firestoreInstance";
import jdenticon from "jdenticon/dist/jdenticon.min.js";
import SnippetLoader from "../components/SnippetLoader";
import Snippetpreview from "../components/Snippetpreview";
export default class Publicprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: null,
      userUID: "",
      currentSnippets: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.getSnippetDetails();
    jdenticon();
  }
  componentDidUpdate() {
    jdenticon();
  }
  getSnippetDetails = async () => {
    const snippets = await db
      .collection("users")
      .doc(this.props.match.params.user)
      .collection("snippets")
      .get();
    const userDetails = await db
      .collection("users")
      .doc(this.props.match.params.user)
      .get();
    var finalSnapshot = [];
    snippets.forEach((snap) => {
      finalSnapshot.push({ snippetID: snap.id, ...snap.data() });
    });
    this.setState({
      currentSnippets: finalSnapshot,
      loading: false,
      displayName: userDetails.data().displayName,
      userUID: userDetails.data().uid,
    });
  };
  render() {
    if (this.state.loading) return <SnippetLoader />;
    const allSnippets = this.state.currentSnippets.map((currentSnippet) => (
      <Snippetpreview
        {...currentSnippet}
        userSnippet={false}
        key={currentSnippet.snippetID}
      />
    ));
    return (
      <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="identicon-pp col-12">
            <svg
              data-jdenticon-value={this.state.displayName}
              width="120"
              height="120"
            >
              Fallback text or image for browsers not supporting inline svg.
            </svg>
          </div>
          <h1 className="col-12 displayName-pp">{this.state.displayName}</h1>
        </div>

        <div className="my-snippets">
          <h1 className="heading">
            snippets
            <svg
              className="page-icon"
              id="snippets"
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
                d="M0,16V37H42V16ZM38.5,33.5H3.5v-14h35ZM0,12.5V2H12.25c2.966,3.4,4.149,5.25,7,5.25H42V12.5H38.5V10.75H19.25c-4.1,0-6.19-2.429-8.6-5.25H3.5v7Z"
                transform="translate(19 21)"
                fill="#9effff"
              />
            </svg>
          </h1>
          {!this.state.loading && this.state.currentSnippets.length === 0 ? (
            <h1 className="sde">&lt;empty&gt;</h1>
          ) : (
            ""
          )}
          <div className="container-fluid">
            <div className="row justify-content-between">{allSnippets}</div>
          </div>
        </div>
      </div>
    );
  }
}
