import { useState } from 'react';
import FCFS from "./components/FCFS.js";
import BankersAlgorithm from "./components/BankersAlgorithm.js";
import FIFOPageReplacement from "./components/FIFOPageReplacement.js";
import LRUPageReplacement from "./components/LRUPageReplacement.js";
import OptimalPageReplacement from "./components/OptimalPageReplacement.js";
import './App.css';

function App() {
  const [algorithm, setAlgorithm] = useState("");

  const renderAlgorithmComponent = () => {
    switch (algorithm) {
      case "fcfs":
        return <FCFS />;
      case "bankers":
        return <BankersAlgorithm />;
      case "fifo":
        return <FIFOPageReplacement />;
      case "lru":
        return <LRUPageReplacement />;
      case "optimal":
        return <OptimalPageReplacement />;
      default:
        return <p>Select an algorithm from the list above.</p>;
    }
  };
  return (
    <div className="App">
      <h1>CPU Scheduling and Memory Management Algorithms</h1>
      <select onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="">-- Select Algorithm --</option>
        <option value="fcfs">First Come First Serve (FCFS)</option>
        <option value="bankers">Banker's Algorithm</option>
        <option value="fifo">FIFO Page Replacement</option>
        <option value="lru">LRU Page Replacement</option>
        <option value="optimal">Optimal Page Replacement</option>
      </select>
      <div>{renderAlgorithmComponent()}</div>
    </div>
  );
}

export default App;
