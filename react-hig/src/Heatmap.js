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

const Heatmap = ({ inputText }) => { 
  if (!inputText) {
    inputText = new Date().getFullYear();
  }

  const [staffView, setStaffView] = useState(false);
  const [staffData, setStaffData] = useState([]);

  const [singleStaffView, setSingleStaffView] = useState(false);

  const [departmentData, setDepartmentData] = useState([]);
  const [departmentCode, setDepartmentCode] = useState("");

  const [courseInstanceData, setCourseInstanceData] = useState([]);
  

  const divRef = useRef(null);
  const tooltipRef = useRef(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  const drawHeatmap = (data) => {
    if (!divRef.current || !data || !Array.isArray(data)) {
      console.error('Invalid data:', data);
      return;
    }
    // Clear the existing SVG to prevent duplicates
    d3.select(divRef.current).selectAll("svg").remove();
    const numStaff = data.length;
    const numWeeks = 52;
    const margin = { top: 70, right: 50, bottom: 60, left: 150 };
    const cellHeight = 15;
    const cellPadding = 2;
    const legendHeight = 20; // Example height for 7 legend items
    const minSvgHeight = 300; // Minimum height for the SVG

    // Calculate dynamic height
    const height =
      numStaff * (cellHeight + cellPadding) + margin.top + margin.bottom;
    const totalHeight = Math.max(height + legendHeight, minSvgHeight);

    // Calculate width based on the window size
    const width = calculateHeatmapWidth();

    const heatmapData = [];

    if (staffView === true) {
      data.forEach((staff) => {
        staff.workLoad.forEach((workLoad, weekIndex) => {
          heatmapData.push({
            staffId: staff.id,
            name: staff.name,
            week: weekIndex,
            workLoad: workLoad,
          });
        });
      });
    } else {
      data.forEach((department) => {
        department.workLoad.forEach((workLoad, weekIndex) => {
          heatmapData.push({
            name: department.name,
            week: weekIndex,
            workLoad: workLoad,
          });
        });
      });
    }

    // Create SVG with dynamic height
    const svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width + 100)
      .attr("height", totalHeight)
      .attr("viewBox", [0, 0, width + 100, totalHeight]);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(numWeeks))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(data.map((entity) => entity.name))
      .range([margin.top, height - margin.bottom])
      .padding(cellPadding / (cellHeight + cellPadding));
    
      const yAxis = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .style("cursor", "pointer") // Set cursor style;
    
  
      yAxis.on("click", (event, entityClicked) => {
        if (!staffView) {
          setDepartmentCode(entityClicked);
          setStaffView(true);
          setSingleStaffView(false);
        } else {
            setSelectedStaff(staffData.find((staff) => staff.name === entityClicked));
            setSingleStaffView(true);
            drawHeatmap(staffData.filter((staff) => staff.name === entityClicked));
        } 
      });
      

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
      .text(staffView ? "Staff" : "Department")
      .style("font-weight", "bold")
      .style("text-anchor", "middle");

    const colorScale = d3
      .scaleThreshold()
      .domain([30, 50, 70, 90, 110, 130]) // Define the threshold values
      .range([
        "#171718",
        "#4E2A84",
        "#2b83ba",
        "#5aa7d1",
        "#8abf86",
        "#fdae61",
        "#ea4e51",
      ]); // C0C0C0 #1

    svg
      .selectAll(".heat-rect")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.week))
      .attr("y", (d) => yScale(d.name)) // Use the department name for the y-axis
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.workLoad))
      .on("mouseover", (event, d) => {
        setTooltipVisible(true);
        setTooltipContent(
          <div>
            {staffView ? `Staff: ${d.name}` : `Department: ${d.name}`} <br />
            Workload Percentage: {d.workLoad} % <br />
            Week: {d.week + 1}
          </div>
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
        if (staffView === true) {
          const selectedStaff = data.find((staff) => staff.id === d.staffId);
          setSelectedStaff(selectedStaff);
        }
      });

    const legendData = colorScale
      .range()
      .map((color, index) => {
        const d = colorScale.invertExtent(color);
        if (index === 0) return { range: "< 30", color: color };
        if (index === colorScale.range().length - 1)
          return { range: "> 130", color: color };
        return { range: [d[0], d[1]], color: color };
      })
      .reverse();
    // Draw the color scale legend
    const legendWidth = 70; // Width of the color scale

    // Calculate the total height occupied by the legend squares
    const totalColorScaleHeight = legendData.length * legendHeight;

    // Calculate the top position for center alignment
    const topPosition = height - totalColorScaleHeight;
    const marginTopRight = margin.top - margin.right;

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, ${marginTopRight})`); // Adjust vertical position

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
      .style("font-weight", "bold")
      .style("fill", "#f5f5f5") // Make the font bold
      .text((d) =>
        typeof d.range === "string"
          ? d.range
          : `${d.range[0].toFixed(1)} - ${d.range[1].toFixed(1)}`
      );

    divRef.current.innerHTML = "";
    divRef.current.appendChild(svg.node());
  };

  // Fetching all staff data START
  useEffect(() => {
    fetch(
      "http://localhost:8080/commitment/getInfoForAllStaffWithCode?date=" +
        inputText +
        "-01-01&code=" + departmentCode
    )
      .then((response) => response.json())
      .then((data) => {
        setStaffData(data);
        if (staffView) {
          drawHeatmap(data); // Use the updated data, not the previous state
        }
      })
      .catch((error) => console.error("Error fetching staff data: ", error));
}, [inputText, staffView, departmentCode]);
  

  // Fetching department data START
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/commitment/getDepartmentInfoByYear?date=" +
            inputText +
            "-01-01"
        );
        const data = await response.json();

        setDepartmentData(data);

        // Call drawHeatmap only if data is available and staffView is false
        if (data && !staffView) {
        drawHeatmap(data);
        }
      } catch (error) {
      console.error("Error fetching department data: ", error);
      }
    };

    fetchData();
  }, [inputText, staffView]);
  // Fetching department data END


  
  // Fetching courses data START
  useEffect(() => {
    fetch("http://localhost:8080/courseInstance/getByYear?year=" + inputText)
      .then((response) => response.json())
      .then((data2) => {
        setCourseInstanceData(data2);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [inputText]);

  useEffect(() => {
    if (staffView) {
      drawHeatmap(staffData);
    } else {
      drawHeatmap(departmentData);
    }
  }, [staffView, staffData, departmentData]);

  useEffect(() => {
    const handleResize = () => {
      drawHeatmap(staffView ? staffData : departmentData);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [staffData, departmentData, staffView]);

  const handleRestartClick = () => {
    setStaffView(false); // Make sure staff view is set to false
    setSingleStaffView(false);
    setDepartmentCode("");
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
        <div style={{ marginBottom: "10px", fontSize: "30px" }}>
          {departmentCode ? `${departmentCode}` : "All Departments"}
        </div>
        <button
          onClick={() => {
            if (singleStaffView) {
              setStaffView(true);
              setSingleStaffView(false);
              setSelectedStaff(null);
              drawHeatmap(staffData);
            } else {
              setStaffView(!staffView);
            }
          }}
          style={{ margin: "10px" }}
        >
          {singleStaffView ? "Back" : 
          staffView ? "Show Departments" : "Show Staff"}
        </button>
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
            maxWidth: "300px",
          }}
        >
          {tooltipContent}
        </div>
        <button id="resetButton" onClick={handleRestartClick} style={{ marginTop: "20px" }}>
          Reset 
        </button>

        <CourseTable
          selectedStaff={selectedStaff}
          courseInstanceData={courseInstanceData}
        />
      </div>
    </div>
  );
};

export default Heatmap;
