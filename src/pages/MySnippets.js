import React, { Component } from "react";
import Snippetpreview from "../components/Snippetpreview";
import "../stylesheets/MySnippets.css";
import Loader from "../components/Loader";
import db from "../firestoreInstance";
import { AuthContext } from "../AuthContext";

export default class MySnippets extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { loading: true, pageNo: 1, currentSnippets: [] };
  }
  componentDidMount() {
    const { userDetails } = this.context;
    db.collection("users")
      .doc(userDetails.uid)
      .collection("snippets")
      .get()
      .then((snapshot) => {
        let finalSnapshot = [];
        snapshot.forEach((snap) => {
          finalSnapshot.push({ snippetID: snap.id, ...snap.data() });
        });
        this.setState({ currentSnippets: finalSnapshot, loading: false });
      });
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="my-snippets">
          <h1 className="heading">
            my_snippets
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
          <Loader />
        </div>
      );
    }
    const allSnippets = this.state.currentSnippets.map((currentSnippet) => (
      <Snippetpreview
        {...currentSnippet}
        userSnippet={true}
        key={currentSnippet.snippetID}
      />
    ));
    return (
      <div className="my-snippets">
        <h1 className="heading">
          my_snippets
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
    );
  }
}
