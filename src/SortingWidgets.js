// SortingWidgets.js
import React from "react";
import "./SortingWidgets.css";

function SortingWidgets({ inputText, onInputChange, onClearClick }) {
  const handleClearClick = () => {
    onInputChange(""); // Clear the input text
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={inputText}
        placeholder={"Enter Year (e.g. 2023)"}
        onChange={(e) => {
          const inputValue = e.target.value.slice(0, 4); // Limit to 4 characters
          onInputChange(inputValue);
        }}
        maxLength={4}
      />
      <button onClick={handleClearClick}>Clear</button>
    </div>
  );
}

export default SortingWidgets;
