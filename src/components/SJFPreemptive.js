import React, { useState } from "react";

function SRTF() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState(null);

  const addProcess = () => {
    setProcesses([...processes, { pid: processes.length + 1, arrival_time: 0, burst_time: 0 }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = parseInt(value, 10);
    setProcesses(updatedProcesses);
  };

  const calculateSRTF = () => {
    let currentTime = 0;
    let remainingProcesses = processes.map((p) => ({
      ...p,
      remaining_time: p.burst_time, // Track remaining burst time
      completion_time: 0,
      turnaround_time: 0,
      waiting_time: 0,
    }));
    const completedProcesses = [];
    let totalProcesses = processes.length;

    while (completedProcesses.length < totalProcesses) {
      // Filter processes that have arrived by the current time
      const availableProcesses = remainingProcesses.filter((p) => p.arrival_time <= currentTime && p.remaining_time > 0);

      if (availableProcesses.length === 0) {
        // If no process is available, move the current time to the next process's arrival time
        currentTime = Math.min(...remainingProcesses.filter((p) => p.remaining_time > 0).map((p) => p.arrival_time));
        continue;
      }

      // Sort by remaining time, and pick the process with the shortest remaining time
      availableProcesses.sort((a, b) => a.remaining_time - b.remaining_time);
      const currentProcess = availableProcesses[0];

      // Execute the process for 1 unit of time
      currentProcess.remaining_time -= 1;
      currentTime += 1;

      // If the process finishes, calculate its times
      if (currentProcess.remaining_time === 0) {
        currentProcess.completion_time = currentTime;
        currentProcess.turnaround_time = currentProcess.completion_time - currentProcess.arrival_time;
        currentProcess.waiting_time = currentProcess.turnaround_time - currentProcess.burst_time;

        // Move the completed process to the results
        completedProcesses.push(currentProcess);
      }
    }

    setResults(completedProcesses);
  };

  return (
    <div>
      <h2>Shortest Remaining Time First (SRTF) Scheduling</h2>
      <button onClick={addProcess}>Add Process</button>
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
      <button onClick={calculateSRTF}>Calculate SRTF</button>
      {results && (
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
          <tbody>
            {results.map((process) => (
              <tr key={process.pid}>
                <td>{process.pid}</td>
                <td>{process.arrival_time}</td>
                <td>{process.burst_time}</td>
                <td>{process.completion_time}</td>
                <td>{process.turnaround_time}</td>
                <td>{process.waiting_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SRTF;
