---
layout: post
title:  "Length of Canadian Election Campaigns"
date:   2015-09-05 13:12:00
---

There has been much discussion about how long this election campaign is. How does it compare to past campaign lengths?

<style>

body {
  font: 10px sans-serif;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>
<!--<script src="{{ site.baseurl }}/d3.min.js"></script>-->
<script>

(function() {
	


var margin = {top: 80, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
		console.log("hello!");

d3.csv("{{ site.baseurl }}/data/data.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Election"; }));

	// Assign new data types
  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  //data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Election; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  // X axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");

  // Create state data, align it horizontally
  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "stateBar")
      .attr("transform", function(d) { return "translate(" + x(d.Election) + ",0)"; });

  // Position state data
  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
	  .attr("y", 0)
	  .attr("height", 0)
      .style("fill", function(d) { return color(d.name); })
	  .attr("class", "databar");
	  
  // Create bar labels
  state.append("text")
	  .attr("x", 2)
	  .attr("y", 0)
	  .text(function(d) { return d.total; });
	  
  state.transition()
	  .delay(function(d, i) {return i * 8})
	  .selectAll("rect")
	  .attr("y", function(d) {  return y(d.y1); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y1); });
	  
  state.transition()
	  .delay(function(d, i) {return i * 8})
	  .selectAll("text")
  	  .attr("y", function(d) { return y(d.total) - 5; });
	  
  // The arrow that controls sorting
  /*var columnLabel = d3.selectAll(".sortOpt")
      .datum(function() { return this.getAttribute("data-key"); })
      .on("click", clicked)*/

  // Create legend groups
  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // Draw legend boxes
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // Draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

})()

</script>

<div class="controls">
	<div class="sorting">
		<div class="sortOpt" data-key="Election">Sort by election</div>
		<div class="sortOpt" data-key="Length">Sort by campaign length</div>
	</div>
</div>
<div class="chart"></div>

Source: [Parliament of Canada](http://www.parl.gc.ca/about/parliament/PARLINFO/infography/LengthFederalElection-e.htm)

Retrieved August 27, at 4:00pm PST

[CBC](http://www.cbc.ca/news/politics/canada-election-2015-stephen-harper-confirms-start-of-11-week-federal-campaign-1.3175136)

