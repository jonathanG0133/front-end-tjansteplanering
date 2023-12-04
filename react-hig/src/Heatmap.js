import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Heatmap = () => {
  // Define the number of teachers and weeks
  const numTeachers = 40;
  const numWeeks = 52;
  const width = 1200;

  const margin = { top: 60, right: 20, bottom: 60, left: 80 }; // Adjusted margins
  // Calculate the height based on the number of teachers
  const cellHeight = 15; // Change this value as needed for cell height
  const cellPadding = 2; // Change this value as needed for cell padding
  const height = numTeachers * (cellHeight + cellPadding) + 2 * margin.top;

  // Generate random data for teachers and weeks with the 'value' property
  const data = Array.from({ length: numTeachers * numWeeks }, (_, index) => {
    const uniqueValue = Math.floor(Math.random() * 5); // Generates random values from 0 to 4
    return {
      teacher: Math.floor(index / numWeeks), // Assign teachers
      week: index % numWeeks, // Assign weeks
      value: uniqueValue, // Assign a random value between 0 and 4
    };
  });

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
    .range(["red", "orange", "green", "cyan", "blue"]);

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
    .domain(d3.range(numTeachers))
    .range([margin.top, height - margin.bottom])
    .padding(cellPadding / (cellHeight + cellPadding));

  // Create the rectangles for the heatmap
  const cells = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d.week))
    .attr("y", (d) => yScale(d.teacher))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(d.value));

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
    .style("stroke-width", 5); // Increase stroke width here (adjust as needed)

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
    .attr("x", width / 2)
    .attr("y", height - 20)
    .text("Week:")
    .style("font-weight", "bold");

  // Label for "Teachers:"
  svg
    .append("text")
    .attr("y", margin.top - 15)
    .attr("x", margin.left - 30)
    .style("text-anchor", "middle")
    .text("Teachers:")
    .style("font-weight", "bold");

  // Create y-axis with teacher labels
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).tickFormat((d) => `Teacher ${d + 1}`));

  // Create a reference to a div element
  const divRef = useRef(null);

  // Use the useEffect hook to append the SVG elements to the div element
  useEffect(() => {
    if (divRef.current) {
      divRef.current.appendChild(svg.node());
      divRef.current.appendChild(colorScaleSvg.node());
    }
  }, [divRef, svg, colorScaleSvg]);

  // Return the div element as a React component
  return <div ref={divRef} />;
};

export default Heatmap;
