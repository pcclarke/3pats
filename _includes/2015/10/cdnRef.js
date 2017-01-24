fleeCanada();

function fleeCanada() {

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
var yearFormat = d3.time.format("%Y").parse;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

		var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
		.tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#cdnRefChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.attr("class", "bars");

d3.csv("{{ site.baseurl }}/data/2015/10/26/flee_canada.csv", type, function(error, data) {
	if (error) throw error;
	
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.lengths = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.lengths[d.lengths.length - 1].y1;
  });

  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Refugees From Canada");

  // Create election length data, align it horizontally
	var election = svg.selectAll(".refugees")
			.data(data)
    	.enter().append("g")
			.attr("class", "refugeeBar")
			.attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
			;

  election.selectAll("rect")
      .data(function(d) {  return d.lengths; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
	  .attr("y", height)
	  .attr("height", 0)
      .style("fill", function(d) { return color(d.name); })
	.attr("class", "databar")
			.on("mouseover", function(d) {
				showTooltip(d, this);
			})
			.on("mousedown", function(d) {
				showTooltip(d, this);
			});

  function showTooltip(d, obj) {
			d3.selectAll("#cdnRefChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
		  d3.select("#cdnRefTip").select("#tipCountry")
		    .text(d.name);
		  d3.select("#cdnRefTip").select("#tipRefugees")
		    .text((d.y1 - d.y0) + " refugees");
  }

  election.append("text")
	  .attr("x", x.rangeBand() / 2)
	  .attr("y", height)
		.attr("text-anchor", "middle")
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

function type(d) {
	Object.keys(d).filter(function(key) { return key !== "Year"; }).forEach(function(c) {
		d[c] = +d[c];
	});
	d.Year = yearFormat(d.Year);
	
	return d;
}

}