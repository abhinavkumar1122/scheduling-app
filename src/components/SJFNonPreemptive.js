import React, { useState } from "react";

function SJF() {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState(null);
  const [ganttData, setGanttData] = useState([]);
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);

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
    const ganttProcesses = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    while (remainingProcesses.length > 0) {
      const time = currentTime;
      const availableProcesses = remainingProcesses.filter((p) => p.arrival_time <= time);

      if (availableProcesses.length === 0) {
        currentTime = Math.min(...remainingProcesses.map((p) => p.arrival_time));
        continue;
      }

      availableProcesses.sort((a, b) => a.burst_time - b.burst_time);

      const currentProcess = availableProcesses[0];

      currentProcess.completion_time = currentTime + currentProcess.burst_time;
      currentProcess.turnaround_time = currentProcess.completion_time - currentProcess.arrival_time;
      currentProcess.waiting_time = currentProcess.turnaround_time - currentProcess.burst_time;

      ganttProcesses.push({
        name: `P${currentProcess.pid}`,
        startTime: currentTime,
        endTime: currentTime + currentProcess.burst_time,
      });

      totalWaitingTime += currentProcess.waiting_time;
      totalTurnaroundTime += currentProcess.turnaround_time;

      currentTime += currentProcess.burst_time;

      completedProcesses.push(currentProcess);
      remainingProcesses = remainingProcesses.filter((p) => p.pid !== currentProcess.pid);
    }

    const avgWT = totalWaitingTime / completedProcesses.length;
    const avgTAT = totalTurnaroundTime / completedProcesses.length;

    setAvgWaitingTime(avgWT);
    setAvgTurnaroundTime(avgTAT);
    setResults(completedProcesses);
    setGanttData(ganttProcesses);
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
          <div style={{ marginTop: "20px" }}>
            <h3>Average Waiting Time: {avgWaitingTime.toFixed(2)} ms</h3>
            <h3>Average Turnaround Time: {avgTurnaroundTime.toFixed(2)} ms</h3>
          </div>
        </div>
      )}

      {ganttData.length > 0 && (
        <div>
          <h3>Gantt Chart</h3>
          <div
            style={{
              display: "flex",
              border: "1px solid #ccc",
              padding: "10px",
              overflowX: "auto",
            }}
          >
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

export default SJF;
