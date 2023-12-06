import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Heatmap from "./Heatmap";

function App() {
  return (
    <div className="heatmap-container">
      <Heatmap />
    </div>
  );
}

export default App;
