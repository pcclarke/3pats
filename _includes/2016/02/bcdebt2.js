var bcDebt2 = function() {

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
	var xScale = d3.time.scale()
    	.range([0, w]);
	
	var yScale = d3.scale.linear()
		.range([ 0, h]);
		
	var dateFormat = d3.time.format("%Y");

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(15)
		.tickFormat(function(d) {
			return dateFormat(d);
		});

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(5);

	var M;
	var monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];

	var preArea = d3.svg.area()
		.x(function(d) {
			return xScale(dateFormat.parse(d.x));
		})
		.y0(function(d) {
			return yScale(0);
		})
		.y1(function(d) {
			return yScale(0);
		});

	var area = d3.svg.area()
		.x(function(d) {
			return xScale(dateFormat.parse(d.x));
		})
		.y0(function(d) {
			return yScale(d.y0);
		})
		.y1(function(d) {
			return yScale(d.y0 + d.y);
		});

	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.ordinal().range(["#ebebeb", "#d6d6d6", "#c0c0c0", "#a9a9a9", "#929292", "#919191", "#797979", "#5e5e5e", "#424242", "#212121"]);


	//Create the empty SVG image
	var svg = d3.select("#debtChart2")
				.append("svg")
				.attr("width", w + padding.left + padding.right)
				.attr("height", h + padding.top + padding.bottom)
			.append("g")
				.attr("transform", "translate(" + padding.left + "," + padding.top + ")")
				.attr("class", "stacked");


	//Load data
	d3.csv("{{ site.baseurl }}/data/2016/02/bc_debt2.csv", function(data) {

		var months = d3.keys(data[0]).filter(function(d) { return d !== "Type"; });

		var dataset = [],
			Types = [];

		//Loop once for each row in data
		for (var i = 0; i < data.length; i++) {
			dataset[i] = {
				country: data[i].Type,
				production: []
			};

			Types.push(data[i].Type);
			
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

		xScale.domain([ 
			d3.min(months, function(d) {
				return dateFormat.parse(d);
			}),
			d3.max(months, function(d) {
				return dateFormat.parse(d);
			})
		]);
		
		console.log(xScale.domain());

		var totals = [];

		for (i = 0; i < months.length; i++) {
			totals[i] = 0;
			for (j = 0; j < dataset.length; j++) {
				totals[i] += dataset[j].production[i].y;
			}
		}

		yScale.domain([ d3.max(totals), 0 ]);

		var vertical = svg.append("line")
			.attr("x1", 0)
			.attr("y1", yScale(yScale.domain()[0]))
			.attr("x2", 0)
			.attr("y2", yScale(yScale.domain()[1]))
			.attr("class", "vertical");
			
		d3.select("#debtChart2")
		  .on("mousemove", function(){
			if (d3.mouse(svg[0][0])[0] > 0 && d3.mouse(svg[0][0])[0] < w) {
				 M = d3.mouse(svg[0][0]);
				 vertical.attr("x1", M[0]);
				 vertical.attr("x2", M[0]);
			 }
			 })
		  .on("mouseover", function(){  
			if (d3.mouse(svg[0][0])[0] > 0 && d3.mouse(svg[0][0])[0] < w) {
				 M = d3.mouse(svg[0][0]);
				 vertical.attr("x1", M[0]);
				 vertical.attr("x2", M[0]);
			 }
			});

		color.domain(Types);

		var paths = svg.selectAll("path")
			.data(dataset)
			.enter()
			.append("path")
			.attr("class", "area")
			.attr("d", function(d) { return preArea(d.production); })
			.attr("stroke", "none")
			.attr("fill", function(d, i) { return color(d.country); })
			.on("mousemove", function(d) {
				updateTooltip(d);
			})
			.on("mouseover", function(d) {
				updateTooltip(d);
			})
			.on("click", function(d) {
				updateTooltip(d);
			});
			
		function updateTooltip(d) {
			var selDate = xScale.invert(M[0] + 5);
			
			d3.select("#debtTip2")
				.select("#debtJur").text(d.country + ", " + selDate.getFullYear() + "/" + 
				((selDate.getFullYear() >= 2000) ? (selDate.getFullYear() + 1 - 2000) : (selDate.getFullYear() + 1 - 1900)));
			
			for (var i = 0; i < d.production.length; i ++) {
				var yearStr = "" + selDate.getFullYear();
				if (yearStr === d.production[i].x) {
					d3.select("#debtTip2")
						.select("#debtVal").text(d.production[i].y);
				}
			}
			
			d3.select("#debtTip2").classed("hidden", false);
		}

		paths.transition()
			.duration(2000)
			.attr("d", function(d) {
				return area(d.production);
			})

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
	});

}();