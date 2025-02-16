const margin = {top: 40, left: 60};
const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.8;

const svg = d3.select(".d3-chart")
  .append("svg")
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', '0 0 ' + window.innerWidth  + ' ' + window.innerHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./marriage-rate-and-divorce-rate.csv").then(data => {  // fetching data
  const xVals = data.map((d) => +d.Year); // xscale range
  const yVals = data.map((d) => +d.Count);  // yscale range

  const xDomain = [Math.min(...xVals) - 1, Math.max(...xVals) + 1];
  const yDomain = [Math.min(...yVals) - 1, Math.max(...yVals) + 1];

  // Add X axis
  const x = d3.scaleLinear()
    .domain(xDomain)
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain(yDomain)
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(20));

  // Color scale: Blue for Marriage Rate and Red for Divorce Rate
  const color = d3.scaleOrdinal()
    .domain(["Marriage Rate", "Divorce Rate"])
    .range([ '#377eb8', '#e41a1c']);

  drawScatterPlot();
  drawLineChart();

  function drawScatterPlot() {
    svg.append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", function (d) { return x(d.Year); } )
      .attr("cy", function (d) { return y(d.Count); } )
      .attr("r", 4)
      .style("fill", d => color(d["General Marriage_Rate_and Divorce_Rate"]))
  }

  function drawLineChart() {
    // group the data to draw one line per group
    const sumstat = d3.group(data, d => d["General Marriage_Rate_and Divorce_Rate"]);
    console.log(sumstat);
    // Draw the line
    svg.selectAll(".line")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 1.5)
      .attr("d", d => d3.line()
        .x(d => x(d.Year))
        .y(d => y(+d.Count))
        (d[1])
      );
  }
})
