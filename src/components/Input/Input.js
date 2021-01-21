import React from "react";
import "./Input.css";

const Input = ({ value, onChange, label }) => {
  return (
    <div className="input">
      {value && <div className="input__label">{label}</div>}
      <input
        type="text"
        value={value}
        placeholder={label}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </div>
  );
};

export default Input;
