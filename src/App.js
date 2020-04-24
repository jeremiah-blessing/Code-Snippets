import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Newsnippet from "./pages/Newsnippet";
import MySnippets from "./pages/MySnippets";
import Editsnippet from "./pages/Editsnippet";
import Search from "./pages/Search";
import Snippet from "./pages/Snippet";
import Notifications from "./pages/Notifications";
import Publicprofile from "./pages/Publicprofile";
import LoginUI from "./pages/LoginUI";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import fetchNotifications from "./components/fetchNotifications";
// import Test from "./pages/Test";
import "./App.css";
import firebase from "./firebaseConfig";
import "firebase/analytics";
// import "firebase/auth";
import MyProfile from "./pages/MyProfile";

import { AuthContext } from "./AuthContext";
import Swal from "sweetalert2";

import LanguageSelector from "./components/LanguageSelector";

export default class App extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { dummyState: false, noOfNotifications: 0, notifications: [] };
    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.resetNotification = this.resetNotification.bind(this);
  }
  handleAuthChange(status, userDetail) {
    const { handleAuth } = this.context;
    handleAuth(status, userDetail);
  }
  resetNotification() {
    this.setState({ noOfNotifications: 0, notifications: [] });
  }
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
        var providerId;
        if (user.providerData.length === 0) providerId = "anonymous";
        else providerId = user.providerData[0].providerId;
        firebase.analytics().logEvent("login", { method: providerId });
        Toast.fire({
          icon: "success",
          title: "Successfully Signed in!",
        });
        this.handleAuthChange(true, user);
        fetchNotifications(user.uid).then((notifications) => {
          const forLength = notifications.filter((notification) => {
            return !notification.read;
          });
          this.setState({
            noOfNotifications: forLength.length,
            notifications: notifications,
          });
        });
      } else {
        this.handleAuthChange(false, null);
      }
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  render() {
    const { isSignedIn, userDetails } = this.context;
    return (
      <div>
        <Navbar noOfNotifications={this.state.noOfNotifications} />
        <main>
          <Switch>
            <Route exact path="/" render={() => <Welcome />} />
            <PrivateRoute exact path="/create-new">
              <Newsnippet />
            </PrivateRoute>
            <Route
              exact
              path="/edit/:snippetID"
              render={(routeProps) =>
                isSignedIn ? (
                  <Editsnippet {...routeProps} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              exact
              path="/users/:user"
              render={(routeProps) => <Publicprofile {...routeProps} />}
            />
            <Route
              exact
              path="/users/:user/snippets/:snippetID"
              render={(routeProps) => <Snippet {...routeProps} />}
            />
            <Route
              exact
              path="/my-snippets"
              render={() => (isSignedIn ? <MySnippets /> : <Redirect to="/" />)}
            />

            <Route exact path="/search" render={() => <Search />} />
            <Route
              exact
              path="/notifications"
              render={(routeProps) =>
                isSignedIn ? (
                  <Notifications
                    uid={userDetails.uid}
                    resetNotification={this.resetNotification}
                  />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              exact
              path="/login"
              render={() =>
                isSignedIn ? <Redirect to="/my-profile" /> : <LoginUI />
              }
            />
            <Route exact path="/bla">
              <LanguageSelector />
            </Route>
            <Route path="/loader">
              <Loader />
            </Route>
            <Route
              path="/my-profile"
              render={(routeProps) =>
                isSignedIn ? <MyProfile /> : <Redirect to="/" />
              }
            />
          </Switch>
        </main>
      </div>
    );
  }
}
// function PrivateRoute({ children, ...rest }) {
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         fakeAuth.isAuthenticated ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/",
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }
function PrivateRoute({ children, ...rest }) {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <Route
            {...rest}
            render={({ location, match, history }) =>
              context.isSignedIn ? (
                children
              ) : (
                <Redirect
                  to={{
                    pathname: "/",
                    state: { from: location },
                  }}
                />
              )
            }
          />
        );
      }}
    </AuthContext.Consumer>
  );
}
// function PrivateRoute({ children, ...rest }) {
//   return (
//     <AuthContext.Consumer>
//       {(context) => {
//         return (
//           <Route
//             {...rest}
//             render={({ location }) =>
//               context.isSignedIn ? (
//                 children
//               ) : (
//                 <Redirect
//                   to={{
//                     pathname: "/",
//                     state: { from: location },
//                   }}
//                 />
//               )
//             }
//           />
//         );
//       }}
//     </AuthContext.Consumer>
//   );
// }
