import React, { Component } from "react";
import "../stylesheets/LanguageSelector.css";
import Language from "./Language";
import languageDefinitions from "./languageDefinitions";

export default class LanguageSelector extends Component {
  static defaultProps = languageDefinitions;
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.options[0],
      openDialog: false,
    };
  }
  handleChange = (value) => {
    var tobePushed = this.props.options.filter(
      (option) => option.value === value
    );
    this.setState({ selected: tobePushed[0], openDialog: false });
    this.props.handleLanguageChange({
      mode: tobePushed[0].value,
      language: tobePushed[0].text,
    });
  };

  render() {
    return (
      <div className="language-selector">
        <button
          className="ls-button"
          onClick={() => this.setState({ openDialog: !this.state.openDialog })}
        >
          {this.state.selected.icon} {this.state.selected.text}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={
              this.state.openDialog ? "ls-button-svg open" : "ls-button-svg"
            }
          >
            <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
          </svg>
        </button>
        {this.state.openDialog ? (
          <ul className="ls-ul">
            {this.props.options.map((option, index) => (
              <Language
                handleChange={this.handleChange}
                key={index}
                {...option}
              />
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>
    );
  }
}
