import React from "react";
import "../stylesheets/SnippetLoader.css";

export default function SnippetLoader() {
  return (
    <div className="wrapper">
      <div className="wrap-row">
        <div className="br animate wrap-head"></div>
      </div>
      <div className="wrap-code">
        <div className="comment br animate w40"></div>{" "}
      </div>
    </div>
  );
}
