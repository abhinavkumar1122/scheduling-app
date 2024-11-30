import React from "react";

const GanttChart = ({ processes }) => {
  const totalTime = processes.reduce((acc, process) => acc + process.endTime - process.startTime, 0);

  return (
    <div className="gantt-chart-container">
      <div className="gantt-chart">
        {processes.map((process, index) => (
          <div key={index} className="gantt-row">
            <div
              className="gantt-bar"
              style={{
                left: `${(process.startTime / totalTime) * 100}%`, // Normalize start time
                width: `${((process.endTime - process.startTime) / totalTime) * 100}%`, // Normalize width
              }}
            >
              <span className="gantt-label">P{process.name}</span>
              <span className="timestamp">
                {process.startTime} - {process.endTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;

