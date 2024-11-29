import React, { useState } from "react";

function SJF() {
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

  const calculateSJF = () => {
    let currentTime = 0;
    let remainingProcesses = [...processes];
    const completedProcesses = [];

    while (remainingProcesses.length > 0) {
      // Filter processes that have arrived by the current time
      const availableProcesses = remainingProcesses.filter((p) => p.arrival_time <= currentTime);

      if (availableProcesses.length === 0) {
        // If no process is available, move the current time to the next process's arrival time
        currentTime = Math.min(...remainingProcesses.map((p) => p.arrival_time));
        continue;
      }

      // Sort available processes by burst time
      availableProcesses.sort((a, b) => a.burst_time - b.burst_time);

      // Pick the process with the shortest burst time
      const currentProcess = availableProcesses[0];

      // Calculate times for the selected process
      currentProcess.completion_time = currentTime + currentProcess.burst_time;
      currentProcess.turnaround_time = currentProcess.completion_time - currentProcess.arrival_time;
      currentProcess.waiting_time = currentProcess.turnaround_time - currentProcess.burst_time;

      // Update the current time
      currentTime += currentProcess.burst_time;

      // Move the completed process to the results
      completedProcesses.push(currentProcess);

      // Remove the completed process from the remaining list
      remainingProcesses = remainingProcesses.filter((p) => p.pid !== currentProcess.pid);
    }

    setResults(completedProcesses);
  };

  return (
    <div>
      <h2>Shortest Job First (SJF) Non-Preemptive Scheduling</h2>
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
      <button onClick={calculateSJF}>Calculate SJF</button>
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

export default SJF;
