---
layout: post
title:  "Spiders Should be Squished"
date:   2015-12-13 12:00:00
---

<div id="safetyTip" class="hidden">
  <p id="tipTop"><span id="tipTitle"></span></p>
  <p class="tipInfo hidden" id="tipWarning">Data unavailable or too unreliable to be published</span></p>
  <p class="tipInfo"><span id="tipText1"></span></p>
</div>
<p class="safetyTitle"><strong>Ownership of financial assets by household income quintile</strong></p>
<div id="safetyChart"></div>
<label><input id="setBase" data-key="axes" type="checkbox" name="axes">Set all axes to 0-100%</label>

* * *

Maclean's recently put out a [set of 50 charts](http://www.macleans.ca/economy/economicanalysis/the-most-important-charts-for-the-canadian-economy-in-2016/), which were culled from a variety of experts and academics for what they think will be the most important chart for 2016. While the charts are pretty interesting for their data, their design is about what you might expect from non-designers. 

There is one particularly egregious [spider chart](http://www.macleans.ca/wp-content/uploads/2015/11/RObson.jpeg) (described fully in the previous link) that stands as a good reminder of why spider (or radar) charts are a bad idea: it's really hard to compare the values on different axes. Although the spider chart does show that households in the top income quintile own more of each asset, I think it would be nice to be able to compare them. Hence, the above redesign into a parallel coordinates chart. I didn't have access to the data used in the spider chart, so I worked off the original report cited, the [2012 Survey of Financial Security](http://www.statcan.gc.ca/daily-quotidien/150127/dq150127d-eng.htm). And since I was throwing in the kitchen sink already, I also included data for the previous years plus the oddly missing third quintile.

Source: [Statistics Canada CANSIM Table 205-0003](http://www5.statcan.gc.ca/cansim/a26?lang=eng&retrLang=eng&id=2050003&&pattern=&stByVal=1&p1=1&p2=-1&tabMode=dataTable&csid=)

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
  cursor: pointer;
  -webkit-transition: stroke 125ms linear;
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
  stroke-width: 1px;
  shape-rendering: crispEdges;
}

.label {
  -webkit-transition: fill 125ms linear;
  cursor: pointer;
}

.label:hover {
  font-weight: bold;
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

.dataPoint.inactive {
  fill: #ccc;
}

.safetyTitle {
  text-align: center;
}

/* Tooltip */
.hidden {
  display: none;
}

#safetyTip {
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  box-shadow: 2px 2px 2px 3px rgba(0, 0, 0, 0.05);
  position: absolute;
  width: 225px;
  height: auto;
  padding: 10px;
  pointer-events: none;
}

#safetyTip strong {
  font-weight: bold;
}

#safetyTip #tipTop {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px !important;
}

#safetyTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

.hidden {
  display: none;
}

</style>

<script src="{{ site.baseurl }}/js/colorbrewer.js"></script>

<script>

// Based on http://bl.ocks.org/mbostock/3709000

var margin = {top: 100, right: 70, bottom: 20, left: 110},
    width = 740 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var format = d3.format("%");

var base = 1;

var coordinates = [0, 0];
var body = d3.select("body")
    .on("mousemove", function() {
      coordinates = d3.mouse(this);
    })
    .on("mousedown", function() {
      coordinates = d3.mouse(this);
    });

var dimensions = [
  {
    name: "Name",
    scale: d3.scale.ordinal().rangePoints([0, height]),
    type: String,
    desc: ""
  },
  /* Private pension assets */
  {
    name: "Retirement savings",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Includes Registered Retirement Savings Plans (RRSPs), Registered Retirement Income Funds (RRIFs), Locked-in Retirement Accounts (LIRAs), Deferred Profit Sharing Plans (DPSPs), annuities and other miscellaneous pension assets"
  },
  {
    name: "EPPs",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Employer-sponsored Registered Pension Plans"
  },
  /* Financial assets, non pension */
  {
    name: "Cash deposits",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Deposits in financial institutions. In 2012, this category includes Treasury Bills"
  },
  {
    name: "Investment funds",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Mutual funds, investment funds and income trusts"
  },
  {
    name: "Stocks",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: ""
  },
  {
    name: "Bonds",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Includes saving and other"
  },
  {
    name: "TFSA",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Tax Free Saving Accounts"
  },
  {
    name: "Other financial assets",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: "Includes Registered Education Savings Plans (RESPs), treasury bills (1999 and 2005 only) mortgage-backed securities, money held in trust, money owed to the respondent and other miscellaneous financial assets, including shares of privately held companies"
  },
  /* Non-financial assets */
  {
    name: "Principal residence",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: ""
  },
  {
    name: "Other real estate",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: ""
  },
  {
    name: "Vehicles",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: ""
  },
  {
    name: "Equity in business",
    scale: d3.scale.linear().range([height, 0]),
    type: Number,
    desc: ""
  }
];

