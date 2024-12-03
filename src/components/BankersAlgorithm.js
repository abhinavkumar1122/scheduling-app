import React, { useState } from "react";
import './BankingAlgorithm.css'; // Importing CSS for styling

export function BankingAlgorithm() {
  const [processes, setProcesses] = useState([]);
  const [resources, setResources] = useState([{ name: "Resource 1", available: 0 }]);
  const [results, setResults] = useState(null);

  // Add a new process
  const addProcess = () => {
    setProcesses([
      ...processes,
      {
        pid: processes.length + 1,
        allocation: Array(resources.length).fill(0), // Initialize allocation array based on number of resources
        maximum: Array(resources.length).fill(0), // Initialize maximum array based on number of resources
      },
    ]);
  };

  // Add a new resource
  const addResource = () => {
    setResources([...resources, { name: `Resource ${resources.length + 1}`, available: 0 }]);
  };

  // Handle changes in process inputs
  const handleProcessInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = value.split(",").map(Number); // Convert the comma-separated input to an array of numbers
    setProcesses(updatedProcesses);
  };

  // Handle changes in resource availability
  const handleResourceInputChange = (index, value) => {
    const updatedResources = [...resources];
    updatedResources[index].available = parseInt(value, 10);
    setResources(updatedResources);
  };

  // Calculate the Banker's algorithm for the safe sequence
  const calculateBankingAlgorithm = () => {
    let safeSequence = [];
    let finished = new Array(processes.length).fill(false);
    let work = resources.map((res) => res.available); // Work is initialized to available resources

    while (safeSequence.length < processes.length) {
      let foundProcess = false;

      for (let i = 0; i < processes.length; i++) {
        if (!finished[i]) {
          let { allocation, maximum } = processes[i];
          // Calculate the need for each process
          let need = maximum.map((m, j) => m - allocation[j]);

          let isSafe = true;

          // Check if the process can be executed (i.e., all needs <= available resources)
          for (let j = 0; j < resources.length; j++) {
            if (need[j] > work[j]) {
              isSafe = false;
              break;
            }
          }

          // If the process can be executed
          if (isSafe) {
            finished[i] = true;
            safeSequence.push(processes[i].pid); // Add process to safe sequence
            work = work.map((w, j) => w + allocation[j]); // Update available resources
            foundProcess = true;
          }
        }
      }

      // If no process was found in this iteration, no safe sequence exists
      if (!foundProcess) {
        setResults("No safe sequence found");
        return;
      }
    }

    // Calculate the need for each process after determining the safe sequence
    const finalProcesses = processes.map((process) => {
      const need = process.maximum.map((m, j) => m - process.allocation[j]);
      return { ...process, need };
    });

    setResults({ safeSequence, finalProcesses });
  };

  return (
    <div className="banking-algorithm">
      <h2>Banker's Algorithm for Resource Allocation</h2>
      <div className="buttons">
        <button onClick={addProcess}>Add Process</button>
        <button onClick={addResource}>Add Resource</button>
      </div>

      <div className="processes">
        <h3>Processes</h3>
        {processes.map((process, index) => (
          <div key={index} className="process">
            <h4>Process {process.pid}</h4>
            {resources.map((_, resourceIndex) => (
              <div key={resourceIndex} className="resource-inputs">
                <label>
                  Allocation (Resource {resourceIndex + 1}):
                  <input
                    type="number"
                    value={process.allocation[resourceIndex]}
                    onChange={(e) => {
                      const updatedProcesses = [...processes];
                      updatedProcesses[index].allocation[resourceIndex] = parseInt(e.target.value, 10);
                      setProcesses(updatedProcesses);
                    }}
                  />
                </label>
                <label>
                  Maximum (Resource {resourceIndex + 1}):
                  <input
                    type="number"
                    value={process.maximum[resourceIndex]}
                    onChange={(e) => handleProcessInputChange(index, "maximum", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="resources">
        <h3>Resources</h3>
        {resources.map((resource, index) => (
          <div key={index} className="resource-input">
            <label>
              {resource.name} Available:
              <input
                type="number"
                value={resource.available}
                onChange={(e) => handleResourceInputChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
      </div>

      <button onClick={calculateBankingAlgorithm}>Calculate Safe Sequence</button>

      {results && (
        <div className="results">
          <h3>Results</h3>
          {typeof results === "string" ? (
            <p>{results}</p>
          ) : (
            <div>
              <div className="safe-sequence">
                <h4>Safe Sequence:</h4>
                <ul>
                  {results.safeSequence.map((pid, index) => (
                    <li key={index}>Process {pid}</li>
                  ))}
                </ul>
              </div>

              <div className="needs">
                <h4>Need for each process:</h4>
                {results.finalProcesses.map((process, index) => (
                  <div key={index} className="process-need">
                    <h5>Process {process.pid}</h5>
                    <ul>
                      {process.need.map((n, idx) => (
                        <li key={idx}>Need (Resource {idx + 1}): {n}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BankingAlgorithm;
