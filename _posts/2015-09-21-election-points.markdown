---
layout: post
title:  "What is the normal length of an election campaign?"
date:   2015-09-21 12:00:00
---

Here's another thought: what constitutes an normal length election, anyways? Taking into account the time between elections and the party that called them, it isn't clear what the trend is, if there is one at all.

<div id="pointsTooltip" class="hidden">
	<p id="tipTop"><strong><span id="tipNum"></span> General Election</strong></p>
	<p class="tipInfo">Called by: <span id="tipParty"></span>, <span id="tipLeader"></span></p>
	<p class="tipInfo">Dissolution of previous parliament: <span id="tipDissolution"></span></p>
	<p class="tipInfo">Writs issued: <span id="tipWrits"></span></p>
	<p class="tipInfo">Election Day(s): <span id="tipElection"></span><span id="tipElection2" class="hidden"></span></p>
	<p class="tipInfo">Number of Days from Dissolution to Election: <span id="tipDissolutionDays"></span></p>
	<p class="tipInfo">Number of Days from Writ to Election: <span id="tipWritDays"></span></p>
</div>
<div id="pointsChart"></div>

<style type="text/css">	
#pointsChart {
  font: 10px sans-serif;
}

.pointsAxis path,
.pointsAxis line {
  fill: none;
  
  stroke: #CCCCCC;
  stroke-width: 1px;
  shape-rendering: crispEdges;
}

.hidden {
	display: none;
}

#pointsTooltip {
	border: 1px solid black;
	background-color: white;
    position: absolute;
    width: 300px;
    height: auto;
    padding: 5px;
    pointer-events: none;
}

#pointsTooltip strong {
	font-weight: bold;
}

#pointsTooltip#tipTop {
	font-size: 16px;
	margin-bottom: 10px !important;
}

#pointsTooltip .tipInfo {
	font-size: 12px;
	margin: 0;
}

#options {
	font-size: 12px;
	font-weight: normal;
	padding: 10px;
}
</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script type="text/javascript">
showPoints();

	var coordinates = [0, 0];

	var body = d3.select("body")
		.on("mousemove", function() {
			coordinates = d3.mouse(this);
		})
		.on("mousedown", function() {
			coordinates = d3.mouse(this);
		});

