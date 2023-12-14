import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import CourseTable from "./CourseTable";

const Heatmap = () => {
  const [teachersData, setTeachersData] = useState([]);
  const divRef = useRef(null);
  const tooltipRef = useRef(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetch(
      "http://localhost:8080/commitment/getInfoForAllStaffWithCode?date=2023-01-01&code="
    )
      .then((response) => response.json())
      .then((data) => {
        setTeachersData(data);
        drawHeatmap(data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const drawHeatmap = (data) => {
    const numTeachers = data.length;
    const numWeeks = 52;
    const width = Math.floor(window.innerWidth * 0.75);
    const margin = { top: 70, right: 20, bottom: 60, left: 200 };
    const cellHeight = 15;
    const cellPadding = 2;
    const height = numTeachers * (cellHeight + cellPadding) + 2 * margin.top;

    const heatmapData = [];
    data.forEach((teacher, teacherIndex) => {
      teacher.workLoad.forEach((value, weekIndex) => {
        heatmapData.push({
          teacher: teacherIndex,
          week: weekIndex,
          value: value,
        });
      });
    });

    const teacherNames = data.map((teacher) => teacher.name);

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const xScale = d3
      .scaleBand()
      .domain(d3.range(numWeeks))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(teacherNames)
      .range([margin.top, height - margin.bottom])
      .padding(cellPadding / (cellHeight + cellPadding));

    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, 1]);

    svg
      .selectAll("g")
      .data(heatmapData)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.week)},${yScale(teacherNames[d.teacher])})`
      )
      .append("rect")
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.value))
      .on("mouseover", (event, d) => {
        setTooltipVisible(true);
        setTooltipContent(
          `Teacher: ${teacherNames[d.teacher]} Workload Percentage: ${d.value}`
        );
        tooltipRef.current.style.left = `${event.pageX}px`;
        tooltipRef.current.style.top = `${event.pageY}px`;
      })
      .on("mouseout", () => setTooltipVisible(false))
      .on("click", (event, d) => setSelectedTeacher(data[d.teacher]));

    divRef.current.innerHTML = "";
    divRef.current.appendChild(svg.node());
  };

  const handleRestartClick = () => {
    setSelectedTeacher(null);
    setTooltipVisible(false);
    setTooltipContent("");
  };

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div ref={divRef} />
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
        <div style={{ marginTop: "20px" }}>
          <CourseTable
            selectedTeacher={selectedTeacher}
            teachersData={teachersData}
          />
        </div>
        <button onClick={handleRestartClick} style={{ marginTop: "20px" }}>
          Restart To All Courses
        </button>
      </div>
    </div>
  );
};

export default Heatmap;
