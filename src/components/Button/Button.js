import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

const Button = ({ label, disabled, onClick }) => {
  return (
    <button
      disabled={disabled}
      className="button"
      onClick={(e) => !disabled && onClick(e)}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  onClick: () => true,
};

export default Button;
