import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Heatmap = () => {
  // Define the number of teachers and weeks
  const numTeachers = 40;
  const numWeeks = 52;

  // Generate random data for teachers and weeks
  const data = Array.from({ length: numTeachers * numWeeks }, (_, index) => {
    const uniqueValue = Math.random();
    return {
      teacher: Math.floor(index / numWeeks), // Assign teachers
      week: index % numWeeks, // Assign weeks
      value: uniqueValue,
    };
  });

  // Define the dimensions of the heatmap
  const width = 1400;
  const height = 800; // Increased height to accommodate teacher labels
  const margin = { top: 60, right: 20, bottom: 60, left: 80 }; // Adjusted margins

  // Create an SVG element to hold the heatmap
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Create a separate SVG for the color scale
  const colorScaleSvg = d3.create("svg")
    .attr("width", 50) // Increased width to accommodate labels
    .attr("height", height)
    .attr("viewBox", [0, 0, 50, height]);

  // Create a linear color scale for the color scale
  const colorScale = d3
    .scaleLinear()
    .domain([1, 1 / 2, 0])
    .range(["blue", "green", "red"]);

  // Create rectangles for the color scale
  colorScaleSvg
    .selectAll("rect")
    .data(d3.range(height))
    .join("rect")
    .attr("width", 20) // Width of the color scale
    .attr("height", 1)
    .attr("x", 0)
    .attr("y", (d) => d)
    .attr("fill", (d) => colorScale(d / height));

  // Add labels for the color scale
  const colorLabels = ["< 100%", "100%", "> 100%"];

  colorScaleSvg
    .selectAll("text")
    .data(colorLabels)
    .join("text")
    .attr("x", 30) // Positionen för texten (justera detta värde)
    .attr("y", (d, i) => (i * height) / (colorLabels.length - 1) + 6) // Positionen för texten (justera detta värde)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("text-anchor", "start")
    .text((d) => d);

  // Define the color scale for the heatmap
  const customColorScale = d3
    .scaleLinear()
    .domain([1, 1 / 2, 0])
    .range(["red", "green", "blue"])
    .interpolate(d3.interpolateRgb);

  // Create scales for x and y axes
  const xScale = d3
    .scaleBand()
    .domain(d3.range(numWeeks))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(numTeachers))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);

  // Create the rectangles for the heatmap
  const cells = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d.week))
    .attr("y", (d) => yScale(d.teacher))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => customColorScale(d.value));

  // Create vertical lines to represent periods
  const periodLines = [13, 26, 39, 52]; // Divide 52 weeks into 4 periods
  svg
    .selectAll(".period-line")
    .data(periodLines)
    .enter()
    .append("line")
    .attr("class", "period-line")
    .attr("x1", (d) => xScale(d - 0.5))
    .attr("x2", (d) => xScale(d - 0.5))
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom)
    .style("stroke", "black")
    .style("stroke-dasharray", "3,3");

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
  