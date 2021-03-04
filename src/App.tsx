import React from "react";
import "./App.css";
import { Board } from "./board";
import { DataProvider } from "./DataContext";

function App() {
  return (
    <div className="App">
      <DataProvider>
        <Board />
      </DataProvider>
    </div>
  );
}

export default App;
