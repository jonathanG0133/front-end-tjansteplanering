// App.js
import React, { useState } from "react";
import "./App.css";
import Heatmap from "./Heatmap";
import SortingWidgets from "./SortingWidgets";

function App() {
  const [inputText, setInputText] = useState("");
  const [code, setCode] = useState("");

  const handleTextChange = (text) => {
    setInputText(text);
  }

  return (
    <div className="heatmap-container">
      <SortingWidgets
        id="widget"
        inputText={inputText}
        onInputChange={handleTextChange}
      />
      <Heatmap inputText={inputText} />
    </div>
  );
}

export default App;
