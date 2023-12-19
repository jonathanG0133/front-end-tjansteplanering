import React, { useState } from "react";
import Heatmap from "./Heatmap";
import SortingWidgets from "./SortingWidgets";

function App() {
  const [inputText, setInputText] = useState('');

  const handleTextChange = (text) => {
      setInputText(text);
  };

  return (
        <div class="heatmap-container">
            <SortingWidgets id="widget"
                inputText={inputText} 
                onInputChange={handleTextChange} 
            />
            <Heatmap inputText={inputText} />
        </div>
    );
}

export default App;
