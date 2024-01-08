// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import Heatmap from "./Heatmap";
import SortingWidgets from "./SortingWidgets";
import { COLORS } from "./values/colors";

function App() {
  const [inputText, setInputText] = useState("");

  const handleTextChange = (text) => {
    setInputText(text);
  };

  useEffect(() => {
    document.title = "Tjänsteplanering";
  }, []);

  return (
    <div
      className="heatmap-container"
      style={{ backgroundColor: COLORS.background }}
    >
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
