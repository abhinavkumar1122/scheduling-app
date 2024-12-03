import React, { useState } from "react";

function SRTF() {
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

  const calculateSRTF = () => {
    let currentTime = 0;
    let remainingProcesses = processes.map((p) => ({
      ...p,
      remaining_time: p.burst_time,
      completion_time: 0,
      turnaround_time: 0,
      waiting_time: 0,
    }));
    const completedProcesses = [];
    const ganttChartData = [];
    let totalProcesses = processes.length;

    while (completedProcesses.length < totalProcesses) {
      const time = currentTime;

      // Get available processes that have arrived and still need time to complete
      const availableProcesses = remainingProcesses.filter(
        (p) => p.arrival_time <= time && p.remaining_time > 0
      );

      if (availableProcesses.length === 0) {
        // No process is available at this time, move the time forward to the next available process
        currentTime = Math.min(
          ...remainingProcesses.filter((p) => p.remaining_time > 0).map((p) => p.arrival_time)
        );
        continue;
      }

      // Sort processes by remaining time (Shortest Remaining Time First)
      availableProcesses.sort((a, b) => a.remaining_time - b.remaining_time);
      const currentProcess = availableProcesses[0];

      // Process is running for 1 unit of time
      currentProcess.remaining_time -= 1;
      ganttChartData.push({
        name: `P${currentProcess.pid}`,
        startTime: currentTime,
        endTime: currentTime + 1,
      });
      currentTime += 1;

      if (currentProcess.remaining_time === 0) {
        // If process is completed, calculate times
        currentProcess.completion_time = currentTime;
        currentProcess.turnaround_time = currentProcess.completion_time - currentProcess.arrival_time;
        currentProcess.waiting_time = currentProcess.turnaround_time - currentProcess.burst_time;
        completedProcesses.push(currentProcess);
      }
    }

    const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waiting_time, 0);
    const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaround_time, 0);

    setAvgWaitingTime((totalWaitingTime / totalProcesses).toFixed(2));
    setAvgTurnaroundTime((totalTurnaroundTime / totalProcesses).toFixed(2));

    setResults(completedProcesses);
    setGanttData(ganttChartData);
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
        <>
          <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "center" }}>
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
          <h3>Average Waiting Time: {avgWaitingTime} ms</h3>
          <h3>Average Turnaround Time: {avgTurnaroundTime} ms</h3>
          {ganttData.length > 0 && (
            <div>
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
        </>
      )}
    </div>
  );
}

export default SRTF;
