import React from "react"; 

const GanttChart = ({ processes }) => {
  return (
    <div className="gantt-chart-container">
      <div className="gantt-chart">
        {processes.map((process, index) => (
          <div key={index} className="gantt-row">
            <div
              className="gantt-bar"
              style={{
                left: `${process.start}%`, // Start position based on the percentage
                width: `${process.end - process.start}%`, // Width of the bar
              }}
            >
              <span className="gantt-label">P{process.name}</span>
              {/* Add timestamp above the bar */}
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
