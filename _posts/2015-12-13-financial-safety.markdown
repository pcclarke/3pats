---
layout: post
title:  "Financial Safety Nets Redesign"
date:   2015-12-13 12:00:00
---

<div id="safetyChart"></div>

<style>

svg {
  font: 10px sans-serif;
}

.background path {
  fill: none;
  stroke: none;
  stroke-width: 20px;
  pointer-events: stroke;
}

.foreground path {
  fill: none;
  stroke-width: 2px;
  stroke-linejoin: round;
  stroke-opacity: 0.6;
}

.axis .title {
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
}

.axis line,
.axis path {
  fill: none;
  stroke: #bdbdbd;
  stroke-width: 0.5px;
  shape-rendering: crispEdges;
}

.label {
  -webkit-transition: fill 125ms linear;
}

.active .label:not(.inactive) {
  font-weight: bold;
}

.label.inactive {
  fill: #ccc;
}

.foreground path.inactive {
  stroke: #ccc;
  stroke-opacity: .5;
  stroke-width: 1px;
}

</style>

<script src="{{ site.baseurl }}/js/colorbrewer.js"></script>

<script>

// Based on http://bl.ocks.org/mbostock/3709000

var margin = {top: 180, right: 80, bottom: 20, left: 120},
    width = 740 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var dimensions = [
  {
    name: "Name",
    scale: d3.scale.ordinal().rangePoints([0, height]),
    type: String
  },
  {
    name: "RRSPs, RRIFs, LIRAs and other",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "EPPs",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Deposits in financial institutions",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Mutual & investment funds, income trusts",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Stocks",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Bonds",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "TFSA",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Other financial assets",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Principal residence",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Other real estate",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Vehicles",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  },
  {
    name: "Equity in business",
    scale: d3.scale.linear().range([height, 0]),
    type: Number
  }
];

var colourReds = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#e31a1c", "#e31a1c", "#e31a1c"]);
var colourBlues = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#1f78b4", "#1f78b4", "#1f78b4"]);
var colourPurples = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#33a02c", "#33a02c", "#33a02c"]);
var colourOranges = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#ff7f00", "#ff7f00", "#ff7f00"]);

var x = d3.scale.ordinal()
    .domain(dimensions.map(function(d) { return d.name; }))
    .rangePoints([0, width]);

var line = d3.svg.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.svg.axis()
    .orient("left");

var svg = d3.select("#safetyChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dimension = svg.selectAll(".dimension")
    .data(dimensions)
  .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

d3.csv("{{ site.baseurl }}/data/2015/12/finsafety.csv", function(error, data) {
  if (error) throw error;

  dimensions.forEach(function(dimension) {
    dimension.scale.domain(dimension.type === Number
        ? d3.extent(data, function(d) { return +d[dimension.name]; })
        : data.map(function(d) { return d[dimension.name]; }).reverse());
  });

  var background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", drawInit);

  background.transition()
      .duration(2000)
      .attr("d", draw);

  var foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", drawInit)
      .attr("stroke", function(d) {
        if (d.Name.substr(0,6) === "Lowest") {
          return colourReds(d.Name.substr(-4));
        } else if (d.Name.substr(0,6) === "Second") {
          return colourBlues(d.Name.substr(-4));
        } else if (d.Name.substr(0,6) === "Middle") {
          return colourOranges(d.Name.substr(-4));
        } else {
          return colourPurples(d.Name.substr(-4));
        }
      })
      .classed("inactive", function(d) { return d.Name.substr(-4) !== "2012"; })
      ;

  foreground.transition()
      .delay(function(d, i) {
        return i * 200;
      })
      .duration(1000)
      .attr("d", draw);

  dimension.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
    .append("text")
      .attr("class", "title")
      .attr("text-anchor", "start")
      .attr("y", -3)
      .attr("x", 3)
      .attr("transform", "rotate(-45)")
      .text(function(d) { 
        if (d.name === "Name") {
          return "";
        } else {
          return d.name; 
        }});

  // Rebind the axis data to simplify mouseover.
  svg.select(".axis").selectAll("text:not(.title)")
      .attr("class", "label")
      .data(data, function(d) { return d.Name || d; });

  var projection = svg.selectAll(".axis text,.background path,.foreground path")
      .on("click", function(d) {
        if (d3.select(this).classed("inactive")) {
         // svg.classed("active", false);
          projection.filter(function(p) { return p === d; })
            .classed("inactive", false);
        } else {
         // svg.classed("active", true);
          projection.filter(function(p) { return p === d; })
            .classed("inactive", true);
        }
        //d3.select(this).classed("inactive", !d3.select(this).classed("inactive"));
      });
      //.on("mouseover", mouseover)
      //.on("mouseout", mouseout);

  function mouseover(d) {
    console.log(d);
    svg.classed("active", true);
    projection.classed("inactive", function(p) { return p !== d; });
    projection.classed("selected", function(p) { return p === d; });
    projection.filter(function(p) { return p === d; }).each(moveToFront);
  }

  function mouseout(d) {
    svg.classed("active", false);
    projection.classed("inactive", false);
  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }
});

function drawInit(d) {
  return line(dimensions.map(function(dimension) {
    return [0, dimensions[0].scale(d["Name"])];
  }));
}

function draw(d) {
  return line(dimensions.map(function(dimension) {
    return [x(dimension.name), dimension.scale(d[dimension.name])];
  }));
}

</script>