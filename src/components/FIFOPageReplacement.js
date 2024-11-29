import React, { useState } from "react";

function FifoPageReplacement() {
  const [pages, setPages] = useState([]);
  const [frameSize, setFrameSize] = useState(3); // Default frame size
  const [results, setResults] = useState(null);

  const addPage = () => {
    setPages([...pages, { pageNumber: pages.length + 1, pageValue: 0 }]);
  };

  const handlePageInputChange = (index, value) => {
    const updatedPages = [...pages];
    updatedPages[index].pageValue = parseInt(value, 10);
    setPages(updatedPages);
  };

  const calculateFifoPageReplacement = () => {
    let frames = [];
    let pageFaults = 0;
    let pageSequence = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i].pageValue;
      if (!frames.includes(page)) {
        if (frames.length < frameSize) {
          frames.push(page); // Add page to frame if there's space
        } else {
          frames.shift(); // Remove the oldest page (FIFO)
          frames.push(page); // Add the new page
        }
        pageFaults++;
      }
      pageSequence.push([...frames]); // Keep track of the page frame state after each page
    }

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
                {frame.join(" | ")} {/* Display the frames after each page access */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FifoPageReplacement;
