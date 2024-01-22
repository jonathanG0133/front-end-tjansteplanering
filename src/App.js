// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import Heatmap from "./Heatmap";
import SortingWidgets from "./SortingWidgets";
import { COLORS } from "./values/colors";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  const [inputText, setInputText] = useState("");

  const handleTextChange = (text) => {
    setInputText(text);
  };

  useEffect(() => {
    document.title = "Tjänsteplanering";
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
