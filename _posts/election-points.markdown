---
layout: post
title:  "Is this election is long enough?"
date:   2015-09-19 12:00:00
---

Click on this text to update the chart with new data values as many times as you like!

<div class="chart"></div>

<style type="text/css">	
	.axis path,
	.axis line {
		fill: none;
		stroke: black;
		shape-rendering: crispEdges;
	}
	
	.axis text {
		font-family: sans-serif;
		font-size: 11px;
	}
</style>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script type="text/javascript">
//Width and height
var w = 740;
var h = 400;
var padding = 30;

var format = d3.time.format("%Y-%m-%d");

//Create scale functions
var xScale = d3.scale.linear()
	.domain([1860, 2020])
	.range([padding, w - padding]);
var yScale = d3.scale.linear()
	.domain([0, 130])
	.range([h - padding, padding]);
//Define X axis
var xAxis = d3.svg.axis()
				  .scale(xScale)
				  .orient("bottom")
				  .ticks(5);
//Define Y axis
var yAxis = d3.svg.axis()
				  .scale(yScale)
				  .orient("left")
				  //.ticks(5);
//Create SVG element
var svg = d3.select(".chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

//Define clipping path
svg.append("clipPath")
	.attr("id", "chart-area")
	.append("rect")
	.attr("x", padding)
	.attr("y", padding)
	.attr("width", w - padding)
	.attr("height", h - padding * 2);


d3.csv("{{ site.baseurl }}/data/election_lengths.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return a.Election - b.Election; });

  //xScale.domain(data.map(function(d) { return d["Election Day(s)"].getFullYear(); }));

  //Create circles
	svg.append("g")
	   .attr("id", "circles")
	   .attr("clip-path", "url(#chart-area)")
	   .selectAll("circle")
	   .data(data)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
	   		return xScale(d["Election Day(s)"].getFullYear());
	   })
	   .attr("cy", function(d) {
	   	console.log(d["Election Campaign"] + d["Voting and Campaigning"] + d["Days after dissolution"]);
	   		return yScale(d["Election Campaign"] + d["Voting and Campaigning"] + d["Days after dissolution"]);
	   })
	   .attr("r", 3);

	//Create X axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);

	//Create Y axis
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
	});

function type(d) {
	d.Election = +d.Election;
	d["Days after dissolution"] = +d["Days after dissolution"];
	d["Election Campaign"] = +d["Election Campaign"];
	d["Voting and Campaigning"] = +d["Voting and Campaigning"];
	d["Election Day(s)"] = format.parse(d["Election Day(s)"]);

	return d;
}

</script>