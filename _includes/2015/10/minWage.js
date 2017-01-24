minChart();

function minChart() {

var margin = {top: 20, right: 30, bottom: 30, left: 160},
    width = 740 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);
		
var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);
		
var formatPercent = d3.format("%"),
		formatPercentDeci = d3.format(".1%");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
		.tickFormat(formatPercent);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var minChart = d3.select("#minWageChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/2015/10/13/min_wage.csv", type, function(error, data) {
	
  y.domain(data.map(function(d) { return d.Province; }));
  x.domain([0, d3.max(data, function(d) { return d.percent; })]);

  minChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  minChart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var minWages = minChart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) {
      	return (d.Province === "Canada") ? "barCan barSel" : "bar";
      })
			.attr("x", function(d) { return x(0); })
      .attr("y", function(d) { return y(d.Province); })   
      .attr("width", function(d) { return x(0); })
      .attr("height", y.rangeBand())
		.on("mouseover", function(d) {
			d3.selectAll("#minWageChart .barSel").classed("barSel", false);
			d3.select(this).classed("barSel", true);
			showTooltip(d);
		})
		.on("mousedown", function(d) {
			d3.selectAll("#minWageChart .barSel").classed("barSel", false);
			d3.select(this).classed("barSel", true);
			showTooltip(d);
		});
		
		minWages.transition()
			.delay(function(d, i) { return i * 8; })
			.attr("width", function(d) {return x(d.percent); });
			
	  d3.select("#minTip").select("#tipProv")
	    .text(data[1]["Province"]);
			
		d3.select("#minTip").select("#tipPercent")
			.text(formatPercentDeci(data[1]["percent"]));
		
		function showTooltip(d) {
		  d3.select("#minTip").select("#tipProv")
		    .text(d.Province);
				
			d3.select("#minTip").select("#tipPercent")
				.text(formatPercentDeci(d.percent));
		}
});

function type(d) {
  d.percent = +d.percent;
	
  return d;
}

}