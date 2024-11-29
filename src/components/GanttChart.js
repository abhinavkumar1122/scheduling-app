import React from "react"; // You can create a separate CSS file for styling

const GanttChart = ({ processes }) => {
  return (
    <div className="gantt-container">
      {processes.map((process, index) => (
        <div key={index} className="gantt-row">
          <div className="gantt-bar" style={{ left: `${process.start}%`, width: `${process.end - process.start}%` }}>
            <span className="gantt-label">P{process.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GanttChart;
