import React, { useState } from "react";

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

    const totalWaitingTime = updatedProcesses.reduce((acc, process) => acc + process.waiting_time, 0);
    const totalTurnaroundTime = updatedProcesses.reduce((acc, process) => acc + process.turnaround_time, 0);
    const numProcesses = updatedProcesses.length;

    setAvgWaitingTime(totalWaitingTime / numProcesses);
    setAvgTurnaroundTime(totalTurnaroundTime / numProcesses);

    setResults(updatedProcesses);
  };

  const ganttData = results
    ? results.map((process) => ({
        name: `P${process.pid}`,
        startTime: process.completion_time - process.burst_time,
        endTime: process.completion_time,
      }))
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>First Come First Serve (FCFS) Scheduling</h2>
      <button onClick={addProcess} style={{ marginBottom: "10px", padding: "5px 10px" }}>Add Process</button>
      {processes.map((process, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <label>
            Arrival Time:
            <input
              type="number"
              value={process.arrival_time}
              onChange={(e) => handleInputChange(index, "arrival_time", e.target.value)}
              style={{ margin: "0 10px" }}
            />
          </label>
          <label>
            Burst Time:
            <input
              type="number"
              value={process.burst_time}
              onChange={(e) => handleInputChange(index, "burst_time", e.target.value)}
              style={{ margin: "0 10px" }}
            />
          </label>
        </div>
      ))}
      <button onClick={calculateFCFS} style={{ padding: "5px 10px", marginBottom: "20px" }}>Calculate FCFS</button>
      
      {results && (
        <div>
          <table border="1" style={{ marginBottom: "20px", width: "100%", textAlign: "center" }}>
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

          <div style={{ marginBottom: "20px" }}>
            <h3>Average Waiting Time: {avgWaitingTime.toFixed(2)}</h3>
            <h3>Average Turnaround Time: {avgTurnaroundTime.toFixed(2)}</h3>
          </div>

          {/* Render the Gantt Chart */}
          <h3>Gantt Chart</h3>
          <div style={{ display: "flex", border: "1px solid #ccc", padding: "10px", overflowX: "auto" }}>
            {ganttData.map((block, index) => (
              <div
                key={index}
                style={{
                  flex: block.endTime - block.startTime,
                  border: "1px solid black",
                  padding: "10px",
                  textAlign: "center",
                  backgroundColor: "#f0f0f0",
                  marginRight: "5px",
                  minWidth: "50px",
                }}
              >
                {block.name} ({block.startTime}-{block.endTime})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FCFS;
