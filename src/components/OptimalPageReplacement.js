import React, { useState } from "react";

function OptimalPageReplacement() {
  const [pages, setPages] = useState([]); // Pages the user enters
  const [frameSize, setFrameSize] = useState(3); // Default frame size
  const [results, setResults] = useState(null); // Results to display

  // Add a page with a default value of 0
  const addPage = () => {
    setPages([...pages, { pageNumber: pages.length + 1, pageValue: 0 }]);
  };

  // Handle page input changes (change the page value)
  const handlePageInputChange = (index, value) => {
    const updatedPages = [...pages];
    updatedPages[index].pageValue = parseInt(value, 10);
    setPages(updatedPages);
  };

  // Function to calculate Optimal Page Replacement
  const calculateOptimalPageReplacement = () => {
    let frames = new Array(frameSize).fill(null); // Initialize frames with null values
    let pageFaults = 0;
    let pageSequence = [];

    // Iterate over the pages
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i].pageValue;
      const pageIndex = frames.indexOf(page);

      if (pageIndex === -1) {
        // If page is not in frames, we have a page fault
        if (frames.includes(null)) {
          // If there is an empty slot, place the page there
          const emptyIndex = frames.indexOf(null);
          frames[emptyIndex] = page;
        } else {
          // If no empty slot, we need to evict a page (use optimal algorithm)
          const futureUses = [];

          // For each page in the frame, calculate when it will be used next (after current page)
          for (let j = 0; j < frames.length; j++) {
            const framePage = frames[j];
            // Find the next occurrence of the page in the remaining sequence
            const nextUse = pages.slice(i + 1).indexOf(framePage);
            futureUses.push(nextUse === -1 ? Infinity : nextUse); // If not found, set as Infinity
          }

          // Find the page that will not be used for the longest period (the farthest in future)
          const farthestIndex = futureUses.indexOf(Math.max(...futureUses));

          // Replace that page with the new page
          frames[farthestIndex] = page;
        }
        pageFaults++;
      }

      // Keep track of the page frame state after each page access
      pageSequence.push([...frames]);
    }

    setResults({ pageSequence, pageFaults });
  };

  return (
    <div>
      <h2>Optimal Page Replacement</h2>
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
        <label>Pages:</label>
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
      </div>
      <button onClick={calculateOptimalPageReplacement}>Calculate Optimal Page Replacement</button>

      {results && (
        <div>
          <h3>Results</h3>
          <p>Total Page Faults: {results.pageFaults}</p>
          <h4>Page Frame Sequence:</h4>
          <ul>
            {results.pageSequence.map((frame, index) => (
              <li key={index}>
                {frame.map((value, idx) => (value !== null ? value : "_")).join(" | ")}
                {/* Display the frames after each page access, use _ for empty slots */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OptimalPageReplacement;
