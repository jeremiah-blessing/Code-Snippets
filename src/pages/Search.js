import React, { Component } from "react";
import "../stylesheets/Search.css";
import db from "../firestoreInstance";
import jdenticon from "jdenticon/dist/jdenticon.min.js";
import { Link } from "react-router-dom";
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      searchText: "",
      searchResult: [],
      searchCompleted: false,
    };
  }
  componentDidUpdate() {
    jdenticon();
  }
  componentDidMount() {
    this.searchTimer = null;
    jdenticon();
  }
  getResults = async () => {
    this.setState({
      searching: true,
    });
    const result = await db
      .collection("users")
      .where("displayName", "==", this.state.searchText)
      .get();
    if (!result.empty) {
      // var userDetails = result.docs[0];
      var finalResult = [];
      result.forEach((res) => {
        finalResult.push({ displayName: res.data().displayName, uid: res.id });
      });
      this.setState({
        searchResult: finalResult,
        searching: false,
        searchCompleted: true,
      });
      // this.setState({
      //   searchResult: {
      //     displayName: userDetails.data().displayName,
      //     uid: userDetails.id,
      //   },
      //   searching: false,
      //   searchCompleted: true,
      // });
    } else
      this.setState({
        searching: false,
        searchResult: [],
        searchCompleted: true,
      });
  };
  handleInput = (e) => {
    this.setState({
      searchText: e.target.value,
    });

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.getResults();
    }, 900);
  };
  render() {
    return (
      <div className="container-fluid search-page">
        <h1 className="heading">
          search
          <svg
            className="page-icon"
            id="Search"
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
              d="M36.138,32.855,26.72,23.437A14.777,14.777,0,1,0,23.1,26.96l9.468,9.468ZM4.332,14.769A10.438,10.438,0,1,1,14.77,25.207,10.45,10.45,0,0,1,4.332,14.769Z"
              transform="translate(22 22)"
              fill="#9effff"
            />
          </svg>
        </h1>
        <div className="row justify-content-center">
          <div className="col-11 col-md-6 mt-4 searchbar-container">
            <input
              type="text"
              placeholder="enter name"
              className="searchbar"
              onChange={this.handleInput}
            ></input>
            <svg
              version="1.1"
              id="L5"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              enableBackground="new 0 0 0 0"
              className={this.state.searching ? "" : "search-hide"}
            >
              <circle fill="#275373" stroke="none" cx="6" cy="50" r="6">
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 15 ; 0 -15; 0 15"
                  repeatCount="indefinite"
                  begin="0.1"
                />
              </circle>
              <circle fill="#275373" stroke="none" cx="30" cy="50" r="6">
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 10 ; 0 -10; 0 10"
                  repeatCount="indefinite"
                  begin="0.2"
                />
              </circle>
              <circle fill="#275373" stroke="none" cx="54" cy="50" r="6">
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 5 ; 0 -5; 0 5"
                  repeatCount="indefinite"
                  begin="0.3"
                />
              </circle>
            </svg>
          </div>
        </div>
        {!this.state.searching &&
        this.state.searchCompleted &&
        this.state.searchResult.length === 0 ? (
          <div className="row justify-content-center mt-5">
            <h1 className="col search-result-name no-result">
              no_results
              <span className="no-result-in">search is case sensitive</span>
            </h1>
          </div>
        ) : (
          ""
        )}
        {this.state.searching ? (
          ""
        ) : (
          <div className="row justify-content-start mt-5">
            {this.state.searchResult.map((search) => {
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <svg
                    className="identicon-svg col-md-auto"
                    data-jdenticon-value={search.displayName}
                    width="150"
                    height="150"
                  >
                    Fallback text or image for browsers not supporting inline
                    svg.
                  </svg>
                  <Link
                    to={`/users/${search.uid}`}
                    className="col-12 search-result-name"
                  >
                    {search.displayName}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
