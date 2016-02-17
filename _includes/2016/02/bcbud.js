var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

var bcbud = function() {

	var margin = {top: 30, right: 10, bottom: 10, left: 50},
		width = 740 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var y = d3.scale.linear()
	  .range([height, 0]);

	var x = d3.scale.ordinal()
	  .rangeRoundBands([0, width], .2);

	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left");

	var budgetChart = d3.select("#bcbudChart").append("svg")
		.attr("class", "budget")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("{{ site.baseurl }}/data/2016/02/bc_budget_2016.csv", type, function(error, data) {
	
	  x.domain(data.map(function(d) { return d.Year; }));
	  y.domain(d3.extent(data, function(d) { return d["Surplus/deficit"]; })).nice();

	  var budgets = budgetChart.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", function(d) {
			if(d.Type !== "Actual") {
			  return d["Surplus/deficit"] < 0 ? "bar forenegative" : "bar forepositive"; 
			} else {
			  return d["Surplus/deficit"] < 0 ? "bar negative" : "bar positive"; 
			}
		  })
		  .attr("x", function(d) { return x(d.Year); })
		  .attr("y", function(d) { return y(0); })
		  .attr("width", x.rangeBand())
		  .attr("height", function(d) { return 0; })
		  .on("mouseover", function(d, i) {
			showTooltip(d, i);
		  })
		  .on("mousedown", function(d, i) {
			showTooltip(d, i);
		  })
		  .on("mouseout", function(d) {

		  });

	  budgets.transition()
		.delay(function(d, i) { return i * 32})
		.attr("y", function(d) { return y(Math.max(0, d["Surplus/deficit"])); })
		.attr("height", function(d) { return Math.abs(y(d["Surplus/deficit"]) - y(0));});

	  function showTooltip(d) {
		d3.select("#bcbudTip").select("#budgetYear")
			.text(d.Year + " BC Budget");

		if (Math.abs(d["Surplus/deficit"]) > 1000) {
			d3.select("#bcbudTip").select("#budgetVal")
			  .text(Math.abs(d["Surplus/deficit"]/1000).toFixed(2) + " billion dollars ");
		} else {
		d3.select("#bcbudTip").select("#budgetVal")
			.text(Math.abs(d["Surplus/deficit"]) + " million dollars ");
		}

		if (d["Surplus/deficit"] > 0) {
			d3.select("#bcbudTip").select("#budgetBal")
				.text("surplus");
		} else {
			d3.select("#bcbudTip").select("#budgetBal")
				.text("deficit");
		}
		
		d3.select("#bcbudTip").select("#budgetType")
			.text(d.Type);

		d3.select("#bcbudTip").classed("hidden", false);
	  }

	  budgetChart.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	  budgetChart.append("g")
		  .attr("class", "x axis")
		.append("line")
		  .attr("y1", y(0))
		  .attr("y2", y(0))
		  .attr("x2", width);
	});

	function type(d) {
		d["Surplus/deficit"] = +d["Surplus/deficit"];
		return d;
	}

}();
