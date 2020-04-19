import React, { Component } from "react";
import "../stylesheets/Login.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebaseConfig";
import "firebase/auth";
import Swal from "sweetalert2";

export default class LoginUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginText: "LOGIN",
      abt: "continue as a guest",
    };
    this.handleLoginText = this.handleLoginText.bind(this);
  }
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          prompt: "select_account",
        },
      },
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        this.setState({ loginText: "PLEASE WAIT.." });
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
          title: `Successfully Signed in`,
        });
      },
      signInFailure: (error) => {
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
          title: `Sign in error!`,
        });
      },
    },
  };
  handleLoginText() {
    this.setState({ loginText: "LOGGED IN PLEASE WAIT.." });
  }
  componentDidMount() {}
  componentWillUnmount() {}
  handleAnonymousLogin = () => {
    this.setState({ abt: "please wait.." });
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
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        this.setState({ loginText: "PLEASE WAIT..", abt: "signed in!" });
        Toast.fire({
          icon: "success",
          title: `Successfully Signed in`,
        });
      })
      .catch((error) => {
        this.setState({ abt: "continue as a guest" });
        Toast.fire({
          icon: "error",
          title: error.message,
        });
      });
  };
  render() {
    return (
      <div className="mt-5">
        <h3
          style={{
            color: "#275373",
            textAlign: "center",
            margin: "20px",
            fontSize: "2.2rem",
            letterSpacing: "5px",
          }}
        >
          {this.state.loginText}
        </h3>
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        />

        <div className="col-12 casag-container">
          <button onClick={this.handleAnonymousLogin} className="casag">
            {this.state.abt}
          </button>
        </div>
      </div>
    );
  }
}