var colourReds = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#e31a1c", "#630B0C", "#C91719"]);
var colourBlues = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#1f78b4", "#092334", "#1B679A"]);
var colourPurples = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#33a02c", "#1F601A", "#37AD30"]);
var colourOranges = d3.scale.ordinal()
    .domain(["1999", "2005", "2012"])
    .range(["#ff7f00", "#7F3F00", "#BF5F00"]);

var x = d3.scale.ordinal()
    .domain(dimensions.map(function(d) { return d.name; }))
    .rangePoints([0, width]);

var line = d3.svg.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.svg.axis()
    .orient("left")
    .ticks(5);

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
        ? d3.extent(data, function(d) { return +d[dimension.name]; }) /*[0, 1]*/ 
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
      });

  foreground.transition()
      .delay(function(d, i) {
        return i * 200;
      })
      .duration(1000)
      .attr("d", draw);

  var circles = [];
  var circle;
  dimensions.filter(function(d) { return d.name !== "Name"; }).forEach(function(dimension) {
    circle = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dataPoint")
      .attr("cx", 0)
      .attr("cy", function(d) { return dimension.scale(d[dimension.name]); })
      .attr("r", 2)
      .attr("fill", function(d) {
        if (d[dimension.name] == 0) {
          return "white";
        }

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
      .on("mouseover", function(d) {
        var xPos = coordinates[0] + 15;
        if (x(dimension.name) > width / 2) {
          xPos = coordinates[0] - 250;
        }
        var yPos = coordinates[1];
        d3.select("#safetyTip")
          .style("left", xPos + "px")
          .style("top", yPos + "px");

        d3.select("#safetyTip")
          .select("#tipTitle").text(d.Name + " " + dimension.name);
        d3.select("#safetyTip")
          .select("#tipText1").text(format(d[dimension.name]));
        if (d[dimension.name] == 0) {
          d3.select("#safetyTip")
            .select("#tipWarning").classed("hidden", false);
          d3.select("#safetyTip")
            .select("#tipText1").classed("hidden", true);
        }

        d3.select("#safetyTip").classed("hidden", false);
      })
      .on("mouseout", function(d) {
        d3.select("#safetyTip").classed("hidden", true);
        d3.select("#safetyTip")
            .select("#tipWarning").classed("hidden", true);
        d3.select("#safetyTip")
          .select("#tipText1").classed("hidden", false);
      });

    circles.push(circle);
  });

  function colourCheck(d) {
    if (d.Name.substr(0,6) === "Lowest") {
      return colourReds(d.Name.substr(-4));
    } else if (d.Name.substr(0,6) === "Second") {
      return colourBlues(d.Name.substr(-4));
    } else if (d.Name.substr(0,6) === "Middle") {
      return colourOranges(d.Name.substr(-4));
    } else {
      return colourPurples(d.Name.substr(-4));
    }
  }

  dimensions.filter(function(d) { return d.name !== "Name"; }).forEach(function(dimension, i) {
    circles[i].transition()
      .delay(function(d, l) {
        return l * 200;
      })
      .duration(1000)
      .attr("cx", x(dimension.name));
  });

  dimension.append("g")
      .attr("class", "axis")
      .each(function(d, i) { 
        if (d.name === "Name") { 
          d3.select(this).call(yAxis.scale(d.scale));
        /*} else if (i >= 2) {
          d3.select(this).call(yAxis.scale(d.scale).tickFormat(""));*/
        } else {
          d3.select(this).call(yAxis.scale(d.scale).tickFormat(format));
        }
      })
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
        }})
      .on("mouseover", function(d) {
        var xPos = coordinates[0] + 15;
        if (x(d.name) > width / 2) {
          xPos = coordinates[0] - 250;
        }
        var yPos = coordinates[1];
        d3.select("#safetyTip")
          .style("left", xPos + "px")
          .style("top", yPos + "px");

        d3.select("#safetyTip")
          .select("#tipTitle").text(d.name);
        d3.select("#safetyTip")
          .select("#tipText1").text(d.desc);

        d3.select("#safetyTip").classed("hidden", false);
      })
      .on("mouseout", function(d) {
        d3.select("#safetyTip").classed("hidden", true);
      });

  // Rebind the axis data to simplify mouseover.
  svg.select(".axis").selectAll("text:not(.title)")
      .attr("class", "label")
      .data(data, function(d) { return d.Name || d; });

  var projection = svg.selectAll(".axis .label,.background path,.foreground path, .dataPoint")
      .on("click", click);

  projection.classed("inactive", true);
  svg.classed("active", true);
  projection.filter(function(d) { return d.Name.substr(-4) === "2012"; })
    .classed("inactive", false);

  var selected = ["Lowest quintile 2012", "Second quintile 2012", "Middle quintile 2012", "Fourth quintile 2012"];

  function click(d) {
    if (d3.select(this).classed("inactive")) {
        projection.filter(function(p) { return p === d; })
          .classed("inactive", false);
        projection.filter(function(p) { return p === d; }).each(moveToFront);
        selected.push(d.Name);
      } else {
        projection.filter(function(p) { return p === d; })
          .classed("inactive", true);
        selected.splice(selected.indexOf(d.Name), 1);
      }
  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }

  var checkbox = d3.selectAll("#setBase")
    .datum(function() { return this.getAttribute("data-key"); })
    .on("click", function(d) {
      if (base == 1) {
        dimensions.forEach(function(dimension) {
          dimension.scale.domain(dimension.type === Number
              ? [0, 1] 
              : data.map(function(d) { return d[dimension.name]; }).reverse());
        });

        base = 0;
      } else {
        dimensions.forEach(function(dimension) {
          dimension.scale.domain(dimension.type === Number
              ? d3.extent(data, function(d) { return +d[dimension.name]; }) 
              : data.map(function(d) { return d[dimension.name]; }).reverse());
        });

        base = 1;
      }

      dimension.selectAll("g").remove();
      yAxis = d3.svg.axis()
        .orient("left")
        .ticks(5);
      
      dimension.append("g")
      .attr("class", "axis")
      .each(function(d, i) { 
        if (d.name === "Name") { 
          d3.select(this).call(yAxis.scale(d.scale));
        /*} else if (i >= 2) {
          d3.select(this).call(yAxis.scale(d.scale).tickFormat(""));*/
        } else {
          d3.select(this).call(yAxis.scale(d.scale).tickFormat(format));
        }
      })
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
          }})
        .on("mouseover", function(d) {
          var xPos = coordinates[0] + 15;
          if (x(d.name) > width / 2) {
            xPos = coordinates[0] - 250;
          }
          var yPos = coordinates[1];
          d3.select("#safetyTip")
            .style("left", xPos + "px")
            .style("top", yPos + "px");

          d3.select("#safetyTip")
            .select("#tipTitle").text(d.name);
          d3.select("#safetyTip")
            .select("#tipText1").text(d.desc);

          d3.select("#safetyTip").classed("hidden", false);
        })
        .on("mouseout", function(d) {
          d3.select("#safetyTip").classed("hidden", true);
        });

        // Rebind the axis data to simplify mouseover.
        svg.select(".axis").selectAll("text:not(.title)")
            .attr("class", "label")
            .data(data, function(d) { return d.Name || d; });

      projection = svg.selectAll(".axis .label,.background path,.foreground path, .dataPoint")
        .on("click", click);
          projection.classed("inactive", true);
      svg.classed("active", true);
      projection.filter(function(d) { return selected.indexOf(d.Name) !== -1; })
        .classed("inactive", false);


      background.transition()
        .duration(2000)
        .attr("d", draw);

      foreground.transition()
        .delay(function(d, i) {
          return i * 200;
        })
        .duration(1000)
        .attr("d", draw);

      dimensions.filter(function(d) { return d.name !== "Name"; }).forEach(function(dimension, i) {
        circles[i].transition()
          .delay(function(d, l) {
            return l * 200;
          })
          .duration(1000)
          .attr("cy", function(d) { return dimension.scale(d[dimension.name]); });
      });
    });
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