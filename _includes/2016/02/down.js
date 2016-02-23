var downBudget = function() {

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#downChart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2016/02/down.csv", function(error, data) {
	  if (error) throw error;

	  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

	  data.forEach(function(d) {
		d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	  });

	  x0.domain(data.map(function(d) { return d.State; }));
	  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
	  y.domain([d3.min(data, function(d) { return d3.min(d.ages, function(d) { return d.value; }); }), 
	  	d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);
	  	
	  	console.log(y.domain());

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		  
		svg.append("g")
			.attr("class", "xLine")
		.append("line")
		  .attr("y1", y(0))
		  .attr("y2", y(0))
		  .attr("x1", 0)
		  .attr("x2", width)
		  .style("stroke", "black");

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Population");

	  var state = svg.selectAll(".state")
		  .data(data)
		.enter().append("g")
		  .attr("class", "state")
		  .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

	  state.selectAll("rect")
		  .data(function(d) { return d.ages; })
		.enter().append("rect")
		  .attr("width", x1.rangeBand())
		  .attr("x", function(d) { return x1(d.name); })
		  .attr("y", function(d) { return y(Math.max(0, d.value)); })
		  .attr("height", function(d) { return Math.abs(y(d.value) - y(0)); /*return height - y(d.value);*/ })
		  .style("fill", function(d) { return color(d.name); });

	  var legend = svg.selectAll(".legend")
		  .data(ageNames.slice().reverse())
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