function showPoints() {
	var margin = {top: 40, right: 20, bottom: 30, left: 40},
	    width = 740 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;
		
	var format = d3.time.format("%Y-%m-%d");
	var axisFormat = d3.format("4d");

	var x = d3.scale.linear()
	    .rangeRound([0, width], .1);

	var y = d3.scale.linear()
	    .rangeRound([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .tickFormat(axisFormat);

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format("3d"));

	var points = d3.select("#pointsChart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "bars");
		
	var sortOption = "Election";

	var first = 0;

	var pointsColours = d3.scale.ordinal()
	    .range(["#bd0026", "#f03b20", "#fd8d3c"])
	    .domain(["Days after dissolution", "Election Campaign", "Voting and Campaigning"]);

	var partyColours = d3.scale.ordinal()
		.domain(["Conservative", "Liberal", "Progressive Conservative", "Unionist", "None"])
		.range(["#0B499D", "#DA1920", "#2A7FFF", "#666699", "#AAAAAA"]);

	var electionStages = d3.scale.ordinal()
		.domain(["Days after dissolution", "Election Campaign", "Voting and Campaigning"])
		.range(["2, 2", "0", "5, 4"]);

	d3.csv("{{ site.baseurl }}/data/election_lengths_3.csv", function(error, data) {
		if (error) throw error;

		data.Election = +data.Election;
		data["Days after dissolution"] = +data["Days after dissolution"];
		data["Election Campaign"] = +data["Election Campaign"];
		data["Voting and Campaigning"] = +data["Voting and Campaigning"];
		data["Election Day(s)"] = data["Election Day(s)"];

		data.forEach(function(d, i) {
			d["startElectionDay"] = format.parse(d["Election Day(s)"]);
			if (d.Election > 1) {
				d["Dissolution of Previous Parliament"] = format.parse(d["Dissolution of Previous Parliament"]);
			}
			d["Writs Issued"] = format.parse(d["Writs Issued"]);
			d["Election Day(s)"] = format.parse(d["Election Day(s)"]);
			if(d.Election < 3) {
				d["finalElectionDay"] = format.parse(d["finalElectionDay"]);
			}
		})

		// Assign new data types
	  data.forEach(function(d) {
	    var y0 = 0;
	    d.lengths = pointsColours.domain().map(function(name) {return {name: name, party: d.party, y0: y0, y1: y0 += +d[name]}; });
	    d.total = d.lengths[d.lengths.length - 1].y1;
	  });

	  if (sortOption === "Election") {
		  data.sort(function(a, b) { return a.Election - b.Election; });
	  } else {
	  	  data.sort(function(a, b) { return a.total - b.total; });
	  }

	  x.domain([1865, 2015]);
	  //y.domain([0, d3.max(data, function(d) { return d.total; })]);
	  y.domain([0, 130]);

	  // X axis
	  points.append("g")
	      .attr("class", "pointsX pointsAxis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  // Y axis
	  points.append("g")
	      .attr("class", "pointsY pointsAxis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Days");

	  // Create election length data, align it horizontally
		var election = points.selectAll(".election")
				.data(data)
	  		.enter()
	  	.append("g")
				.attr("class", "electionLine")
				.attr("transform", function(d) { return "translate(" + x(d["startElectionDay"].getFullYear()) + ",0)"; })
				.on("mouseover", function(d, i) {
					showTooltip(d, i);
				})
				.on("mousedown", function(d, i) {
					showTooltip(d, i);
				})
				.on("mouseout", function(d) {
					d3.select("#pointsTooltip").classed("hidden", true);
				});

	  // Position election length data
	  election.selectAll("line")
	      .data(function(d) { return d.lengths; })
	    .enter().append("line")
				.attr("y1", function(d) {
					return y(0);
				})
				.attr("y2", function(d) {
					return y(0)
				})
				.style("stroke", function(d) { return partyColours(d.party); })
				.style("stroke-width", "2px")
				.style("stroke-dasharray", function(d) {
					return electionStages(d.name);
				})
				.style("stroke-linecap", function(d) {
					if (d.name === "Voting and Campaigning") {
						return "round";
					} else {
						return "butt";
					}
				})
				.attr("class", "databar");

	  function showTooltip(d, i) {
		  var xPos = coordinates[0] + 5;
		  if (x(d["startElectionDay"].getFullYear()) > 300) {
			  xPos = coordinates[0] - 315;
		  }
		  var yPos = coordinates[1];
		  
			d3.select("#pointsTooltip")
			  .style("left", xPos + "px")
			  .style("top", yPos + "px")
			  .select("#tipNum")
			  .text(d["General Election"]);

		  d3.select("#pointsTooltip").select("#tipParty")
		  		.text(d.party);

	  	d3.select("#pointsTooltip").select("#tipLeader")
	  		.text(d.leader);
		  
		  if (d.Election != 1) {
				d3.select("#pointsTooltip")
				  .select("#tipDissolution")
				  .text(d["Dissolution of Previous Parliament"].toDateString());
		  } else {
				d3.select("#pointsTooltip")
				  .select("#tipDissolution")
				  .text(d["Dissolution of Previous Parliament"]);
		  }
		  
			d3.select("#pointsTooltip")
			  .select("#tipWrits")
			  .text(d["Writs Issued"].toDateString());
			  
			d3.select("#pointsTooltip")
			  .select("#tipElection")
			  .text(d["Election Day(s)"].toDateString());
		  
	  	if(d.Election < 3) {
				d3.select("#pointsTooltip")
				  .select("#tipElection2")
				  .text("-" + d["finalElectionDay"].toDateString());
				d3.select("#tipElection2").classed("hidden", false);
		  } else {
		  	d3.select("#tipElection2").classed("hidden", true);
		  }
	  
	    d3.select("#pointsTooltip")
		  	.select("#tipDissolutionDays")
		  	.text(d["dissolutionDays"]);
		  
			d3.select("#pointsTooltip")
			  .select("#tipWritDays")
			  .text(d["writDays"]);
		  
	  	d3.select("#pointsTooltip").classed("hidden", false);
	  }

	  election.transition()
		  .delay(function(d, i) {return i * 8})
		  .selectAll("line")
		  .attr("y1", function(d) { return y(d.y1); })
		  .attr("y2", function(d) { return y(d.y0); });

		points.append("text")
			.attr("x", width - 100)
			.attr("dy", -5)
			.style("font-weight", "bold")
			.text("Party calling election");

	  // Create legend groups
	  var legend = points.selectAll(".legend")
	      .data(partyColours.domain().slice().reverse())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  // Draw legend boxes
	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", partyColours);

	  // Draw legend text
	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });

    points.append("text")
    	.attr("x", width - 230)
    	.attr("dy", -5)
    	.style("font-weight", "bold")
    	.text("Period");

  	var periodLegend = points.selectAll(".period")
  			.data(electionStages.domain().slice().reverse())
			.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		periodLegend.append("line")
			.attr("x1", width - 200)
			.attr("y1", 0)
			.attr("x2", width - 200)
			.attr("y2", 18)
			.style("stroke", "#000000")
			.style("stroke-dasharray", electionStages)
			.style("stroke-width", 2);

		periodLegend.append("text")
			.attr("x", width - 205)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) {return d;});
	});
}
</script>