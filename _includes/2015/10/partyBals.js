partyBals();

function partyBals() {
  var years,
      yearFormat = d3.time.format("%Y");

  var margin = {top: 20, right: 20, bottom: 30, left: 20},
      width = 740 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var voronoi = d3.geom.voronoi()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); })
      .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

  var svg = d3.select("#partyBalancesChart").append("svg")
      .attr("class", "budgetPlotted")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("{{ site.baseurl }}/data/2015/10/16/party_bals.csv", type, function(error, data) {
    x.domain(d3.extent(years));
    y.domain([d3.min(data, function(c) { 
        return d3.min(c.values, function(d) { return d.value; }); 
      }), 
      d3.max(data, function(c) { 
        return d3.max(c.values, function(d) { return d.value; }); 
      })]).nice();

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis()
			.ticks(4)
          .scale(x)
          .orient("bottom"));

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.svg.axis()
          .scale(y)
          .orient("left"))
			  .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Billions");

    svg.append("g")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", function(d) { d.line = this; return line(d.values); })
				.attr("class", function(d) {
					return "data " + d.name.toLowerCase();
				});

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
      d3.select("#partyBalancesTip").select("#tipParty")
				.text(d.budget.name + " " + d.date.getFullYear());
				
      d3.select("#partyBalancesTip").select("#tipVal")
				.text(Math.abs(d.value).toFixed(2) + " billion dollars ");
				
      if (d.value > 0) {
        d3.select("#partyBalancesTip").select("#tipBal")
          .text("surplus");
      } else {
        d3.select("#partyBalancesTip").select("#tipBal")
          .text("deficit");
      }

      d3.select(d.budget.line).classed("budget--hover", true);
      d.budget.line.parentNode.appendChild(d.budget.line);
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    }

    function mouseout(d) {
      d3.select(d.budget.line).classed("budget--hover", false);
      focus.attr("transform", "translate(-100,-100)");
    }
  });

  function type(d, i) {
    if (!i) years = Object.keys(d).map(yearFormat.parse).filter(Number);
    var budget = {
      name: d.Party,
      values: null
    };
    budget.values = years.map(function(m) {
      return {
        budget: budget,
        date: m,
        value: (+d[yearFormat(m)]) / 1000
      };
    });
    return budget;
  }
}