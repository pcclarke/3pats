---
layout: post
title:  "UNHCR Refugees to Canada, Compared"
date:   2015-10-21 12:00:00
---

<div id="unhcrChart"></div>
<div id="unhcrTip">
  <p id="tipTop"><strong><span id="tipCountry"></span></strong></p>
	<p class="tipInfo"><span id="tipRefugees"></span></p>
</div>

A considerably more detailed source for information on refugees is the United Nations High Commissioner for Refugees (UNHCR) population statistics. Unlike Citizenship and Immigration Canada, they do have data on which countries refugees come from and go to. However, they're far broader in defining what constitutes a refugee, so the numbers are much higher. This data includes refugees and "refugee-like" situations, which are described as "[groups of persons who are outside their country or territory of origin and who face protection risks similar to those of refugees, but for whom refugee status has, for practical or other reasons, not been ascertained.](http://www.unhcr.org/45c06c662.html)"

The relevant bit, though, is that I've highlighted Syria in the above chart -- and you would still have a hard time finding it. The number of refugees in Canada from Syria has gone up by only around two hundred people since the civil war broke out. Compare that to Bosnia and Herzegovina in the 1990s or Afghanistan in the early 2000s.

Source: [UNHCR Population Statistics](http://popstats.unhcr.org/en/overview)


<style>

#unhcrChart text {
  font-size: 10px;
}
#unhcrChart .axis path,
#unhcrChart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#unhcrChart .axis--y path {
  display: none;
}

#unhcrChart .data {
  fill: none;
  stroke: rgba(100, 100, 100, 0.4);
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 1.5px;
}

#unhcrChart .budget--hover {
  stroke: #000 !important;
}

#unhcrChart .syria {
  stroke: #d6191f;
}

#unhcrChart .focus text {
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
}

#unhcrChart .voronoi path {
  fill: none;
  pointer-events: all;
}

#unhcrChart .voronoi--show path {
  stroke: red;
  stroke-opacity: .2;
}

#unhcrTip {
	display: block;
	margin-bottom: 15px;
  pointer-events: none;
	text-align: center;
}

#unhcrTip #tipTop {
	font-size: 24px;
  margin-bottom: 10px !important;
}

#unhcrTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
	display: none;
}

</style>

<script>

unhcrChart();

function unhcrChart() {
  var years,
      yearFormat = d3.time.format("%Y");
			
	var numFormat = d3.format(",.0");

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
      width = 740 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var voronoi = d3.geom.voronoi()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); })
      .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#unhcrChart").append("svg")
      .attr("class", "budgetPlotted")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("{{ site.baseurl }}/data/2015/10/21/unhcr_refugees.csv", type, function(error, data) {
    x.domain(d3.extent(years));
    y.domain([d3.min(data, function(c) { 
        return d3.min(c.values, function(d) { return d.value; }); 
      }),
			d3.max(data, function(c) {
	      return d3.max(c.values, function(d) { return d.value; }); 
	    })]).nice();

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis()
          .scale(x)
          .orient("bottom"));

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.svg.axis()
          .scale(y)
          .orient("left"));

    svg.append("g")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", function(d) { d.line = this; return line(d.values); })
				.attr("class", function(d) {
					if (d.name === "Syrian Arab Rep.") {
						console.log("syria");
						return "data syria";
					} else {
						return "data";
					}
				});

    var focus = svg.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focus");

    focus.append("circle")
        .attr("r", 3.5);

    focus.append("text")
        .attr("y", -10);

    var voronoiGroup = svg.append("g")
        .attr("class", "voronoi");

    voronoiGroup.selectAll("path")
      .data(voronoi(d3.nest()
        .key(function(d) { return x(d.date) + "," + y(d.value); })
        .rollup(function(v) { return v[0]; })
        .entries(d3.merge(data.map(function(d) { return d.values; })))
        .map(function(d) { return d.values; })))
      .enter().append("path")
        .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
        .datum(function(d) { return d.point; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseover(d) {
      d3.select("#unhcrTip").select("#tipCountry")
				.text(d.budget.name + " " + d.date.getFullYear());
				
      d3.select("#unhcrTip").select("#tipRefugees")
				.text(numFormat(Math.abs(d.value)) + " refugees");

      d3.select(d.budget.line).classed("budget--hover", true);
      d.budget.line.parentNode.appendChild(d.budget.line);
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    }

    function mouseout(d) {
      d3.select(d.budget.line).classed("budget--hover", false);
      focus.attr("transform", "translate(-100,-100)");
    }
  });

  function type(d, i) {
    if (!i) years = Object.keys(d).map(yearFormat.parse).filter(Number);
    var budget = {
      name: d.Origin,
      values: null
    };
    budget.values = years.map(function(m) {
      return {
        budget: budget,
        date: m,
        value: (+d[yearFormat(m)])
      };
    });
    return budget;
  }
}

</script>