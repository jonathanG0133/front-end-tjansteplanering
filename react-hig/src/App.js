// App.js
import React, { useState } from "react";
import "./App.css";
import Heatmap from "./Heatmap";
import SortingWidgets from "./SortingWidgets";
import BackgroundVideo from "./BackgroundVideo";

function App() {
  const [inputText, setInputText] = useState("");
  const [code, setCode] = useState("");

  const handleTextChange = (text) => {
    setInputText(text);
  };

  return (
    <div className="app-container">
      <BackgroundVideo videoId="Ecz-HkT13EM" />

      <div className="content-overlay">
        {/* Rest of your app components */}
        <SortingWidgets
          id="widget"
          inputText={inputText}
          onInputChange={handleTextChange}
        />
        <Heatmap inputText={inputText} />
      </div>
    </div>
  );
}

export default App;
