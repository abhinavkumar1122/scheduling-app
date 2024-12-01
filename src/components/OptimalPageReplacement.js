import React, { useState } from "react";

const OptimalPageReplacement = () => {
  const [pages, setPages] = useState("");
  const [frameSize, setFrameSize] = useState("");
  const [hits, setHits] = useState(null);
  const [misses, setMisses] = useState(null);
  const [states, setStates] = useState([]); // To track all states

  // Function to check whether a page exists in a frame
  const search = (key, frames) => {
    for (let i = 0; i < frames.length; i++) {
      if (frames[i] === key) {
        return true;
      }
    }
    return false;
  };

  // Function to predict the frame to replace
  const predict = (pages, frames, pn, index) => {
    let res = -1,
      farthest = index;
    for (let i = 0; i < frames.length; i++) {
      let j;
      for (j = index; j < pn; j++) {
        if (frames[i] === pages[j]) {
          if (j > farthest) {
            farthest = j;
            res = i;
          }
          break;
        }
      }
      if (j === pn) {
        return i;
      }
    }
    return res === -1 ? 0 : res;
  };

  // Optimal page replacement algorithm
  const optimalPage = () => {
    const pg = pages.split(",").map(Number); // Convert input string to an array of numbers
    const pn = pg.length;
    const fn = parseInt(frameSize, 10);

    if (isNaN(fn) || fn <= 0 || pn === 0) {
      alert("Please provide valid input!");
      return;
    }

    let frames = [];
    let hit = 0;
    let statesLog = []; // To log each state

    for (let i = 0; i < pn; i++) {
      const currentPage = pg[i];
      let result;

      // Page found in a frame: HIT
      if (search(currentPage, frames)) {
        hit++;
        result = `HIT`;
      } else {
        // Page not found in a frame: MISS
        result = `MISS`;

        // If there is space available in frames
        if (frames.length < fn) {
          frames.push(currentPage);
        } else {
          // Find the page to be replaced
          const j = predict(pg, frames, pn, i + 1);
          frames[j] = currentPage;
        }
      }

      // Log the current state
      statesLog.push({
        page: currentPage,
        result,
        frames: [...frames], // Store a copy of the frames
      });
    }

    setHits(hit);
    setMisses(pn - hit);
    setStates(statesLog);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Optimal Page Replacement Algorithm</h2>
      <div>
        <label>Page Reference String (comma-separated): </label>
        <input
          type="text"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder="e.g., 7,0,1,2,0,3"
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>Frame Size: </label>
        <input
          type="number"
          value={frameSize}
          onChange={(e) => setFrameSize(e.target.value)}
          placeholder="e.g., 4"
        />
      </div>
      <button
        onClick={optimalPage}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Calculate
      </button>
      {hits !== null && misses !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results:</h3>
          <p>
            <strong>Number of Hits:</strong> {hits}
          </p>
          <p>
            <strong>Number of Misses:</strong> {misses}
          </p>
          <h3>Step-by-Step State:</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Step
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Page
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Result
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Frames
                </th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {state.page}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {state.result}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {state.frames.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OptimalPageReplacement;
