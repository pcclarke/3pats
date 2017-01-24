versusChart();

function versusChart() {

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var numFormat = d3.format(",.0");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
		.ticks(4)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var revLine = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d["Revenue"]); });
		
var spendLine = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d["Spending"]); });

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d["Revenue"]); });
		
drawVersus("liberal");
		
function drawVersus(kind) {
	var svg = d3.select("#versusChart").append("svg")
			.attr("class", "versusSvg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2015/10/19/" + kind.toLowerCase() + "_versus.csv", function(error, data) {
	  if (error) throw error;

	  data.forEach(function(d) {
	    d.date = parseDate(d.date);
	    d["Revenue"]= +d["Revenue"];
	    d["Spending"] = +d["Spending"];
	  });

	  x.domain(d3.extent(data, function(d) { return d.date; }));

	  y.domain([
	    d3.min(data, function(d) { return Math.min(d["Revenue"], d["Spending"]); }),
	    d3.max(data, function(d) { return Math.max(d["Revenue"], d["Spending"]); })
	  ]);

	  svg.datum(data);

	  svg.append("clipPath")
	      .attr("id", "clip-below")
	    .append("path")
	      .attr("d", area.y0(height));

	  svg.append("clipPath")
	      .attr("id", "clip-above")
	    .append("path")
	      .attr("d", area.y0(0));

	  svg.append("path")
	      .attr("class", "area above")
	      .attr("clip-path", "url(#clip-above)")
	      .attr("d", area.y0(function(d) { return y(d["Spending"]); }));

	  svg.append("path")
	      .attr("class", "area below")
	      .attr("clip-path", "url(#clip-below)")
	      .attr("d", area);

	  svg.append("path")
	      .attr("class", "revLine")
	      .attr("d", revLine)
				.on("mouseover", function(d) {
					showTooltip(d, this, "Revenue");
				})
		    .on("mousedown", function(d) {
					showTooltip(d, this, "Revenue");
		    });
			
	  svg.append("path")
	      .attr("class", "spendLine")
	      .attr("d", spendLine)
				.on("mouseover", function(d) {
					showTooltip(d, this, "Spending");
				})
		    .on("mousedown", function(d) {
					showTooltip(d, this, "Spending");
		    });
				
		/*svg.selectAll(".revCircle")
				.data(data)
			.enter().append("circle")
				.attr("class", "circle")
				.attr("r", 5)
				.attr("cx", function(d) { return x(d.date); })
				.attr("cy", function(d) { return y(d.Revenue); })
				
				
		svg.selectAll(".spendCircle")
				.data(data)
			.enter().append("circle")
				.attr("class", "circle")
				.attr("r", 5)
				.attr("cx", function(d) { return x(d.date); })
				.attr("cy", function(d) { return y(d.Spending); })
				.on("mouseover", function(d) {
					showTooltip(d, this, "Spending");
				})
		    .on("mousedown", function(d) {
					showTooltip(d, this, "Spending");
		    });*/
				
		function showTooltip(d, obj, val) {
			d3.selectAll("#versusChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
	    d3.select("#versusTip").select("#tipBudget")
				.text(kind + " New " + val);
		}

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
	      .text("Millions ($)");
	});
}

d3.select("#selectVersus")
  .on("change", selected);

function selected() {
  d3.selectAll(".versusSvg")
    .remove();
  d3.select("#versusTip").select("#tipBudget")
    .text("");
  drawVersus(this.options[this.selectedIndex].value);
}

}