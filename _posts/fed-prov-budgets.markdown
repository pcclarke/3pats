---
layout: post
title:  "Federal and Provincial Budgets"
date:   2015-09-16 12:00:00
---

<style>
.bar.positive {
  fill: black;
}

.bar.negative {
  fill: brown;
}

.axis text {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

</style>

<div class="chart"></div>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script>
// Borrowing from: http://bl.ocks.org/mbostock/9490516

var margin = {top: 30, right: 10, bottom: 10, left: 50},
    width = 740 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var y = d3.scale.linear()
    .range([height, 0]);

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/2015-09-16-budget_balances.csv", type, function(error, data) {
var symbols = d3.nest()
    .key(function(d, i) { console.log(d.symbol);return d.symbol; })
    .entries(data);
	
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain(d3.extent(data, function(d) { return d.Canada; })).nice();
  
  console.log(d3.keys(data[0]));

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return d.Canada < 0 ? "bar negative" : "bar positive"; })
      .attr("x", function(d) { return x(d.Year); })
      .attr("y", function(d) { return y(Math.max(0, d.Canada)); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return Math.abs(y(d.Canada) - y(0)); });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("g")
      .attr("class", "x axis")
    .append("line")
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("x2", width);
});

function type(d) {
    d.Canada = +d.Canada;
    d.Alberta = +d.Alberta;
    d["British Columbia"] = +d["British Columbia"];
    d.Manitoba = +d.Manitoba;
    d["New Brunswick"] = +d["New Brunswick"];
    d["Newfoundland and Labrador"] = +d["Newfoundland and Labrador"];
    d["Nova Scotia"] = +d["Nova Scotia"];
    d.Ontario = +d.Ontario;
    d["Prince Edward Island"] = +d["Prince Edward Island"];
    d.Quebec = +d.Quebec;
    d.Saskatchewan = +d.Saskatchewan;
    d.Year = +d.Year.substring(0, 4);
  return d;
}

</script>