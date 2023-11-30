import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Heatmap = () => {
  // Create a random data array with 14600 values between 0 and 1
  const data = Array.from({ length: 14600 }, (_, index) => {
    const uniqueValue = Math.random();
    return {
      row: Math.floor(index / 365), // Update to match the number of squares on the y-axis
      col: index % 365, // Update to match the number of squares on the x-axis
      value: uniqueValue,
    };
  });

  // Define the dimensions of the heatmap
  const width = 1400;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

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

  // Create a band scale to map the row and col values to pixel values
  const xScale = d3
    .scaleBand()
    .domain(d3.range(365))
    .range([margin.left, width - margin.right])
    .padding(0.01);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(40))
    .range([margin.top, height - margin.bottom])
    .padding(0.01);

  // Create the rectangles for the heatmap
  const cells = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d.col))
    .attr("y", (d) => yScale(d.row))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(d.value));

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
