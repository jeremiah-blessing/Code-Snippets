import React, { Component } from "react";
import "../stylesheets/Share.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Swal from "sweetalert2";

export default class Share extends Component {
  constructor(props) {
    super(props);
    this.state = { copied: false };
  }
  handleSuccessShare = () => {
    this.setState({ copied: true });
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
      title: "Link Copied!",
    });
    this.props.handleClose();
  };
  handleCloseDialog = (e) => {
    if (e.target.id === "share-modal") this.props.handleClose();
  };
  render() {
    return (
      <div
        onClick={this.handleCloseDialog}
        id="share-modal"
        className="share-modal"
      >
        <div className="share-in">
          <a
            href={`mailto:someone@mail.com?Subject=${window.location.href}`}
            className="share-in-mail"
          >
            Mail{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
            </svg>
          </a>
          <CopyToClipboard
            text={window.location.href}
            onCopy={this.handleSuccessShare}
          >
            <button className="share-in-copy">
              {this.state.copied ? "Copied!" : "Click to Copy"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 16h10v1h-10v-1zm0-1h10v-1h-10v1zm15-13v22h-20v-22h3c1.229 0 2.18-1.084 3-2h8c.82.916 1.771 2 3 2h3zm-11 1c0 .552.448 1 1 1s1-.448 1-1-.448-1-1-1-1 .448-1 1zm9 1h-4l-2 2h-3.898l-2.102-2h-4v18h16v-18zm-13 9h10v-1h-10v1zm0-2h10v-1h-10v1z" />
              </svg>
            </button>
          </CopyToClipboard>
        </div>
      </div>
    );
  }
}
