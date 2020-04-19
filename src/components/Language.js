import React from "react";
import "../stylesheets/Language.css";

export default function Language(props) {
  const { value } = props;
  return (
    <li onClick={() => props.handleChange(value)} className="ls-li">
      {props.icon}
      {props.text}
    </li>
  );
}
