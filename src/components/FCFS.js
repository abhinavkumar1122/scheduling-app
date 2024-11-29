import React, { useState } from "react";
import GanttChart from "./GanttChart";

function FCFS() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState(null);
  const [avgWaitingTime, setAvgWaitingTime] = useState(null);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(null);

  const addProcess = () => {
    setProcesses([...processes, { pid: processes.length + 1, arrival_time: 0, burst_time: 0 }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = parseInt(value, 10);
    setProcesses(updatedProcesses);
  };

  const calculateFCFS = () => {
    let currentTime = 0;
    const updatedProcesses = processes.map((p) => ({ ...p, completion_time: 0, turnaround_time: 0, waiting_time: 0 }));
    updatedProcesses.sort((a, b) => a.arrival_time - b.arrival_time);

    updatedProcesses.forEach((process) => {
      if (currentTime < process.arrival_time) currentTime = process.arrival_time;
      process.completion_time = currentTime + process.burst_time;
      process.turnaround_time = process.completion_time - process.arrival_time;
      process.waiting_time = process.turnaround_time - process.burst_time;
      currentTime += process.burst_time;
    });

    // Calculate average waiting time and turnaround time
    const totalWaitingTime = updatedProcesses.reduce((acc, process) => acc + process.waiting_time, 0);
    const totalTurnaroundTime = updatedProcesses.reduce((acc, process) => acc + process.turnaround_time, 0);
    const numProcesses = updatedProcesses.length;

    setAvgWaitingTime(totalWaitingTime / numProcesses);
    setAvgTurnaroundTime(totalTurnaroundTime / numProcesses);

    setResults(updatedProcesses);
  };

  // Prepare data for the Gantt Chart
  const ganttData = processes.map((process) => ({
    name: process.pid,
    startTime: process.arrival_time,
    endTime: process.completion_time,
  }));

  return (
    <div>
      <h2>First Come First Serve (FCFS) Scheduling</h2>
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
      <button onClick={calculateFCFS}>Calculate FCFS</button>
      
      {results && (
        <div>
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

          <div>
            <h3>Average Waiting Time: {avgWaitingTime.toFixed(2)}</h3>
            <h3>Average Turnaround Time: {avgTurnaroundTime.toFixed(2)}</h3>
          </div>

          {/* Render the Gantt Chart */}
          <GanttChart processes={ganttData} />
        </div>
      )}
    </div>
  );
}

export default FCFS;
