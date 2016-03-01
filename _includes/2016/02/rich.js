var rich = function() {
	var years,
		yearFormat = d3.time.format("%Y");
			
	var numFormat = d3.format(",.0");
	var percentFormat = d3.format("%");

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
      width = 740 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangePoints([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);
      
  var voronoi = d3.geom.voronoi()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); })
      .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);
      
  var lineFlat = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(0); });

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#richChart").append("svg")
      .attr("class", "budgetPlotted")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("{{ site.baseurl }}/data/2016/02/rich.csv", type, function(error, data) {
		x.domain(years);
		y.domain([d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
			d3.max(data, function(c) { return d3.max(c.values, function(d) { return d.value; }); 
	    })]).nice();
	    
	svg.append("line")
		.attr("class", "zeroLine")
		.attr("x1", x(x.domain()[0]))
		.attr("y1", y(0))
		.attr("x2", x(x.domain()[x.domain().length - 1]))
		.attr("y2", y(0));

	svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickValues(years.filter(function(y, i) { 
          	if (i % 4 == 0) return y; 
          }))
        );

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(percentFormat));

    var lines = svg.append("g")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", function(d) { d.line = this; return lineFlat(d.values); })
		.attr("class", "data");
		
	lines.transition()
		.duration(1000)
		.attr("d", function(d) { d.line = this; return line(d.values); });

    var focus = svg.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focus");

    focus.append("circle")
        .attr("r", 3.5);

    focus.append("text")
        .attr("y", -10);

    var voronoiGroup = svg.append("g")
        .attr("class", "voronoi");

   	voronoiGroup.selectAll("path")
      .data(voronoi(d3.nest()
        .key(function(d) { return x(d.date) + "," + y(d.value); })
        .rollup(function(v) { return v[0]; })
        .entries(d3.merge(data.map(function(d) { return d.values; })))
        .map(function(d) { return d.values; })))
      .enter().append("path")
        .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
        .datum(function(d) { return d.point; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseover(d) {
      d3.select("#richTip").select("#richName")
				.text("Earning " + d.budget.name + " in " + d.date);
				
		function changeText(val) {
					if (val > 0)
						return "increase";
					else if (val < 0)
						return "decrease";
					else
						return "";
				};
      d3.select("#richTip").select("#richVal")
				.text(percentFormat(Math.abs(d.value)) + " " + changeText(d.value) + " in population");
				console.log(d.budget);
      d3.select("#richTip").select("#richAvg")
				.text(percentFormat(Math.abs(d.budget.average)) + " average " + changeText(d.budget.average) + " over " + x.domain()[0] + "-" + x.domain()[x.domain().length - 1]);

      d3.select(d.budget.line).classed("budget--hover", true);
      d.budget.line.parentNode.appendChild(d.budget.line);
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
      
      d3.select("#richTip").classed("hidden", false);
    }

    function mouseout(d) {
      d3.select(d.budget.line).classed("budget--hover", false);
      focus.attr("transform", "translate(-100,-100)");
    }
  });

  function type(d, i) {
    if (!i) years = Object.keys(d).filter(function(key) { return key!== "Income" && key !== "Average"; });
    var budget = {
      name: d.Income,
      average: d.Average,
      values: null
    };
    budget.values = years.map(function(m) {
      return {
      	budget: budget,
        date: m,
        value: +d[m]
      };
    });
    return budget;
  }
}();