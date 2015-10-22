---
layout: post
title:  "UNHCR Refugees to Canada, Stacked"
date:   2015-10-22 12:00:00
---

<div id="unhcrShare"></div>
<div id="unhcrShareTip">
  <p id="tipTop"><strong><span id="tipOrigin"></span></strong></p>
</div>

* * *

When I first looked through yesterday's post, it seemed that there was a major drop off in many of the refugees from 2007. It's not quite as pronounced overall as it is for some countries such as Afghanistan, but there's a distinct trend downwards over the past decade.

Source: [UNHCR Population Statistics](http://popstats.unhcr.org/en/overview)

<style>

#unhcrShare {
  font-size: 10px;
}

#unhcrShare .axis path,
#unhcrShare .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#unhcrShare .refugee text {
  text-anchor: end;
}

#unhcrShare .sel {
	fill: #000000 !important;
}

#unhcrShare .line {
  fill: none;
  stroke: rgba(200, 200, 200, 0.2);
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 0.5px;
}

#unhcrShareTip {
	display: block;
	min-height: 50px;
	margin-bottom: 15px;
  pointer-events: none;
}

#unhcrShareTip #tipTop {
  font-size: 24px;
  margin-bottom: 10px !important;
	text-align: center;
}

#unhcrShareTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

</style>

<script>

newSpending();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function newSpending() {

var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 740 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
		.range(d3.range(194).map(d3.scale.linear()
      .domain([0, 193])
      .range(["#005a32", "#c7e9c0"])
      .interpolate(d3.interpolateLab)));

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

var share = d3.select("#unhcrShare").append("svg")
	.attr("class", "spendingChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/2015/10/22/unhcr_refugees_t.csv", type, function(error, data) {
  if (error) throw error;

	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  var refugees = stack(color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.Year, y: d[name]};
      })
    };
  }));

  x.domain(d3.extent(data, function(d) { return d.Year; }));
	y.domain([0, 200000]);

  var refugee = share.selectAll(".refugee")
      .data(refugees)
    .enter().append("g")
      .attr("class", "refugee");

  refugee.append("path")
    .attr("class", "area")
    .attr("d", function(d) { return area(d.values); })
    .style("fill", function(d) { return color(d.name); })
		.on("mouseover", function(d) {
			showTooltip(d, this);
		})
		.on("mousedown", function(d) {
			showTooltip(d, this);
		});
		
var refline = share.selectAll(".refline")
    .data(refugees)
  .enter().append("g")
    .attr("class", "refline");

refline.append("path")
  .attr("class", "line")
		.attr("d", function(d) { return line(d.values); });
		
	function showTooltip(d, obj) {
		d3.selectAll("#unhcrShare .sel").classed("sel", false);
		d3.select(obj).classed("sel", true);
	  d3.select("#unhcrShareTip").select("#tipOrigin")
	    .text(d.name);
	}
		
  share.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  share.append("g")
      .attr("class", "y axis")
      .call(yAxis);
});

function type(d) {
	d3.keys(d).filter(function(key) { return key !== "Year"; }).forEach(function(key) {
		d[key] = +d[key];
	});
	d.Year = parseDate(d.Year);

	return d;
	
}

}

</script>