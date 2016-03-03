var vanpyr = function() {

var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 740 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

var x = d3.scale.linear()
    .rangeRound([width, 0]);

var color = d3.scale.ordinal()
    .range(["#ebebeb", "#d6d6d6", "#c0c0c0", "#a9a9a9", "#A0A0A0", "#919191", "#797979", "#5e5e5e", "#424242", "#212121"]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6)
    .tickFormat(Math.abs);

var svg = d3.select("#vanpyrChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/2016/03/vanpyr_t.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Age group"; }));

  data.forEach(function(d) {
    var x0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].x1;
  });

  //data.sort(function(a, b) { return b.total - a.total; });

  y.domain(data.map(function(d) { return d["Age group"]; }));
  x.domain([d3.min(data, function(d) { return d.total; }), d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var ages = svg.selectAll(".ages")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(0," + y(d["Age group"]) + ")"; });

  ages.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("x", function(d) { console.log("val: " + (d.x0 - d.x1) + " pos: " + x(d.x1) + " width: " + Math.abs(x(d.x0) - x(d.x1))); 
      	return (d.x1 > d.x0) ? x(d.x1) : x(d.x0); })
      .attr("width", function(d) { return Math.abs(x(d.x0) - x(d.x1)); })
      .attr("height", y.rangeBand())
      .style("fill", function(d) { return color(d.name); });

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

}();