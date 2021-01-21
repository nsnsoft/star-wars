import React from "react";
import "./Button.css";

const Button = ({ label, disabled, onClick }) => {
  return (
    <button
      className={`button ${disabled ? "button-disabled" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
