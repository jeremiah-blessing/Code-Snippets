import React, { Component, createContext } from "react";
import db from "./firestoreInstance";

export const AuthContext = createContext();

export default class AuthContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { isSignedIn: false, userDetails: null };
  }
  handleAuth = async (isSignedIn, userDetails) => {
    // HandleIfLogOut
    if (userDetails === null) {
      this.setState({
        isSignedIn: isSignedIn,
        userDetails: userDetails,
      });
    }
    // HandleIfLogIn
    else {
      var displayName = await db.collection("users").doc(userDetails.uid).get();
      var fetchTimer;
      var fetchCounter = 0;
      if (!displayName.exists) {
        fetchTimer = setInterval(async () => {
          fetchCounter++;
          displayName = await db.collection("users").doc(userDetails.uid).get();
          if (displayName.exists) {
            clearInterval(fetchTimer);
            this.setState({
              isSignedIn: isSignedIn,
              userDetails: {
                uid: userDetails.uid,
                displayName: displayName.data().displayName,
              },
            });
          }
          if (fetchCounter > 5) {
            console.log("Fetch limit exceeded!");
            clearInterval(fetchTimer);
          }
        }, 3000);
      } else {
        this.setState({
          isSignedIn: isSignedIn,
          userDetails: {
            uid: userDetails.uid,
            displayName: displayName.data().displayName,
          },
        });
      }
    }
  };
  render() {
    return (
      <AuthContext.Provider
        value={{
          ...this.state,
          handleAuth: this.handleAuth,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
