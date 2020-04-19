import React from "react";
import "../stylesheets/Loader.css";

export default function Loader() {
  return (
    <div className="wrapper loader">
      <div className="wrap-code">
        <div className="comment br animate w40"></div>{" "}
        <div className="comment br animate w40"></div>
      </div>
    </div>
  );
}
