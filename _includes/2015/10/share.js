refugeeShare();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function refugeeShare() {

var margin = {top: 70, right: 20, bottom: 30, left: 50},
    width = 740 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse,
    formatPercent = d3.format(".0%");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
		.domain(["Source area not stated", "Africa and the Middle East", "South and Central America", "Asia and Pacific", "Europe and the United Kingdom", "United States"])
		.range(["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"]);
		
		d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

var share = d3.select("#shareChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("{{ site.baseurl }}/data/refugee_source_p.csv", type, function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  var browsers = stack(color.domain().map(function(name) {
		
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.Year, y: d[name] / 100};
      })
    };
  }));

  x.domain(d3.extent(data, function(d) { return d.Year; }));

  var browser = share.selectAll(".browser")
      .data(browsers)
    .enter().append("g")
      .attr("class", "browser");

  browser.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { return color(d.name); })
			.on("mouseover", function(d) {
				d3.select(this).style("fill", "#000000");
				showTooltip(d);
			})
			.on("mousedown", function(d) {
				d3.select(this).style("fill", "#000000");
				showTooltip(d);
			})
			.on("mouseout", function(d) {
				d3.select(this).style("fill", function(d) { return color(d.name); });
				d3.select("#shareTip").classed("hidden", true);
			});
			
	function showTooltip(d) {
    var xPos = coordinates[0] + 10;
    if (d.Year > 2000) {
      xPos = coordinates[0] - 250;
    }
    var yPos = coordinates[1];
		
		
		
	  d3.select("#shareTip")
	    .style("left", xPos + "px")
	    .style("top", yPos + "px")
	    .select("#tipRegion")
	    .text(d.name);
			
		d3.select("#shareTip").classed("hidden", false);
	}
			
  share.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  share.append("g")
      .attr("class", "y axis")
      .call(yAxis);
			
  var legend = share.selectAll(".shareLegend")
      .data(color.domain())
    .enter().append("g")
			.attr("class", "shareLegend")
      .attr("transform", function(d, i) { 
				if (i < 3) {
					return "translate(0," + ((i * -20) - 30) + ")";					
				}
				return "translate(" + -200 +"," + ((i - 3) * -20 - 30) + ")"; 
			});
			
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
	d["Africa and the Middle East"] = +d["Africa and the Middle East"];
	d["Asia and Pacific"] = +d["Asia and Pacific"];
	d["Europe and the United Kingdom"] = +d["Europe and the United Kingdom"];
	d["United States"] = +d["United States"];
	d["South and Central America"] = +d["South and Central America"];
	d["Source area not stated"] = +d["Source area not stated"];
	d.Year = parseDate(d.Year);
	
	return d;
}

}