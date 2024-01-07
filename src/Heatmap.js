import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import CourseTable from "./CourseTable";
import ProjectTable from "./ProjectTable";
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
  const [sortOrder, setSortOrder] = useState("");
  const [projectData, setProjectData] = useState([]);

  const divRef = useRef(null);
  const tooltipRef = useRef(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  const drawHeatmap = (data) => {
    if (!divRef.current || !data || !Array.isArray(data)) {
      console.error("Invalid data:", data);
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
      .style("cursor", "pointer"); // Set cursor style;

    yAxis.on("click", (event, entityClicked) => {
      if (!staffView) {
        setDepartmentCode(entityClicked);
        setStaffView(true);
        setSingleStaffView(false);
      } else {
        setSelectedStaff(
          staffData.find((staff) => staff.name === entityClicked)
        );
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
        "#a3a3a3",
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
      .on("click", (event, entityClicked) => {
        if (!staffView) {
          setDepartmentCode(entityClicked.name);
          setStaffView(true);
          setSingleStaffView(false);
        } else {
          const selected = staffData.find(
            (staff) => staff.name === entityClicked.name
          );
          setSelectedStaff(selected);
          setSingleStaffView(true);
          drawHeatmap(
            staffData.filter((staff) => staff.name === entityClicked.name)
          );
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
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://node128935-tjansteplanering.jls-sto2.elastx.net/commitment/getInfoForAllStaffWithCode?date=" +
            inputText +
            "-01-01&code=" +
            departmentCode
        );
        const data = await response.json();
        setStaffData(data);
        if (singleStaffView && selectedStaff) {
          // Find the updated data for the selected staff
          const updatedSelectedStaff = data.find(
            (staff) => staff.id === selectedStaff.id
          );
          setSelectedStaff(updatedSelectedStaff);
          setCourseInstanceData(updatedSelectedStaff.courseInstances);
        }
      } catch (error) {
        console.error("Error fetching staff data: Invalid Year");
      }
    };

    fetchData();
  }, [inputText, staffView, departmentCode]);

  // Fetching department data START
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://node128935-tjansteplanering.jls-sto2.elastx.net/commitment/getDepartmentInfoByYear?date=" +
            inputText +
            "-01-01"
        );
        const data = await response.json();

        setDepartmentData(data);
      } catch (error) {
        console.error("Error fetching department data: Invalid Year");
      }
    };

    fetchData();
  }, [inputText, staffView]);
  // Fetching department data END

  // Fetching courses data START
  useEffect(() => {
    fetch(
      "https://node128935-tjansteplanering.jls-sto2.elastx.net/courseInstance/getByYear?year=" +
        inputText
    )
      .then((response) => response.json())
      .then((data) => {
        setCourseInstanceData(data);
      })
      .catch((error) =>
        console.error(
          "Error fetching data: Invalid Year" +
            "\n" +
            "https://media1.tenor.com/m/DUmbV7Z7eqAAAAAC/cooking-cook.gif"
        )
      );
  }, [inputText]);

  // Fetching project data START
  useEffect(() => {
    fetch(
      "https://node128935-tjansteplanering.jls-sto2.elastx.net/project/getByYear?year=" +
        inputText
    )
      .then((response) => response.json())
      .then((data) => {
        setProjectData(data);
      })
      .catch((error) =>
        console.error(
          "Error fetching data: Invalid Year" +
            "\n" +
            "https://media1.tenor.com/m/DUmbV7Z7eqAAAAAC/cooking-cook.gif"
        )
      );
  }, [inputText]);

  useEffect(() => {
    const handleResize = () => {
      drawHeatmap(staffView ? staffData : departmentData);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [staffData, departmentData, staffView]);

  useEffect(() => {
    let data;

    if (staffView) {
      if (singleStaffView && selectedStaff) {
        data = staffData.filter((staff) => staff.name === selectedStaff.name);
        console.log(selectedStaff);
      } else {
        data = staffData;
      }
    } else {
      data = departmentData;
    }

    const dataToDraw = sortOrder ? getSortedData(data, sortOrder) : data;
    drawHeatmap(dataToDraw);
  }, [
    staffView,
    staffData,
    departmentData,
    singleStaffView,
    selectedStaff,
    sortOrder,
  ]);

  const getSortedData = (data, sortOrder) => {
    // Calculate the total workload for each entity
    const entitiesWithTotalWorkload = data.map((entity) => {
      const totalWorkload = entity.workLoad.reduce(
        (acc, week) => acc + week,
        0
      );
      return { ...entity, totalWorkload };
    });

    // Sort the entities based on total workload
    let sorted = [...entitiesWithTotalWorkload];
    if (sortOrder === "descending") {
      sorted.sort((a, b) => b.totalWorkload - a.totalWorkload);
    } else if (sortOrder === "ascending") {
      sorted.sort((a, b) => a.totalWorkload - b.totalWorkload);
    }

    return sorted;
  };

  const sortedData = useMemo(() => {
    const data = staffView ? staffData : departmentData;
    return getSortedData(data, sortOrder);
  }, [sortOrder, staffView]);

  useEffect(() => {
    drawHeatmap(sortedData);
  }, [sortedData]);

  const handleRestartClick = () => {
    setStaffView(false); // Make sure staff view is set to false
    setSingleStaffView(false);
    setDepartmentCode("");
    setSelectedStaff(null);
    setTooltipVisible(false);
    setTooltipContent("");
  };

  const handleSortByWorkloadClick = () => {
    if (sortOrder === "" || sortOrder === "ascending") {
      setSortOrder("descending");
    } else {
      setSortOrder("ascending");
    }
  };

  const handleResetSortClick = () => {
    setSortOrder("");
  };

  return (
    <div className="main-container">
      <div style={{ fontSize: "25px", fontWeight: "bold" }}>
        {departmentCode ? `${departmentCode}` : "All Departments"}
      </div>
      <div className="button-container">
        {!singleStaffView && (
          <>
            <button onClick={handleSortByWorkloadClick} className="sort-button">
              {sortOrder === ""
                ? "Sort by Workload"
                : `Workload ${sortOrder === "ascending" ? "⮝" : "⮟"}`}
            </button>

            {sortOrder === ""
              ? "Sort by Workload"
              : `Workload ${
                  sortOrder === "ascending" ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )
                }`}
          </>
        )}

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
          className="reset-button"
        >
          {singleStaffView
            ? "Back"
            : staffView
            ? "Show Departments"
            : "Show Staff"}
        </button>
      </div>

      <div
        ref={divRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        {/* Heatmap is rendered here */}
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
      <button
        id="resetButton"
        onClick={handleRestartClick}
        style={{ marginTop: "20px" }}
      >
        Reset
      </button>
      <div className="tables">
        <CourseTable
          selectedStaff={selectedStaff}
          courseInstanceData={courseInstanceData}
        />
        <ProjectTable selectedStaff={selectedStaff} projectData={projectData} />
      </div>
    </div>
  );
};

export default Heatmap;
