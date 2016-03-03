vanpyr("vanpyr_t", "1");
vanpyr("vanpyr_s", "2");
vanpyr("vanpyr_m", "3");

function vanpyr(file, target) {

var margin = {top: 20, right: 0, bottom: 230, left: 100},
    width = 740 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .rangeRound([width, 0]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

var color = d3.scale.ordinal()
    .range(["#ebebeb", "#d6d6d6", "#c0c0c0", "#a9a9a9", "#A0A0A0", "#919191", "#797979", "#5e5e5e", "#424242", "#212121"]);
    
var selected;

var numFormat = d3.format(",");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6)
    .tickFormat(Math.abs);
    
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#vanpyrChart" + target).append("svg")
	.attr("class", "vanpyrChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/2016/03/" + file + ".csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Age group"; }));

  data.forEach(function(d) {
    var x0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].x1;
  });

  y.domain(data.map(function(d) { return d["Age group"]; }));
  //x.domain([d3.min(data, function(d) { return d.total; }), d3.max(data, function(d) { return d.total; })]);
  x.domain([-250000, 250000]);

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

  var rects = ages.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
    	.attr("class", "bars")
      .attr("x", x(0))
      .attr("width", 0)
      .attr("height", y.rangeBand())
      .style("fill", function(d) { return color(d.name); })
      .on("mouseover", function(d) { showTooltip(d, this) })
      .on("click", function(d) { showTooltip(d, this) });
      
	function showTooltip(d, obj) {
		if (selected) {
			d3.select(selected).classed("selected", false);
		}
		selected = obj;
		d3.select(obj).classed("selected", true);
		
		pyrLabel.text(d.name + ((d.x0 > 0) ? " male" : " female"));
		pyrVal.text(numFormat(Math.abs(d.x0 - d.x1)) + " respondents");
		tooltip.classed("hidden", false);
	}
      
	rects.transition()
			.duration(1000)
			.attr("x", function(d) { return (d.x1 > d.x0) ? x(d.x1) : x(d.x0); })
      .attr("width", function(d) { return Math.abs(x(d.x0) - x(d.x1)); });
      
  svg.append("line")
  	.attr("class", "vertical")
  	.attr("x1", x(0))
  	.attr("y1", 0)
  	.attr("x2", x(0))
  	.attr("y2", height);

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + ((i * 20) + height + 25) + ")"; });

  legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
      
  var tooltip = svg.append("g")
  	.attr("id", "vanpyrTooltip" + target)
  	.attr("class", "hidden")
  	.attr("transform", "translate(250," + (height + 60) + ")");

	var pyrLabel = tooltip.append("text")
			.attr("class", "tipTitle")
			.text("blorp");
			
	var pyrVal = tooltip.append("text")
			.attr("class", "tipInfo")
			.attr("y", 25)
			.text("blorp");

	svg.append("text")
			.attr("x", 15)
			.attr("y", 10)
			.attr("text-decoration", "underline")
			.text("Male");
			
	svg.append("text")
			.attr("x", width - 15)
			.attr("y", 10)
			.attr("text-anchor", "end")
			.attr("text-decoration", "underline")
			.text("Female");

});

}