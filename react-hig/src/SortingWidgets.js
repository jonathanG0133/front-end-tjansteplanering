import React from "react";
import "./SortingWidgets.css";

function SortingWidgets({ inputText, onInputChange }) {
  return (
    <div className="sökruta-container">
      <input
        type="text"
        value={inputText}
        placeholder={"Enter year"}
        onChange={(e) => {
          const inputValue = e.target.value.slice(0, 4); // Limit to 4 characters
          onInputChange(inputValue);
        }}
        maxLength={4}
      />
    </div>
  );
}

export default SortingWidgets;
