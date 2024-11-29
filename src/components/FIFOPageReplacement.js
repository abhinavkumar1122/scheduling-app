import React, { useState } from "react";

function FifoPageReplacement() {
  const [pages, setPages] = useState([]); // List of pages the user inputs
  const [frameSize, setFrameSize] = useState(3); // Default frame size
  const [results, setResults] = useState(null);

  // Add a new page with an initial value of 0
  const addPage = () => {
    setPages([...pages, { pageNumber: pages.length + 1, pageValue: 0 }]);
  };

  // Handle change in the page value input
  const handlePageInputChange = (index, value) => {
    const updatedPages = [...pages];
    updatedPages[index].pageValue = parseInt(value, 10);
    setPages(updatedPages);
  };

  // Calculate FIFO page replacement
  const calculateFifoPageReplacement = () => {
    let frames = new Array(frameSize).fill(null); // Initialize frames with null values
    let pageFaults = 0;
    let pageSequence = [];
    let nextInsertIndex = 0; // The next index where a page should be inserted

    // Iterate over each page in the sequence
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i].pageValue;
      const pageIndex = frames.indexOf(page); // Check if page already exists in frames

      if (pageIndex === -1) {
        // Page is not in the frame, we have a page fault
        frames[nextInsertIndex] = page; // Place the page in the next available position
        pageFaults++;

        // Update nextInsertIndex to the next position, wrapping around if necessary
        nextInsertIndex = (nextInsertIndex + 1) % frameSize;
      }

      // Store the current state of the frames
      pageSequence.push([...frames]);
    }

    // Store results for rendering
    setResults({ pageSequence, pageFaults });
  };

  return (
    <div>
      <h2>FIFO Page Replacement</h2>
      <button onClick={addPage}>Add Page</button>
      <div>
        <label>
          Frame Size:
          <input
            type="number"
            value={frameSize}
            onChange={(e) => setFrameSize(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div>
        <label>
          Pages:
          {pages.map((page, index) => (
            <div key={index}>
              <label>
                Page {page.pageNumber}:
                <input
                  type="number"
                  value={page.pageValue}
                  onChange={(e) => handlePageInputChange(index, e.target.value)}
                />
              </label>
            </div>
          ))}
        </label>
      </div>
      <button onClick={calculateFifoPageReplacement}>Calculate FIFO Page Replacement</button>
      {results && (
        <div>
          <h3>Results</h3>
          <p>Total Page Faults: {results.pageFaults}</p>
          <h4>Page Frame Sequence:</h4>
          <ul>
            {results.pageSequence.map((frame, index) => (
              <li key={index}>
                {frame.map((value, idx) => (value !== null ? value : "_")).join(" | ")} {/* Display frames */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FifoPageReplacement;
