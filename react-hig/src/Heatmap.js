import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Heatmap = () => {
  const teachersData = [
    {
      id: 1,
      name: "Test testsson",
      workPercentages: Array.from({ length: 52 }, () =>
        Math.floor(Math.random() * 5)
      ), // Generating 52 random integers between 0 and 4
      listOfCourses: [
        {
          id: 1,
          name: "Course A",
          speed: 0.5,
          timescope: "210101-210601",
          department: "datavetenskap",
        },
        {
          id: 2,
          name: "Course B",
          speed: 0.6,
          timescope: "210201-210701",
          department: "datavetenskap",
        },
      ],
      department: "datavetenskap",
    },
    {
      id: 2,
      name: "Jane Smith",
      workPercentages: Array.from({ length: 52 }, () =>
        Math.floor(Math.random() * 5)
      ), // Generating 52 random integers between 0 and 4
      listOfCourses: [
        {
          id: 3,
          name: "Course C",
          speed: 0.7,
          timescope: "210301-345",
          department: "datavetenskap",
        },
        {
          id: 4,
          name: "Course D",
          speed: 0.8,
          timescope: "678-210901",
          department: "datavetenskap",
        },
      ],
      department: "datavetenskap",
    },
    {
      id: 3,
      name: "Test Test",
      workPercentages: Array.from({ length: 52 }, () =>
        Math.floor(Math.random() * 5)
      ), // Generating 52 random integers between 0 and 4
      listOfCourses: [
        {
          id: 5,
          name: "Course E",
          speed: 0.9,
          timescope: "210301-267867810801",
          department: "datavetenskap",
        },
        {
          id: 6,
          name: "Course F",
          speed: 0.1,
          timescope: "6324-210901",
          department: "datavetenskap",
        },
      ],
      department: "datavetenskap",
    },
    {
      id: 4,
      name: "Ogaboga hej",
      workPercentages: Array.from({ length: 52 }, () =>
        Math.floor(Math.random() * 5)
      ), // Generating 52 random integers between 0 and 4
      listOfCourses: [
        {
          id: 7,
          name: "Course G",
          speed: 0.11,
          timescope: "123213-210801",
          department: "datavetenskap",
        },
        {
          id: 8,
          name: "Course H",
          speed: 0.12,
          timescope: "6136-210901",
          department: "datavetenskap",
        },
      ],
      department: "datavetenskap",
    },
    // Add more teachers as needed
  ];

  // Define the number of teachers and weeks
  //const numTeachers = 40;
  const numTeachers = teachersData.length;
  const numWeeks = 52;
  const width = 1200;

  const margin = { top: 70, right: 20, bottom: 60, left: 200 }; // Adjusted margins
  // Calculate the height based on the number of teachers
  const cellHeight = 15; // Change this value as needed for cell height
  const cellPadding = 2; // Change this value as needed for cell padding
  const height = numTeachers * (cellHeight + cellPadding) + 2 * margin.top;

  const heatmapData = [];
  teachersData.forEach((teacher, teacherIndex) => {
    teacher.workPercentages.forEach((value, weekIndex) => {
      // Push an object for each cell to heatmapData array
      heatmapData.push({
        teacher: teacherIndex,
        week: weekIndex,
        value: value, // Here, you should use the actual work percentage for the cell value
      });
    });
  });
  const teacherNames = teachersData.map((teacher) => teacher.name);

  // State to hold the selected teacher's data
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Set the default teacher

  // Handler for teacher click event
  const handleTeacherClick = (teacherIndex) => {
    setSelectedTeacher(teacherIndex);
  };
  const CourseTable = ({ selectedTeacher, setSelectedTeacher }) => {
    const allCourses = teachersData.flatMap((teacher) =>
      teacher.listOfCourses.map((course) => ({
        ...course,
        teacherName: teacher.name,
      }))
    );

    const handleReset = () => {
      setSelectedTeacher(null);
    };

    if (selectedTeacher === null) {
      return (
        <div>
          <h2>All Teachers' Courses</h2>
          <button onClick={handleReset}>Reset Selected Teacher</button>
          <table>
            {/* Table header */}
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Course Name</th>
                <th>Speed</th>
                <th>Time Scope</th>
                <th>Department</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {allCourses.map((course, index) => (
                <tr key={index}>
                  <td>{course.teacherName}</td>
                  <td>{course.name}</td>
                  <td>{course.speed}</td>
                  <td>{course.timescope}</td>
                  <td>{course.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (!selectedTeacher.listOfCourses) {
      return null;
    }

    return (
      <div>
        <h2>{selectedTeacher.name}'s Courses</h2>
        <button onClick={handleReset}>Reset Selected Teacher</button>
        <table>
          {/* Table header */}
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Speed</th>
              <th>Time Scope</th>
              <th>Department</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {selectedTeacher.listOfCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.speed}</td>
                <td>{course.timescope}</td>
                <td>{course.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Define the dimensions of the heatmap

  // Update the heatmap SVG's height
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Add labels for the color scale
  const colorLabels = ["150", "120", "100", "80", "60"];
  // Create a separate SVG for the color scale
  const colorScaleSvg = d3
    .create("svg")
    .attr("width", 50) // Increased width to accommodate labels
    .attr("height", height)
    .attr("viewBox", [0, 0, 70, height]);

  // Create a linear color scale for the color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4])
    .range(["#ea4e51", "#fdae61", "#8abf86", "#5aa7d1", "#2b83ba"]);

  // Calculate the total height occupied by the squares
  const totalColorScaleHeight = colorLabels.length * 50; // Assuming each square is 50 units tall

  // Calculate the top position for center alignment
  const topPosition = (height - totalColorScaleHeight) / 2;

  colorScaleSvg
    .selectAll("rect")
    .data(colorLabels) // Use color labels to bind data once for each color
    .join("rect")
    .attr("width", 50) // Width of the color scale
    .attr("height", 50) // Height of each square
    .attr("x", 0)
    .attr("y", (d, i) => topPosition + i * 50) // Position each square accordingly for vertical alignment
    .attr("fill", (d, i) => colorScale(i)); // Use the index as the domain value

  colorScaleSvg
    .selectAll("text")
    .data(colorLabels)
    .join("text")
    .attr("x", 25) // Position of text labels at the center of squares
    .attr("y", (d, i) => topPosition + i * 50 + 25) // Align text labels vertically centered with squares
    .attr("dy", "0.35em")
    .style("font-size", "15px")
    .style("text-anchor", "middle") // Align text horizontally at the center
    .style("font-weight", "bold")
    .text((d) => d);

  // Create scales for x and y axes
  const xScale = d3
    .scaleBand()
    .domain(d3.range(numWeeks))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // Update the scales for x and y axes using the new height
  const yScale = d3
    .scaleBand()
    .domain(teacherNames)
    .range([margin.top, height - margin.bottom])
    .padding(cellPadding / (cellHeight + cellPadding));

  const cells = svg
    .selectAll("g")
    .data(heatmapData) // Use heatmapData here
    .enter()
    .append("g")
    .attr(
      "transform",
      (d) => `translate(${xScale(d.week)},${yScale(teacherNames[d.teacher])})`
    );

  cells
    .append("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(d.value));

  const labelWidth = 1; // Increase or decrease this value as needed

  const teacherLabels = svg
    .selectAll("text.teacher")
    .data(teachersData)
    .enter()
    .append("text")
    .attr("class", "teacher")
    .attr("x", margin.left - labelWidth) // Adjust the positioning of the labels
    .attr("y", (d, i) => yScale(d.name) + yScale.bandwidth() / 2)
    .attr("dx", "-10px") // Shift the text to the left
    .attr("text-anchor", "end")
    .style("font-size", "12px") // Set the font size
    .text((d) => d.name)
    .style("cursor", "pointer")
    .on("click", (d, i) => handleTeacherClick(i));

  // Create vertical lines to represent periods
  const periodLines = [13, 26, 39, 52]; // Divide 52 weeks into 4 periods
  svg
    .selectAll(".period-line")
    .data(periodLines)
    .enter()
    .append("line")
    .attr("class", "period-line")
    .attr("x1", (d) => xScale(d - 1) + xScale.bandwidth() / 2) // Adjust x-coordinate to place lines between weeks
    .attr("x2", (d) => xScale(d - 1) + xScale.bandwidth() / 2) // Adjust x-coordinate to place lines between weeks
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom)
    .style("stroke", "black")
    .style("stroke-width", 1.5); // Increase stroke width here (adjust as needed)

  // Text labels for periods
  const periodText = ["Period 1", "Period 2", "Period 3", "Period 4"];

  svg
    .selectAll(".period-text")
    .data(periodText)
    .enter()
    .append("text")
    .attr("class", "period-text")
    .attr("x", (d, i) => {
      const sectionWidth = (width - margin.left - margin.right) / 4; // Calculate the width of each section
      return margin.left + sectionWidth * i + sectionWidth / 2; // Calculate the x-position for each label
    })
    .attr("y", margin.top - 30) // Adjust the distance from the top of the heatmap
    .text((d) => d)
    .style("text-anchor", "middle")
    .style("font-style", "italic");

  // Create x-axis with only week numbers
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickValues(d3.range(numWeeks))
        .tickFormat((d) => `${d + 1}`)
    );

  // Label for "Week:"
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left) // Centering the label
    .attr("y", height - 20)
    .text("Week:")
    .style("font-weight", "bold")
    .style("text-anchor", "middle"); // Center the text horizontally

  // Label for "Teachers:"
  svg
    .append("text")
    .attr("y", margin.top - 15)
    .attr("x", margin.left - 30)
    .style("text-anchor", "middle")
    .text("Teachers:")
    .style("font-weight", "bold");

  // Create a reference to a div element
  const divRef = useRef(null);

  // Use the useEffect hook to append the SVG elements to the div element
  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = ""; // Clear the content before appending
      divRef.current.appendChild(svg.node());
      divRef.current.appendChild(colorScaleSvg.node());
    }
  }, [divRef, svg, colorScaleSvg]);

  // Return the div element as a React component
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Render heatmap */}
      <div ref={divRef} />

      {/* Render CourseTable component with selected teacher's data */}
      <div style={{ marginTop: "20px" }}>
        {" "}
        {/* Adjust margin as needed */}
        <CourseTable
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
        />
      </div>
    </div>
  );
};

export default Heatmap;
