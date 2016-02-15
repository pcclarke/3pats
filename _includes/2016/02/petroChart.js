var petroChart = function() {
	//Set up stack method
	var stack = d3.layout.stack()
					.values(function(d) {
						return d.emissions;
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

	var color = d3.scale.category10();
	var serviceColor = d3.scale.ordinal()
		.range(colorbrewer.Greys[9]);
	var goodsColor = d3.scale.ordinal()
		.range(colorbrewer.Greys[5]);

	var svg = d3.select("#petroChart")
				.append("svg")
				.attr("width", w + padding.left + padding.right)
				.attr("height", h + padding.top + padding.bottom)
			.append("g")
				.attr("transform", "translate(" + padding.left + "," + padding.top + ")")
				.attr("class", "stacked");

	d3.csv("{{ site.baseurl }}/data/2016/02/canadian_wages.csv", function(data) {

		var quarters = d3.keys(data[0]).filter(function(d) { return d !== "Industry" && d !== "Type"; });

		var dataset = [];
		var servIndustries = [];
		var goodIndustries = [];

		//Loop once for each row in data
		for (var i = 0; i < data.length; i++) {

			//Create new object with this country's name and empty array
			dataset[i] = {
				country: data[i].Industry,
				type: data[i].Type,
				emissions: []
			};

			if (data[i].Type === "Goods-producing") {
				goodIndustries.push(data[i].Industry);
			} else {
				servIndustries.push(data[i].Industry);
			}

			//Loop through all the years
			for (var j = 0; j < quarters.length; j++) {

				//Default value, used in case no value is present
				var amount = null;

				// If value is not empty
				if (data[i][quarters[j]]) {
					amount = +data[i][quarters[j]];
				}

				//Add a new object to the emissions data array
				//for this country
				dataset[i].emissions.push({
					x: quarters[j],
					y: amount
				});

			}
		}

		stack(dataset);

		xScale.domain(quarters);

		var tickFilter = xScale.domain().filter(function(d) { return (+d.substring(0, 4) % 5) == 0 && d.substring(d.length - 2) === "Q1"; } );
		xAxis.tickValues(tickFilter);

		var totals = [];

		for (i = 0; i < quarters.length; i++) {
			totals[i] = 0;
			for (j = 0; j < dataset.length; j++) {
				totals[i] += dataset[j].emissions[i].y;
			}
		}

		yScale.domain([ d3.max(totals), 0 ]);

		serviceColor.domain(servIndustries);
		goodsColor.domain(goodIndustries);

		var paths = svg.selectAll("path")
			.data(dataset)
			.enter()
			.append("path")
			.attr("class", "area")
			.attr("d", function(d) {
				//Calculate path based on only d.emissions array,
				//not all of d (which would include the country name)
				return preArea(d.emissions);
			})
			.attr("stroke", "none")
			.attr("fill", function(d, i) {
				if (d.type === "Goods-producing") {
					return goodsColor(d.country);
				} else {
					return serviceColor(d.country);
				}
			})
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
				return area(d.emissions);
			})

		paths.append("title")
			.text(function(d) {
				return d.country;
			});

		//Create axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);

		svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Million dollars");

	});
}();