newSpending();

var coordinates = [0, 0];

var body = d3.select("body")
  .on("mousemove", function() {
    coordinates = d3.mouse(this);
  })
  .on("mousedown", function() {
    coordinates = d3.mouse(this);
  });

function newSpending() {

var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 740 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

		var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
		.ticks(4)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; });
		
drawSpending("ndp");

function drawSpending(kind) {

	var share = d3.select("#partySpendingChart").append("svg")
		.attr("class", "spendingChart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2015/10/17/" + kind + "_spend_t.csv", type, function(error, data) {
	  if (error) throw error;
	
		color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

	  var browsers = stack(color.domain().map(function(name) {
	    return {
	      name: name,
	      values: data.map(function(d) {
	        return {date: d.Year, y: d[name]};
	      })
	    };
	  }));

	  x.domain(d3.extent(data, function(d) { return d.Year; }));
		
		if (kind === "ndp") {
			y.domain([0, 12000]);
		} else if (kind === "green") {
			y.domain([0, 45000]);
		} else if (kind === "con"){
			y.domain([0, 3000]);
		} else {
			y.domain([0, 40000]);
		}

	  var browser = share.selectAll(".browser")
	      .data(browsers)
	    .enter().append("g")
	      .attr("class", "browser");

	  browser.append("path")
	    .attr("class", "area")
	    .attr("d", function(d) { return area(d.values); })
	    .style("fill", function(d) { return color(d.name); })
			.on("mouseover", function(d) {
				showTooltip(d, this);
			})
			.on("mousedown", function(d) {
				showTooltip(d, this);
			});
			
		function showTooltip(d, obj) {
			d3.selectAll("#partySpendingChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
		  d3.select("#partySpendingTip").select("#tipRegion")
		    .text(d.name);
		}
			
	  share.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  share.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
		  .append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 6)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Millions");
	});

	function type(d) {
		d3.keys(d).filter(function(key) { return key !== "Year"; }).forEach(function(key) {
			d[key] = +d[key];
		});
		d.Year = parseDate(d.Year);
	
		return d;
	}
	
}

d3.select("#selectSpending")
  .on("change", selected);

function selected() {
  d3.selectAll(".spendingChart")
    .remove();
  d3.select("#partySpendingTip").select("#tipRegion")
    .text("");
  drawSpending(this.options[this.selectedIndex].value);
}

}