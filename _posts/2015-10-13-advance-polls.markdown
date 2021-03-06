---
layout: post
title:  "Advance polling turnout 35–42nd elections"
date:   2015-10-13 12:00:00
---

This year has marked a record turnout in the advance polls, with over 3.6 million voters casting their ballot over the past weekend. Advance polling has grown steadily in popularity over the years, in spite of the otherwise languid voting turnout in Canada since the 1990s. At this rate I wonder if we will eventually have a voting week rather than election day.

*Update* 2015-10-18: Now includes data for 35th election and latest data for 42nd election.

* * *

<div id="advChart"></div>
<div id="advTip">
	<p id="tipTop"><strong><span id="tipNum"></span> General Election</strong></p>
	<p class="tipInfo">Year: <span id="tipYear"></span></p>
	<p class="tipInfo">Advance polling turnout: <span id="tipTurnout"></span> voters <span id="tipEst">(Estimated)</span></p>
</div>

* * * * *

Sources:

- [Elections Canada: Estimate of Turnout at Advance Polls Now Available](http://www.elections.ca/content.aspx?section=med&document=oct1415&dir=pre&lang=e)
- [Report on the Evaluations of the 41st General Election of May 2, 2011](http://www.elections.ca/content.aspx?section=res&dir=rec/eval/pes2011/ege&document=p1&lang=e)
- [Thirty-Eighth General Election 2004 Official Voting Results](http://www.elections.ca/scripts/OVR2004/default.html)
- [Report of the Chief Electoral Officer of Canada on the 37th General Election Held on November 27, 2000](http://www.elections.ca/content.aspx?section=res&dir=rep/off/sta&document=stat13&lang=e#a)
- [Thirty-sixth General Election 1997: Official Voting Results: Synopsis](http://www.elections.ca/content.aspx?section=res&dir=rep/off/dec3097&document=res_table05&lang=e)
- Thirty-fifth general election, 1993: official voting results


<style>

#advChart .bar {
  fill: #808080;
}

#advChart .barEst {
	fill: red;
}

#advChart .barSel {
	fill: #000000 !important;
}

#advChart .axis text {
  font-size: 10px;
}

#advChart .axis path,
#advChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#advChart .x.axis path {
  display: none;
}

#advTip {
	display: block;
	margin-bottom: 15px;
  pointer-events: none;
}

#advTip #tipTop {
  font-size: 18px;
  margin-bottom: 10px !important;
}

#advTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>

<script>

advChart();

function advChart() {

var margin = {top: 20, right: 30, bottom: 30, left: 70},
    width = 740 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var advChart = d3.select("#advChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
var turnoutFormat = d3.format(",");

var selection;

d3.csv("{{ site.baseurl }}/data/2015/10/13/adv_polls.csv", type, function(error, data) {
	data.sort(function(a, b) { return a.Year - b.Year; });
	
  x.domain(data.map(function(d) { return d.Election; }));
  y.domain([0, d3.max(data, function(d) { return d.Turnout; })]);

  advChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  advChart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Voters");

  var advPolls = advChart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) {
				if (d.Year < 2015) {
					return "bar";
				} else {
					d3.select(this).classed("barSel", true);
					return "barEst barSel";
				}
      })
      .attr("x", function(d) { return x(d.Election); })
      .attr("y", function(d) { return height; })
      .attr("height", function(d) { return 0; })
      .attr("width", x.rangeBand())
		.on("mouseover", function(d) {
			d3.selectAll("#advChart .barSel").classed("barSel", false);
			d3.select(this).classed("barSel", true);
			showTooltip(d);
		})
		.on("mousedown", function(d) {
			d3.selectAll("#advChart .barSel").classed("barSel", false);
			d3.select(this).classed("barSel", true);
			showTooltip(d);
		});
		
		advPolls.transition()
			.delay(function(d, i) { return i * 8; })
			.attr("y", function(d) { return y(d.Turnout); })
			.attr("height", function(d) {return height - y(d.Turnout); });
			
	  d3.select("#advTip").select("#tipNum")
	    .text(data[data.length - 1]["Election"]);
			
		d3.select("#advTip").select("#tipYear")
			.text(data[data.length - 1]["Year"]);
			
		d3.select("#advTip").select("#tipTurnout")
			.text(turnoutFormat(data[data.length - 1]["Turnout"]));
		
		function showTooltip(d) {
		  d3.select("#advTip").select("#tipNum")
		    .text(d.Election);
				
			d3.select("#advTip").select("#tipYear")
				.text(d.Year);
				
			d3.select("#advTip").select("#tipTurnout")
				.text(turnoutFormat(d.Turnout));

			d3.select("#tipEst").classed("hidden", (d.Year < 2015) ? true : false);
		}
});

function type(d) {
	d.Year = +d.Year;
  d.Turnout = +d.Turnout;
	
  return d;
}

}

</script>