import React, { useState } from "react";

function RoundRobin() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState(null);
  const [timeQuantum, setTimeQuantum] = useState(4); // Default time quantum
  const [ganttData, setGanttData] = useState([]); // State for Gantt Chart data

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

  const calculateRoundRobin = () => {
    let currentTime = 0;
    const queue = [];
    const gantt = [];
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
      
      const time = currentTime;

      updatedProcesses.forEach((process) => {
        if (process.arrival_time <= time && process.remaining_time > 0 && !queue.includes(process)) {
          queue.push(process);
        }
      });

      if (queue.length > 0) {
        const currentProcess = queue.shift(); // Get the first process in the queue
        const executionStart = currentTime;

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

        // Add process execution to Gantt chart
        gantt.push({
          processId: `P${currentProcess.pid}`,
          startTime: executionStart,
          endTime: currentTime,
        });

        // Re-add to queue if not completed
        if (currentProcess.remaining_time > 0) queue.push(currentProcess);
      } else {
        currentTime++;
      }
    }

    setResults(updatedProcesses); // Update results state
    setGanttData(gantt); // Update Gantt chart data state
  };

  const renderGanttChart = () => (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
      {ganttData.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 5px",
            padding: "10px",
            backgroundColor: "#4caf50",
            color: "white",
            borderRadius: "4px",
            minWidth: `${item.endTime - item.startTime}em`,
          }}
        >
          <span>{item.processId}</span>
          <span>
            {item.startTime} - {item.endTime}
          </span>
        </div>
      ))}
    </div>
  );

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

      {results && (
        <div>
          <h3>Results</h3>
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
        </div>
      )}

      {ganttData.length > 0 && (
        <div>
          <h3>Gantt Chart</h3>
          {renderGanttChart()}
        </div>
      )}
    </div>
  );
}

export default RoundRobin;
