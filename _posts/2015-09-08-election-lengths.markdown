---
layout: post
title:  "Length of Canadian Election Campaigns"
date:   2015-09-08 12:00:00
---

There has been much discussion about how long this election campaign is. How does it compare to past campaign lengths?

<style>

.chart {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  
  stroke: #000;
  shape-rendering: crispEdges;
}

.x.axis path {
  display: none;
}

.selected:after {
  content: "\0025BC";
}

.hidden {
	display: none;
}

#tooltip {
	border: 1px solid black;
	background-color: white;
    position: absolute;
    width: 300px;
    height: auto;
    padding: 5px;
    pointer-events: none;
}

#tooltip strong {
	font-weight: bold;
}

#tipTop {
	font-size: 16px;
	margin-bottom: 10px !important;
}

.tipInfo {
	font-size: 12px;
	margin: 0;
}

#options {
	font-size: 12px;
	font-weight: normal;
	padding: 10px;
}

#options p {
	border-bottom: 1px solid black;
	font-size: 16px;
	margin-bottom: 5px;
	width: 500px;
}

#options .sorting {
	float: left;
	width: 250px;
}

#options .sorting label {
	display: block;
	margin-bottom: 5px;
	width: 100%;
}



</style>

<div id="tooltip" class="hidden">
	<p id="tipTop"><strong><span id="tipNum"></span> General Election</strong></p>
	<p class="tipInfo">Dissolution of previous parliament: <span id="tipDissolution"></span></p>
	<p class="tipInfo">Writs issued: <span id="tipWrits"></span></p>
	<p class="tipInfo">Election Day(s): <span id="tipElection"></span><span id="tipElection2" class="hidden"></span></p>
	<p class="tipInfo">Number of Days from Dissolution to Election: <span id="tipDissolutionDays"></span></p>
	<p class="tipInfo">Number of Days from Writ to Election: <span id="tipWritDays"></span></p>
</div>
<div id="options">
	<p><strong>Options</strong></p>
	<div class="sorting">
		<label><input class="sortOpt" data-key="Election" type="radio" name ="sorting" checked>Sort by election</label>
		<label><input class="sortOpt" data-key="Length" type="radio" name="sorting">Sort by campaign length</label>
	</div>
	<label class="showDays"><input class="showDissolution" name="dissolution" type="checkbox">Show days after dissolution of parliament</label>
</div>
<div class="chart"></div>

<script src="http://d3js.org/d3.v3.min.js"></script>
<!--<script src="{{ site.baseurl }}/d3.min.js"></script>-->
<script>
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
var format = d3.time.format("%Y-%m-%d");

var coordinates = [0, 0];

var body = d3.select("body")
	.on("mousemove", function() {
		coordinates = d3.mouse(this);
	})
	.on("mousedown", function() {
		coordinates = d3.mouse(this);
	});

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#bd0026", "#f03b20", "#fd8d3c", "#fecc5c", "#ffffb2", "#d0743c", "#ff8c00"]);

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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.attr("class", "bars");
	
	
	
var sortOption = "Election";

var showDissolution = 0;
var first = 0;

generateChart();

d3.selectAll(".showDissolution")
.on("click", dissolution);

function dissolution() {
	showDissolution = (showDissolution == 0) ? 1 : 0;
	d3.select("g.bars").selectAll( "g" ).remove(); 
	generateChart();
}

