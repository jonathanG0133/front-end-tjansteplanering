import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useGetDataApi from "./DataApi";

const Heatmap = () => {
  // Define the number of teachers and weeks
  const numTeachers = 40;
  const numWeeks = 52;
  const dataApi = useGetDataApi();

  // Generate random data for teachers and weeks
  const data = Array.from({ length: numTeachers * numWeeks }, (_, index) => {
    const uniqueValue = Math.random();

    return {
      teacher: Math.floor(index / numWeeks), // Assign teachers
      week: index % numWeeks, // Assign weeks
      value: uniqueValue,
    };
  });
  console.log(dataApi);
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

  // Define the color scale for the heatmap
  const colorScale = d3
    .scaleSequential()
    .domain([0, 1])
    .interpolator(d3.interpolateViridis);

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
    .attr("fill", (d) => colorScale(d.value));

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

  // Use the useEffect hook to append the SVG element to the div element
  useEffect(() => {
    if (divRef.current) {
      divRef.current.appendChild(svg.node());
    }
  }, [divRef, svg]);

  // Return the div element as a React component
  return <div ref={divRef} />;
};

export default Heatmap;
