import React from "react";
import PropTypes from "prop-types";
import LoaderIcon from "./LoaderIcon";
import "./Input.css";

const Input = ({ value, onChange, label, password, pending }) => {
  return (
    <div className="input">
      {value && <div className="input__label">{label}</div>}
      {pending && (
        <div data-testid="pendingIndicator" className="input__pending">
          <LoaderIcon />
        </div>
      )}
      <input
        type={password ? "password" : "text"}
        value={value}
        placeholder={label}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  pending: PropTypes.bool,
  password: PropTypes.bool,
};

Input.defaultProps = {
  label: "",
};

export default Input;
