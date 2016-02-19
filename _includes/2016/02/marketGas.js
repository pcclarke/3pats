var marketGas = function() {

	//Set up stack method
	var stack = d3.layout.stack()
					.values(function(d) {
						return d.production;
					});



	//Width, height, padding
	var padding = {top: 20, right: 10, bottom: 50, left: 50},
		w = 740 - padding.left - padding.right,
		h = 400 - padding.top - padding.bottom;

	//Set up scales
	var xScale = d3.scale.ordinal()
						.rangePoints([ 0, w ]);
	
	var yScale = d3.scale.linear()
						.range([ 0, h]);

	//Configure axis generators
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");

	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks(5);

	var coordinates = [0, 0];

	var body = d3.select("body")
		.on("mousemove", function() {
			coordinates = d3.mouse(this);
		})
		.on("mousedown", function() {
			coordinates = d3.mouse(this);
		});

	//Configure area generator
	var preArea = d3.svg.area()
		.x(function(d) {
			return xScale(d.x);
		})
		.y0(function(d) {
			return yScale(0);  //Updated
		})
		.y1(function(d) {
			return yScale(0);  //Updated
		});

	//Configure area generator
	var area = d3.svg.area()
		.x(function(d) {
			return xScale(d.x);
		})
		.y0(function(d) {
			return yScale(d.y0);  //Updated
		})
		.y1(function(d) {
			return yScale(d.y0 + d.y);  //Updated
		});

	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();
	var serviceColor = d3.scale.ordinal()
		.range(colorbrewer.Greys[7]);


	//Create the empty SVG image
	var svg = d3.select("#marketGasChart")
				.append("svg")
				.attr("width", w + padding.left + padding.right)
				.attr("height", h + padding.top + padding.bottom)
			.append("g")
				.attr("transform", "translate(" + padding.left + "," + padding.top + ")")
				.attr("class", "stacked");


	//Load data
	d3.csv("{{ site.baseurl }}/data/2016/02/marketable_gas.csv", function(data) {

		var months = d3.keys(data[0]).filter(function(d) { return d !== "Jurisdiction"; });

		var dataset = [],
			jurisdictions = [];

		//Loop once for each row in data
		for (var i = 0; i < data.length; i++) {
			dataset[i] = {
				country: data[i].Jurisdiction,
				production: []
			};

			jurisdictions.push(data[i].Jurisdiction);
			
			for (var j = 0; j < months.length; j++) {
				var amount = null;

				if (data[i][months[j]]) {
					amount = (+data[i][months[j]]) / 1000;
				}

				dataset[i].production.push({
					x: months[j],
					y: amount
				});

			}
		}

		stack(dataset);

		xScale.domain(months);

		var tickFilter = xScale.domain().filter(function(d) { return (+d.substring(0, 4) % 5) == 0 && d.substring(d.length - 2) === "Q1"; } );
		xAxis.tickValues(tickFilter);

		var totals = [];

		for (i = 0; i < months.length; i++) {
			totals[i] = 0;
			for (j = 0; j < dataset.length; j++) {
				totals[i] += dataset[j].production[i].y;
			}
		}

		yScale.domain([ d3.max(totals), 0 ]);

		serviceColor.domain(jurisdictions);

		var paths = svg.selectAll("path")
			.data(dataset)
			.enter()
			.append("path")
			.attr("class", "area")
			.attr("d", function(d) { return preArea(d.production); })
			.attr("stroke", "none")
			.attr("fill", function(d, i) { return serviceColor(d.country); })
			.on("mouseover", function(d) {
				d3.select(".tooltip")
					.style("left", coordinates[0] + "px")
					.style("top", coordinates[1] + "px");
					
				d3.select(".tooltip")
					.select("#wageType").text(d.country);

				d3.select(".tooltip").classed("hidden", false);
			})
			.on("mouseout", function(d) {
				d3.select(".tooltip").classed("hidden", true);	
			});

		paths.transition()
			.duration(2000)
			.attr("d", function(d) {
				return area(d.production);
			})

		paths.append("title")
			.text(function(d) {
				return d.country;
			});

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
	});

}();