function generateChart() {
d3.csv("{{ site.baseurl }}/data/election_lengths.csv", function(error, data) {
  if (error) throw error;
  
	data.Election = +data.Election;
	data["Days after dissolution"] = +data["Days after dissolution"];
	data["Election Campaign"] = +data["Election Campaign"];
	data["Voting and Campaigning"] = +data["Voting and Campaigning"];
	
	
	data["Election Day(s)"] = data["Election Day(s)"];
	
	data.forEach(function(d, i) {
		if (d.Election > 1) {
			d["Dissolution of Previous Parliament"] = format.parse(d["Dissolution of Previous Parliament"]);
		}
		d["Writs Issued"] = format.parse(d["Writs Issued"]);
		d["Election Day(s)"] = format.parse(d["Election Day(s)"]);
		if(d.Election < 3) {
			d["finalElectionDay"] = format.parse(d["finalElectionDay"]);
		}
	})

  if (!showDissolution) {
  var color = d3.scale.ordinal()
      .range(["#f03b20", "#fd8d3c", "#fecc5c", "#ffffb2", "#d0743c", "#ff8c00"]);
	  color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "Election" && key !== "General Election" && key !== "Days after dissolution" && key !== "Dissolution of Previous Parliament" && key !== "Writs Issued" && key !== "Election Day(s)" && key !== "finalElectionDay" && key !== "writDays" && key !== "dissolutionDays"); }));
  } else {
  var color = d3.scale.ordinal()
      .range(["#bd0026", "#f03b20", "#fd8d3c", "#fecc5c", "#ffffb2", "#d0743c", "#ff8c00"]);
  	color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "Election" && key !== "General Election" && key !== "Dissolution of Previous Parliament" && key !== "Writs Issued" && key !== "Election Day(s)" && key !== "finalElectionDay" && key !== "writDays" && key !== "dissolutionDays"); }));
  }

	// Assign new data types
  data.forEach(function(d) {
    var y0 = 0;
    d.lengths = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.lengths[d.lengths.length - 1].y1;
  });

  if (sortOption === "Election") {
	  data.sort(function(a, b) { return a.Election - b.Election; });
  } else {
  	  data.sort(function(a, b) { return a.total - b.total; });
  }

  x.domain(data.map(function(d) { return d.Election; }));
  //y.domain([0, d3.max(data, function(d) { return d.total; })]);
  y.domain([0, 130]);

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
      .text("Days");

  // Create election length data, align it horizontally
  var election = svg.selectAll(".election")
      .data(data)
    .enter().append("g")
      .attr("class", "electionBar")
      .attr("transform", function(d) { return "translate(" + x(d.Election) + ",0)"; })
    	.on("mouseover", function(d, i) {
    		showTooltip(d, i);
    	})
    	.on("mousedown", function(d, i) {
    		showTooltip(d, i);
    	})
    	.on("mouseout", function(d) {
    		d3.select("#tooltip").classed("hidden", true);
    	});

  // Position election length data
  election.selectAll("rect")
      .data(function(d) {  return d.lengths; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
	  .attr("y", height)
	  .attr("height", 0)
      .style("fill", function(d) { return color(d.name); })
	.attr("class", "databar");

  function showTooltip(d, i) {
	  var xPos = coordinates[0] + 15;
	  if (x(d.Election) > 300) {
		  xPos = coordinates[0] - 325;
	  }
	  var yPos = coordinates[1];
	  
	d3.select("#tooltip")
	  .style("left", xPos + "px")
	  .style("top", yPos + "px")
	  .select("#tipNum")
	  .text(d["General Election"]);
	  
	  if (d.Election != 1) {
		d3.select("#tooltip")
		  .select("#tipDissolution")
		  .text(d["Dissolution of Previous Parliament"].toDateString());
	  } else {
		d3.select("#tooltip")
		  .select("#tipDissolution")
		  .text(d["Dissolution of Previous Parliament"]);
	  }
	  
	d3.select("#tooltip")
	  .select("#tipWrits")
	  .text(d["Writs Issued"].toDateString());
	  
	d3.select("#tooltip")
	  .select("#tipElection")
	  .text(d["Election Day(s)"].toDateString());
	  
  if(d.Election < 3) {
	d3.select("#tooltip")
	  .select("#tipElection2")
	  .text("-" + d["finalElectionDay"].toDateString());
	d3.select("#tipElection2").classed("hidden", false);
  } else {
  	d3.select("#tipElection2").classed("hidden", true);
  }
  
    d3.select("#tooltip")
	  .select("#tipDissolutionDays")
	  .text(d["dissolutionDays"]);
	  
	d3.select("#tooltip")
	  .select("#tipWritDays")
	  .text(d["writDays"]);
	  
  	d3.select("#tooltip").classed("hidden", false);
  }
  
  // Create bar labels
  election.append("text")
	  .attr("x", 1.5)
	  .attr("y", height)
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

  // The arrow that controls sorting
  var columnLabel = d3.selectAll(".sortOpt")
      .datum(function() { return this.getAttribute("data-key"); })
      .on("click", clicked);
	  
  function clicked(key) {
	  if (key === "Election" && sortOption !== "Election") {
		  sortOption = "Election";
		  data.sort(function(a, b) { return a.Election - b.Election; });
	  } else if (sortOption !== "Length"){
		  sortOption = "Length";
		  data.sort(function(a, b) { return a.total - b.total; });
	  }

	  x.domain(data.map(function(d) { return d.Election; }));

	  election.transition()
		  .delay(function(d) {return d.Election * 8})
		  .attr("transform", function(d) { return "translate(" + x(d.Election) + ",0)"; });

	  svg.selectAll("g.x.axis")
		  .transition()
		  .delay(function(d) {return 5;})
          .call(xAxis);

  }
  

});
}

</script>


Source: [Parliament of Canada](http://www.parl.gc.ca/about/parliament/PARLINFO/infography/LengthFederalElection-e.htm)

Retrieved August 27, at 4:00pm PST
