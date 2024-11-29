import React, { useState } from "react";

function RoundRobin() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState(null);
  const [timeQuantum, setTimeQuantum] = useState(4); // Default time quantum value

  const addProcess = () => {
    setProcesses([
      ...processes,
      { pid: processes.length + 1, arrival_time: 0, burst_time: 0, remaining_time: 0 },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = parseInt(value, 10);
    if (field === "burst_time") {
      updatedProcesses[index]["remaining_time"] = parseInt(value, 10); // Update remaining time
    }
    setProcesses(updatedProcesses);
  };

  const displayResults = (processes) => {
    return processes.map((process) => (
      <tr key={process.pid}>
        <td>{process.pid}</td>
        <td>{process.arrival_time}</td>
        <td>{process.burst_time}</td>
        <td>{process.completion_time}</td>
        <td>{process.turnaround_time}</td>
        <td>{process.waiting_time}</td>
      </tr>
    ));
  };

  const calculateRoundRobin = () => {
    let currentTime = 0;
    const queue = [];
    const updatedProcesses = processes.map((p) => ({
      ...p,
      remaining_time: p.burst_time,
      completion_time: 0,
      turnaround_time: 0,
      waiting_time: 0,
    }));

    // Sort processes by arrival time initially
    updatedProcesses.sort((a, b) => a.arrival_time - b.arrival_time);

    while (updatedProcesses.some((p) => p.remaining_time > 0)) {
      // Add processes that have arrived by currentTime to the queue
      updatedProcesses.forEach((process) => {
        if (process.arrival_time <= currentTime && process.remaining_time > 0 && !queue.includes(process)) {
          queue.push(process);
        }
      });

      if (queue.length > 0) {
        const currentProcess = queue.shift(); // Get the first process in the queue

        // Process Execution
        if (currentProcess.remaining_time > timeQuantum) {
          currentTime += timeQuantum;
          currentProcess.remaining_time -= timeQuantum;
        } else {
          currentTime += currentProcess.remaining_time;
          currentProcess.remaining_time = 0;
          currentProcess.completion_time = currentTime;
          currentProcess.turnaround_time = currentProcess.completion_time - currentProcess.arrival_time;
          currentProcess.waiting_time = currentProcess.turnaround_time - currentProcess.burst_time;
        }
      } else {
        // If the queue is empty, increment time to move forward
        currentTime += 1;
      }
    }

    setResults(updatedProcesses); // Update the results state
  };

  return (
    <div>
      <h2>Round Robin Scheduling</h2>
      <button onClick={addProcess}>Add Process</button>
      <div>
        <label>
          Time Quantum:
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      {processes.map((process, index) => (
        <div key={index}>
          <label>
            Arrival Time:
            <input
              type="number"
              value={process.arrival_time}
              onChange={(e) => handleInputChange(index, "arrival_time", e.target.value)}
            />
          </label>
          <label>
            Burst Time:
            <input
              type="number"
              value={process.burst_time}
              onChange={(e) => handleInputChange(index, "burst_time", e.target.value)}
            />
          </label>
        </div>
      ))}
      <button onClick={calculateRoundRobin}>Calculate Round Robin</button>
      {results && results.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>PID</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              <th>Completion Time</th>
              <th>Turnaround Time</th>
              <th>Waiting Time</th>
            </tr>
          </thead>
          <tbody>{displayResults(results)}</tbody>
        </table>
      )}
      {results && results.length === 0 && <p>No results to display.</p>}
    </div>
  );
}

export default RoundRobin;
