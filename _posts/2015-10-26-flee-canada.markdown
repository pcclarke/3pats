---
layout: post
title:  "Fleeing the Hellish Tyranny of Canada"
date:   2015-10-26 12:00:00
---

<div id="cdnRefChart"></div>
<div id="unhcrTip">
  <p id="tipTop"><strong><span id="tipCountry"></span> <span id="tipYear"></span></strong></p>
	<p class="tipInfo"><span id="tipRefugees"></span></p>
</div>


* * *

You may have noticed in [yesterday's post]({% post_url 2015-10-23-unhcr-refugee %}) there were many developed countries that refugees were coming from. Well guess what, there are refugees from Canada too. While Canada is hardly a major origin of refugees, they apparently do exist according to the UNHCR. As far as I can tell, these are people who somehow did fall under the definition of refugee or were in a refugee-like situation. But I have no idea how that was determined, or why so many of them are going to Germany.

Source: [UNHCR Population Statistics](http://popstats.unhcr.org/en/overview)

<style>
#cdnRefChart {
  font: 10px sans-serif;
}

#cdnRefChart .axis path,
#cdnRefChart .axis line {
  fill: none;
  
  stroke: #000;
  shape-rendering: crispEdges;
}

#cdnRefChart .x.axis path {
  display: none;
}

#cdnRefChart .sel {
	fill: #000000 !important;
}

.hidden {
	display: none;
}

#unhcrTip {
	display: block;
	min-height: 50px;
	margin-bottom: 15px;
	text-align: center;
}

#unhcrTip #tipTop {
  font-size: 24px;
  margin-bottom: 5px !important;

}

#unhcrTip .tipInfo {
	font-size: 12px;
	margin: 0;
}
</style>

<script src="{{ site.baseurl }}/js/colorbrewer.js"></script>
<script>
fleeCanada();

function fleeCanada() {

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
var yearFormat = d3.time.format("%Y").parse;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

		var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
		.tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#cdnRefChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.attr("class", "bars");

d3.csv("{{ site.baseurl }}/data/2015/10/26/flee_canada.csv", type, function(error, data) {
	if (error) throw error;
	
	console.log(data);
	
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.lengths = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.lengths[d.lengths.length - 1].y1;
  });

  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Refugees From Canada");

  // Create election length data, align it horizontally
	var election = svg.selectAll(".refugees")
			.data(data)
    	.enter().append("g")
			.attr("class", "refugeeBar")
			.attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
			;

  election.selectAll("rect")
      .data(function(d) {  return d.lengths; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
	  .attr("y", height)
	  .attr("height", 0)
      .style("fill", function(d) { return color(d.name); })
	.attr("class", "databar")
			.on("mouseover", function(d) {
				showTooltip(d, this);
			})
			.on("mousedown", function(d) {
				showTooltip(d, this);
			});

  function showTooltip(d, obj) {
		console.log(d);
			d3.selectAll("#cdnRefChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
		  d3.select("#unhcrTip").select("#tipCountry")
		    .text(d.name);
		  //d3.select("#unhcrTip").select("#tipYear")
		    //.text(d.Year.getFullYear());
		  d3.select("#unhcrTip").select("#tipRefugees")
		    .text((d.y1 - d.y0) + " refugees");
  }

  election.append("text")
	  .attr("x", x.rangeBand() / 2)
	  .attr("y", height)
		.attr("text-anchor", "middle")
	  .text(function(d) { return d.total; });
  
  election.transition()
	  .delay(function(d, i) {return i * 8})
	  .selectAll("rect")
	  .attr("y", function(d) {  return y(d.y1); })
	  .attr("height", function(d) { return y(d.y0) - y(d.y1); });
  
  election.transition()
	  .delay(function(d, i) {return i * 8})
	  .selectAll("text")
  	  .attr("y", function(d) { return y(d.total) - 5; });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});

function type(d) {
	Object.keys(d).filter(function(key) { return key !== "Year"; }).forEach(function(c) {
		d[c] = +d[c];
	});
	d.Year = yearFormat(d.Year);
	
	return d;
}

}
</script>