var bcinc = function() {

	var margin = {top: 20, right: 20, bottom: 30, left: 100},
		width = 740 - margin.left - margin.right,
		height = 800 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width]);

	var y0 = d3.scale.ordinal()
		.rangeRoundBands([0, height], .1);

	var y1 = d3.scale.ordinal();

	var color = d3.scale.ordinal()
		.range(["#d6d6d6", "#c0c0c0", "#a9a9a9", "#929292", "#919191", "#797979", "#5e5e5e"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.format(".2"));

	var yAxis = d3.svg.axis()
		.scale(y0)
		.orient("left");

	var svg = d3.select("#bcincChart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2016/02/bcinc.csv", function(error, data) {
	  if (error) throw error;

	  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "income"; });

	  data.forEach(function(d) {
		d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	  });

	  y0.domain(data.map(function(d) { return d.income; }));
	  y1.domain(ageNames).rangeRoundBands([0, y0.rangeBand()]);
	  x.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .append("text")
		  .attr("x", width - 2)
		  .attr("y", -5)
		  .style("text-anchor", "end")
		  .text("Taxfilers and dependents");

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis);

	  var income = svg.selectAll(".income")
		  .data(data)
		.enter().append("g")
		  .attr("class", "income")
		  .attr("transform", function(d) { return "translate(0," + y0(d.income) + ")"; });

	  income.selectAll("rect")
		  .data(function(d) { return d.ages; })
		.enter().append("rect")
		  .attr("width", function(d) { return x(d.value); })
		  .attr("x", function(d) { return 0; })
		  .attr("y", function(d) { return y1(d.name); })
		  .attr("height", y1.rangeBand())
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