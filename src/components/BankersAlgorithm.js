import React, { useState } from "react";

export function BankingAlgorithm() {
  const [processes, setProcesses] = useState([]);
  const [resources, setResources] = useState([]);
  const [results, setResults] = useState(null);

  const addProcess = () => {
    setProcesses([...processes, { pid: processes.length + 1, allocation: [0], maximum: [0], need: [0] }]);
  };

  const addResource = () => {
    setResources([...resources, { id: resources.length + 1, available: 0 }]);
  };

  const handleProcessInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = value.split(",").map(Number);
    setProcesses(updatedProcesses);
  };

  const calculateBankingAlgorithm = () => {
    let safeSequence = [];
    let finished = new Array(processes.length).fill(false);
    let work = resources.map((res) => res.available);

    while (safeSequence.length < processes.length) {
      let foundProcess = false;

      for (let i = 0; i < processes.length; i++) {
        if (!finished[i]) {
          let { allocation, need } = processes[i];
          let isSafe = true;

          for (let j = 0; j < resources.length; j++) {
            if (need[j] > work[j]) {
              isSafe = false;
              break;
            }
          }

          if (isSafe) {
            finished[i] = true;
            safeSequence.push(processes[i].pid);
            work = work.map((w, j) => w + allocation[j]);
            foundProcess = true;
          }
        }
      }

      if (!foundProcess) {
        setResults("No safe sequence found");
        return;
      }
    }

    setResults({ safeSequence });
  };

  return (
    <div>
      <h2>Banker's Algorithm for Resource Allocation</h2>
      <button onClick={addProcess}>Add Process</button>
      <button onClick={addResource}>Add Resource</button>
      <div>
        <label>
          Processes:
          {processes.map((process, index) => (
            <div key={index}>
              <label>
                Allocation:
                <input
                  type="text"
                  value={process.allocation.join(",")}
                  onChange={(e) => handleProcessInputChange(index, "allocation", e.target.value)}
                />
              </label>
              <label>
                Maximum:
                <input
                  type="text"
                  value={process.maximum.join(",")}
                  onChange={(e) => handleProcessInputChange(index, "maximum", e.target.value)}
                />
              </label>
              <label>
                Need:
                <input
                  type="text"
                  value={process.need.join(",")}
                  onChange={(e) => handleProcessInputChange(index, "need", e.target.value)}
                />
              </label>
            </div>
          ))}
        </label>
      </div>
      <div>
        <label>
          Resources:
          {resources.map((resource, index) => (
            <div key={index}>
              <label>
                Available:
                <input
                  type="number"
                  value={resource.available}
                  onChange={(e) => {
                    const updatedResources = [...resources];
                    updatedResources[index].available = parseInt(e.target.value, 10);
                    setResources(updatedResources);
                  }}
                />
              </label>
            </div>
          ))}
        </label>
      </div>
      <button onClick={calculateBankingAlgorithm}>Calculate Safe Sequence</button>
      {results && (
        <div>
          <h3>Results</h3>
          {typeof results === "string" ? (
            <p>{results}</p>
          ) : (
            <ul>
              {results.safeSequence.map((pid, index) => (
                <li key={index}>Process {pid}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default BankingAlgorithm;
