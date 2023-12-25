// App.js
import React, { useState } from "react";
import Heatmap from "./Heatmap";
import SortingWidgets from "./SortingWidgets";

function App() {
  const [inputText, setInputText] = useState("");
  const [code, setCode] = useState("");

  const handleTextChange = (text) => {
    setInputText(text);
  };

  const handleClearClick = () => {
    setCode(""); // Clear the code
  };

  return (
    <div className="heatmap-container">
      <SortingWidgets
        id="widget"
        inputText={inputText}
        onInputChange={handleTextChange}
        onClearClick={handleClearClick} // Pass the callback function
      />
      <Heatmap inputText={inputText} code={code} />
    </div>
  );
}

export default App;
