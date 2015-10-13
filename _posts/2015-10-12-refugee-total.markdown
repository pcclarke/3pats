---
layout: post
title:  "Total Refugees in Canada by Origin"
date:   2015-10-12 12:00:00
---

...but while we may be receiving more refugees from the Africa and the Middle East, the total number of refugees has declined over the past decade. Africa and the Middle East has increased in share mainly because the number of refugees from there has remained constant.

<div>
	<form id="refTotalForm">
	  <label><input type="radio" name="mode" value="multiples" checked> Separated</label>
	  <label><input type="radio" name="mode" value="stacked"> Stacked</label>
	</form>
</div>
<div id="refTotalChart"></div>
<div id="refTotalTip" class="hidden">
  <p id="tipTop"><strong><span id="tipRegion"></span></strong></p>
	<p class="tipInfo">Refugees: <span id="tipVal"></span></p>
</div>

<style>

	#refTotalChart {
	  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	  margin: auto;
	  position: relative;
	  width: 960px;
	}

	#refTotalChart text {
	  font-size: 10px;
	}

	#refTotalChart .axis path {
	  display: none;
	}

	#refTotalChart .axis line {
	  fill: none;
	  stroke: #000;
	  shape-rendering: crispEdges;
	}

	#refTotalChart .source-label {
	  font-weight: bold;
	  text-anchor: end;
	}

	#refTotalTip {
	  border: 1px solid black;
	  background-color: white;
	  position: absolute;
	  width: 225px;
	  height: auto;
	  padding: 5px;
	  pointer-events: none;
	}

	#refTotalTip strong {
	  font-weight: bold;
	}

	#refTotalTip #tipTop {
	  font-size: 16px;
	  margin-bottom: 10px !important;
	}

	#refTotalTip .tipInfo {
	  font-size: 12px;
	  margin: 0;
	}

	.hidden {
		display: none;
	}

</style>

<script>

refugeeTotal();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });
	
function refugeeTotal() {

var parseDate = d3.time.format("%Y").parse,
    formatYear = d3.format("02d"),
    formatDate = function(d) { return d.getFullYear(); };

var margin = {top: 0, right: 0, bottom: 20, left: 160},
    width = 740 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .2);

var y1 = d3.scale.linear();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(formatDate);

var nest = d3.nest()
    .key(function(d) { return d.source; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; })
    .out(function(d, y0) { d.valueOffset = y0; });

var color = d3.scale.category10();

var regions = d3.scale.ordinal()
	.domain([1, 2, 3, 4, 5, 6])
.range(["Africa and the Middle East", "Asia and Pacific", "Europe and the United Kingdom", "United States", "South and Central America", "Source area not stated"]);

var refTotal = d3.select("#refTotalChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/refugee_source.csv", type, function(error, data) {

  var dataByGroup = nest.entries(data);

  stack(dataByGroup);
  x.domain(dataByGroup[0].values.map(function(d) { return d.date; }));
  y0.domain(dataByGroup.map(function(d) { return d.key; }));
  y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);

  var source = refTotal.selectAll(".source")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "source")
      .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

  source.append("text")
      .attr("class", "source-label")
      .attr("x", -6)
      .attr("y", function(d) { return y1(d.values[0].value / 2); })
      .attr("dy", ".35em")
      .text(function(d) { return regions(d.key); });

  source.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.source); })
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y1(d.value); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return y0.rangeBand() - y1(d.value); })
			.on("mouseover", function(d) {
				showTooltip(d);
				d3.select(this).style("fill", "#000000");
			})
			.on("mousedown", function(d) {
				showTooltip(d);
				d3.select(this).style("fill", "#000000");
			})
			.on("mouseout", function(d) {
				d3.select(this).style("fill", function(d) { return color(d.source); });
				d3.select("#refTotalTip").classed("hidden", true);
			});
			
	function showTooltip(d) {
    var xPos = coordinates[0] + 10;
    if (d.date.getFullYear() > 2010) {
      xPos = coordinates[0] - 250;
    }
    var yPos = coordinates[1];
		
		console.log(d);
		
	  d3.select("#refTotalTip")
	    .style("left", xPos + "px")
	    .style("top", yPos + "px")
	    .select("#tipRegion")
	    .text(regions(d.source) + " " + d.date.getFullYear());
			
		d3.select("#refTotalTip").select("#tipVal")
			.text(d.value);
			
		d3.select("#refTotalTip").classed("hidden", false);
	}

  source.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y0.rangeBand() + ")")
      .call(xAxis);

  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  function transitionMultiples() {
    var t = refTotal.transition().duration(750),
        g = t.selectAll(".source").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
    g.select(".source-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
  }

  function transitionStacked() {
    var t = refTotal.transition().duration(750),
        g = t.selectAll(".source").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
    g.select(".source-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
  }
});

function type(d) {
	d.date = parseDate(d.date);
	d.value = +d.value;
	
	return d;
}

}

</script>