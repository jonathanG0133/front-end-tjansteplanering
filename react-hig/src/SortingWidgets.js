import React from "react";

function SortingWidgets({ inputText, onInputChange }) {
    return (
        <div>
            <input
                type="text"
                value={inputText}
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