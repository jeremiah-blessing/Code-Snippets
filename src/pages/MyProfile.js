import React, { Component } from "react";
import "../stylesheets/MyProfile.css";
import MySnippets from "../pages/MySnippets";
import Swal from "sweetalert2";
import firebase from "../firebaseConfig";
import "firebase/storage";
import { AuthContext } from "../AuthContext";
import { Redirect } from "react-router-dom";
import db from "../firestoreInstance";
import jdenticon from "jdenticon/dist/jdenticon.min.js";
export default class MyProfile extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      dnedit: false,
      newName: "",
      displayName: null,
      buttonText: "save",
      loading: true,
    };
  }
  handleInput = (e) => {
    this.setState({ newName: e.target.value }, () => jdenticon());
  };
  handleDNUpdate = () => {
    if (this.state.newName !== "") {
      this.setState({ buttonText: "saving.." });
      var user = firebase.auth().currentUser;
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
      });
      db.collection("users")
        .doc(user.uid)
        .update({ displayName: this.state.newName })
        .then(() => {
          const { handleAuth } = this.context;
          handleAuth(true, { uid: user.uid, displayName: this.state.newName });
          Toast.fire({
            icon: "success",
            title: "Display name changed",
          });
          this.setState({
            displayName: this.state.newName,
            dnedit: false,
            buttonText: "saved",
          });
          setTimeout(() => this.setState({ buttonText: "save" }), 100);
        })
        .catch((error) => {
          Toast.fire({
            icon: "error",
            title: "An error happened",
          });
          this.setState({ buttonText: "save" });
        });
    }
  };

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
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
        });

        Toast.fire({
          icon: "success",
          title: "Successfully Signed Out",
        });
        this.setState({ redirect: true });
      })
      .catch(() => {
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
        });

        Toast.fire({
          icon: "error",
          title: "Sign Out failed",
        });
      });
  };
  componentDidUpdate() {
    jdenticon();
  }
  componentDidMount() {
    this.handleProfileUpdate();
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
    jdenticon();
  }
  handleProfileUpdate = () => {
    var user = firebase.auth().currentUser;
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        this.setState({
          displayName: snapshot.data().displayName,
          photoUrl: snapshot.data().photoURL,
          newName: snapshot.data().displayName,
          loading: false,
        });
      });
  };

  render() {
    const { isSignedIn } = this.context;
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    if (this.state.loading) {
      return (
        <div className="wrapper">
          <div className="wrap-row">
            <div className="br animate wrap-head profile"></div>
          </div>
          <div className="wrap-row">
            <div className="br animate wrap-head profile"></div>
          </div>
        </div>
      );
    }
    return (
      <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="identicon">
            <svg
              data-jdenticon-value={
                this.state.dnedit ? this.state.newName : this.state.displayName
              }
              width="120"
              height="120"
            >
              Fallback text or image for browsers not supporting inline svg.
            </svg>
          </div>
        </div>

        {this.state.dnedit ? (
          <>
            <div className="row justify-content-center mt-5">
              <input
                className="profile-name-input col-10 col-md-5"
                type="text"
                defaultValue={this.state.displayName}
                onChange={this.handleInput}
              />
            </div>
            <div className="row justify-content-center mt-3">
              <button
                onClick={this.handleDNUpdate}
                className="profile-name-save col-8 col-md-2"
              >
                {this.state.buttonText}
              </button>
            </div>
            <div className="row justify-content-center mt-3">
              <button
                className="profile-name-cancel col-8 col-md-2"
                onClick={() => {
                  this.setState({ dnedit: !this.state.dnedit });
                }}
              >
                Cancel
              </button>
            </div>{" "}
          </>
        ) : (
          <div className="row justify-content-md-center">
            <div className="col-12">
              <h1 className="profile-name">
                {this.state.displayName}
                <svg
                  className="edit-profile"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  onClick={() => {
                    this.setState({ dnedit: !this.state.dnedit });
                  }}
                >
                  <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" />
                </svg>
              </h1>
            </div>
          </div>
        )}
        <div className="row justify-content-center">
          {isSignedIn ? (
            <button onClick={this.handleLogout} className="signout-btn">
              signOut
            </button>
          ) : (
            ""
          )}
        </div>
        <MySnippets />
      </div>
    );
  }
}
