import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import CourseTable from "./CourseTable";
import "./Heatmap.css";

const calculateHeatmapWidth = () => {
  const windowWidth = window.innerWidth;
  let width;

  if (windowWidth < 1000) {
    width = windowWidth * 0.95; // 95% of window width for screens smaller than 1000px
  } else if (windowWidth >= 1000 && windowWidth <= 1300) {
    width = windowWidth * 0.9; // 70% of window width for screens between 1000px and 1300px
  } else {
    width = 1300 * 0.9; // Max width capped at 70% of 1300px for larger screens
  }

  return width;
};

const Heatmap = () => {
  const [staffData, setStaffData] = useState([]);
  const [courseInstanceData, setCourseInstanceData] = useState([]);
  const divRef = useRef(null);
  const tooltipRef = useRef(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  const drawHeatmap = (data) => {
    if (!divRef.current || !data) {
      return;
    }

    // Clear the existing SVG to prevent duplicates
    d3.select(divRef.current).selectAll("svg").remove();

    const numStaff = data.length;
    const numWeeks = 52;
    const margin = { top: 70, right: 50, bottom: 60, left: 150 };
    const cellHeight = 15;
    const cellPadding = 2;
    const height =
      numStaff * (cellHeight + cellPadding) + margin.top + margin.bottom;

    // Calculate width based on the window size
    const width = calculateHeatmapWidth();

    const heatmapData = [];
    data.forEach((staff) => {
      staff.workLoad.forEach((workLoad, weekIndex) => {
        heatmapData.push({
          staffId: staff.id, // Use the staff's ID for mapping data
          staffName: staff.name, // Include the staff's name for the label
          week: weekIndex,
          workLoad: workLoad,
        });
      });
    });

    console.log(heatmapData[5]);

    const svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width + 100)
      .attr("height", height)
      .attr("viewBox", [0, 0, width + 100, height]);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(numWeeks))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(data.map((staff) => staff.name)) // Use staff names for the domain
      .range([margin.top, height - margin.bottom])
      .padding(cellPadding / (cellHeight + cellPadding));
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d + 1));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
      .attr("y", height - 20)
      .text("Week")
      .style("font-weight", "bold")
      .style("text-anchor", "middle");

    svg
      .append("text")
      .attr("y", margin.top - 15)
      .attr("x", margin.left - 100)
      .text("Staff")
      .style("font-weight", "bold")
      .style("text-anchor", "middle");

    const colorScale = d3
      .scaleThreshold()
      .domain([0.3, 0.5, 0.7, 0.9, 1.1, 1.3]) // Define the threshold values
      .range([
        "#C0C0C0",
        "#4E2A84",
        "#2b83ba",
        "#5aa7d1",
        "#8abf86",
        "#fdae61",
        "#ea4e51",
      ]);

    svg
      .selectAll(".heat-rect")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.week))
      .attr("y", (d) => yScale(d.staffName)) // Use the name to position along the y-axis
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.workLoad))
      .on("mouseover", (event, d) => {
        setTooltipVisible(true);
        setTooltipContent(
          `Teacher: ${d.staffName} Workload Percentage: ${d.workLoad}`
        );
        // Use d3.pointer to get coordinates relative to the SVG container
        const [x, y] = d3.pointer(event, divRef.current);

        // Get the dimensions of the tooltip
        const tooltipWidth = tooltipRef.current.offsetWidth;
        const tooltipHeight = tooltipRef.current.offsetHeight;

        // Get the relative position of the divRef (heatmap container)
        const containerRect = divRef.current.getBoundingClientRect();

        // Calculate the position for the tooltip
        let left = x + 30;
        let top = y - tooltipHeight - 70; // 10 pixels above the cursor

        // If the tooltip goes beyond the right edge of the container or window, adjust the position to the left of the cursor
        if (
          x + tooltipWidth > containerRect.right ||
          x + tooltipWidth > window.innerWidth
        ) {
          left = x - tooltipWidth - 10; // 10 pixels to the left of the cursor
        }

        // If the tooltip goes beyond the top edge of the container, adjust the position below the cursor
        if (y - tooltipHeight < containerRect.top) {
          top = y + 20; // 20 pixels below the cursor to avoid overlap
        }

        // Set the tooltip position
        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.top = `${top}px`;
      })
      .on("mouseout", () => setTooltipVisible(false))
      .on("click", (event, d) => {
        const selectedStaff = data.find((staff) => staff.id === d.staffId);
        setSelectedStaff(selectedStaff);
      });

    const legendData = colorScale
      .range()
      .map((color, index) => {
        const d = colorScale.invertExtent(color);
        if (index === 0) return { range: "< 0.3", color: color };
        if (index === colorScale.range().length - 1)
          return { range: "> 1.3", color: color };
        return { range: [d[0], d[1]], color: color };
      })
      .reverse();
    // Draw the color scale legend
    const legendWidth = 50; // Width of the color scale
    const legendHeight = 50; // Height of each square in the legend

    // Calculate the total height occupied by the legend squares
    const totalColorScaleHeight = legendData.length * legendHeight;

    // Calculate the top position for center alignment
    const topPosition = (height - totalColorScaleHeight) / 2;

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, ${topPosition})`); // Adjust vertical position

    // Draw color boxes
    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("y", (d, i) => i * legendHeight)
      .attr("fill", (d) => d.color);

    // Add centered text labels inside each color box
    legend
      .selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", legendWidth / 2) // Center the text in the box
      .attr("y", (d, i) => i * legendHeight + legendHeight / 2)
      .attr("dy", "0.35em") // Vertically center the text
      .style("text-anchor", "middle") // Horizontally center the text
      .style("font-size", "10px") // Font size
      .style("font-weight", "bold") // Make the font bold

      .text((d) =>
        typeof d.range === "string"
          ? d.range
          : `${d.range[0].toFixed(1)} - ${d.range[1].toFixed(1)}`
      );

    divRef.current.innerHTML = "";
    divRef.current.appendChild(svg.node());
  };

  // useEffect hook for fetching staff data
  useEffect(() => {
    fetch(
      "http://localhost:8080/commitment/getInfoForAllStaffWithCode?date=2023-01-01&code=7411"
    )
      .then((response) => response.json())
      .then((data) => {
        setStaffData(data);
        drawHeatmap(data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  // useEffect hook for fetching course instance data
  useEffect(() => {
    fetch("http://localhost:8080/courseInstance/getByYear?year=2023")
      .then((response) => response.json())
      .then((data2) => {
        setCourseInstanceData(data2);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);
  useEffect(() => {
    const handleResize = () => {
      drawHeatmap(staffData);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [staffData]);

  const handleRestartClick = () => {
    setSelectedStaff(null);
    setTooltipVisible(false);
    setTooltipContent("");
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          width: "100%", // Set the width to 100% of its parent
        }}
      >
        <div
          ref={divRef}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {/* Heatmap will be appended here and centered within this div */}
        </div>
        <div
          ref={tooltipRef}
          style={{
            display: tooltipVisible ? "block" : "none",
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            padding: "5px",
            zIndex: 9999,
            minWidth: "200px",
            maxWidth: "200px",
            maxHeight: "500px",
          }}
        >
          {tooltipContent}
        </div>

        <CourseTable
          selectedStaff={selectedStaff}
          courseInstanceData={courseInstanceData}
        />

        <button onClick={handleRestartClick} style={{ marginTop: "20px" }}>
          Restart To All Courses
        </button>
      </div>
    </div>
  );
};

export default Heatmap;
