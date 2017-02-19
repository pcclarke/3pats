var muniSelect = "Percent";

var percentFormat = d3.format(".0%"),
    precisionFormat = d3.format(".2"),
    decimalFormat = d3.format("d");

// Map variables

var margin = {top: 30, right: 10, bottom: 10, left: 50},
    width = 740,
    height = 300;

var projection = d3.geoMercator()
    .scale(22000)
    .translate([370, 120])
    .center([-122.275085, 49.292385]);

var color = d3.scaleOrdinal()
    .range(["#000000", "#ff0000"]);

var path = d3.geoPath()
    .projection(projection);

var mapSvg = d3.select("#map").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content", true);

var pie = d3.pie()
    .value(function(d) { return d.value; });

var pieScale = 1.7;

var arc = d3.arc()
    .outerRadius(function(d) { return Math.sqrt(d.data.total) / pieScale; })
    .innerRadius(0);

// Bar chart variables

var coordinates = [0, 0];

var body = d3.select("body")
	.on("mousemove", function() {
		coordinates = d3.mouse(this);
	})
	.on("mousedown", function() {
		coordinates = d3.mouse(this);
	});

var barMargin = {top: 20, right: 20, bottom: 30, left: 170},
    barWidth = 740 - barMargin.left - barMargin.right,
    barHeight = 400 - barMargin.top - barMargin.bottom;

var x = d3.scaleLinear()
          .range([0, barWidth]);
var y = d3.scaleBand()
          .range([0, barHeight])
          .padding(0.1);

var barSvg = d3.select("#chart").append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

var type = function(d) {
    var pie = [];
    var homelessData = {};
    var nonHomelessData = {};
    d.Longitude = +d.Longitude;
    d.Latitude = +d.Latitude;
    d["Homeless YTD"] = +d["Homeless YTD"];
    d["Non-Homeless YTD"] = +d["Non-Homeless YTD"];
    d["Overall YTD"] = +d["Overall YTD"];
    
    nonHomelessData.total = d["Overall YTD"];
    nonHomelessData.value = d["Non-Homeless YTD"];
    homelessData.total = d["Overall YTD"];
    homelessData.value = d["Homeless YTD"];
    pie.push(nonHomelessData);
    pie.push(homelessData);
    d.pie = pie;

    return d;
}

d3.queue()
    .defer(d3.json, "{{ site.baseurl }}/data/2017/01/lowermainland.json")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/02/hospitals.csv", type)
    .await(function ready(error, bcMuni, data) {

        var getCommunity = function(d) { return d.properties.CSDNAME.replace(/ /g, "_").toLowerCase(); };

        var viewMapInfo = function(d) {
            d3.select("#infoBox")
                .style("left", function(temp) {
                    var shift = (d3.event.pageX + 5) + "px";
                    if (d3.event.pageX > 500) {
                      shift = (d3.event.pageX - 330) + "px";
                    }
                    return shift;
                })
                .style("top", (d3.event.pageY - 12) + "px");

            d3.select("#label").text(d.Hospital);
            d3.select("#community").text(d.Community);
            d3.select("#hlsVal").text(d["Homeless YTD"]);
            d3.select("#hlsPer").text(function(e) {
                return percentFormat(d["Homeless YTD"] / d["Overall YTD"]);
            });
            d3.select("#ovVal").text(d["Overall YTD"]);

            d3.select("#infoBox").classed("hidden", false);
        };

        var mapSelect = (function() {
            // var community = "";

            // return {
            //     in : function(d) {
            //         d3.select("#infoBoxMap")
            //             .style("left", function(temp) {
            //                 var shift = (d3.event.pageX + 5) + "px";
            //                 if (d.properties.CSDNAME == "Hope" || 
            //                     d.properties.CSDNAME == "Agassiz-Harrison" || 
            //                     d.properties.CSDNAME == "Chilliwack") {
            //                   shift = (d3.event.pageX - 330) + "px";
            //                 }
            //                 return shift;
            //             })
            //             .style("top", (d3.event.pageY - 12) + "px");

            //         d3.select("#label")
            //             .text(muniOds.get(d.properties.CSDNAME)[0]["Community"]);
            //         d3.select("#op10wk")
            //             .text(muniOds.get(d.properties.CSDNAME)[0]["Opioid 10wk avg"]);
            //         d3.select("#opytd")
            //             .text(muniOds.get(d.properties.CSDNAME)[0]["Opioid YTD"]);
            //         d3.select("#ov10wk")
            //             .text(muniOds.get(d.properties.CSDNAME)[0]["Overall 10wk avg"]);
            //         d3.select("#ov10ytd")
            //             .text(muniOds.get(d.properties.CSDNAME)[0]["Overall YTD"]);
            //         d3.select("#opovper")
            //             .text(percentFormat(muniOds.get(d.properties.CSDNAME)[0]["Percent"]));
            //         d3.select("#infoOppop").classed("hidden", false);
            //         d3.select("#infoOvpop").classed("hidden", false);
            //         d3.select("#oppop")
            //             .text(precisionFormat(muniOds.get(d.properties.CSDNAME)[0]["Percent Opioid"]));
            //         d3.select("#ovpop")
            //             .text(precisionFormat(muniOds.get(d.properties.CSDNAME)[0]["Percent Overall"]));
                    
            //         community = getCommunity(d);
            //         d3.select(".label-" + community).classed("selLabel", true);
            //         d3.select("#infoBoxMap").classed("hidden", false);
            //     },
            //     out: function() {
            //         d3.select("#infoBoxMap").classed("hidden", true);
            //         d3.select(".label-" + community).classed("selLabel", false);
            //     }
            //  };
        })();

        var viewBarInfo = function(d) {
            // d3.select("#infoBoxMap")
            //     .style("left", function(temp) {
            //         var shift = (d3.event.pageX + 5) + "px";
            //         if (d3.event.pageX > 500) {
            //           shift = (d3.event.pageX - 330) + "px";
            //         }
            //         return shift;
            //     })
            //     .style("top", (d3.event.pageY - 12) + "px");

            // d3.select("#label")
            //     .text(d["Community"]);
            // d3.select("#op10wk")
            //     .text(d["Opioid 10wk avg"]);
            // d3.select("#opytd")
            //     .text(d["Opioid YTD"]);
            // d3.select("#ov10wk")
            //     .text(d["Overall 10wk avg"]);
            // d3.select("#ov10ytd")
            //     .text(d["Overall YTD"]);
            // d3.select("#opovper")
            //     .text(percentFormat(d["Percent"]));
            // if (d.Community !== "Other") {
            //     d3.select("#infoOppop").classed("hidden", false);
            //     d3.select("#infoOvpop").classed("hidden", false);
            //     d3.select("#oppop")
            //         .text(precisionFormat(d["Percent Opioid"]));
            //     d3.select("#ovpop")
            //         .text(precisionFormat(d["Percent Overall"]));
            // } else {
            //     d3.select("#infoOppop").classed("hidden", true);
            //     d3.select("#infoOvpop").classed("hidden", true);
            // }

            // d3.select("#infoBoxMap").classed("hidden", false);
        };

        var setXDomain = function() {
            x.domain([
              d3.min(data, function(d) { return d["Overall YTD"]; }), 
              d3.max(data, function(d) { return d["Overall YTD"]; })
            ]);
        };

        var makeLegend = function() {
            var leg = mapSvg.selectAll(".legend")
                .data(function(d) {
                    var max = d3.max(data, function(d) { return d[muniSelect]; });
                    var min = d3.min(data, function(d) { return d[muniSelect]; });
                    var diff = max - min;
                    var fifths = [];

                    for (var i = 0; i < 4; i ++) {
                      fifths.push(min + (.2 * i * diff));
                    }
                    fifths.push(max);

                    return fifths;
                })
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(25," + (25 + i * 15) + ")"; });

            leg.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", function(d) { return color(d); });

            leg.append("text")
                .attr("x", 20)
                .attr("y", 9)
                .attr("dy", ".35em")
                .attr("class", "legendText")
                .style("text-anchor", "start")
                .text(function(d) {
                    var dataText = "";
                    if (muniSelect === "Percent") {
                        dataText = percentFormat(d);
                    } else if (muniSelect === "Percent Opioid" || muniSelect === "Percent Overall") {
                        dataText = decimalFormat(d) + " per 1000";
                    } else {
                      dataText = decimalFormat(d);
                    }
                    return dataText;
                });
        };


        // Map

        var city = mapSvg.selectAll(".city")
            .data(topojson.feature(bcMuni, bcMuni.objects.lowermainland).features)
            .enter().append("path")
            .attr("class", function(d) {
                var community = d.properties.CSDNAME.replace(' ', "_").toLowerCase();
                return "city " + community;
            })
            .attr("d", path);

        var hospOds = d3.nest()
            .key(function(d) { return d.Hospital; })
            .map(data, d3.map);

        console.log(data);

        var groups = mapSvg.selectAll(".hospital")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + projection([d.Longitude, d.Latitude])[0] + ", " + projection([d.Longitude, d.Latitude])[1] + ")";
            })
            .attr("class", function(d) {
                return "hospital " + d.Hospital;
            })
            .on("mouseover", viewMapInfo)
            .on("mouseout", function(d) {
                d3.select("#infoBox").classed("hidden", true);
            })
            .on("click", viewMapInfo);

        var pies = groups.selectAll(".pie")
            .data(function(d) { return pie(d.pie); })
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("class", "pie")
            .style("fill", function(d, i) { return color(i); });

        var labels = groups.append("text")
            .attr("class", "hospitalLabel")
            .style("text-anchor", function(d) {
                if (d.Community === "Burnaby" ||
                    d.Community === "Surrey" ||
                    d.Community === "Hope") {
                    return "end";
                }
                return "start";
            })
            .attr("x", function(d) {
                if (d.Community === "Burnaby") {
                    return 20;
                } else if (d.Community === "New Westminster") {
                    return 2;
                } else if (d.Community === "Surrey" ||
                    d.Community === "Hope") {
                    return -(3 + Math.sqrt(d["Overall YTD"]) / pieScale);
                }
                return (3 + Math.sqrt(d["Overall YTD"]) / pieScale);
            })
            .attr("y", function(d) {
                if (d.Community === "Burnaby") {
                    return -(3 + Math.sqrt(d["Overall YTD"]) / pieScale)
                } else if (d.Community === "New Westminster") {
                    return -14;
                }
                return 5;
            })
            .text(function(d) { return d.Hospital; });

        // makeLegend();
        
        
        // Bar chart
        setXDomain();
        y.domain(data.map(function(d) { return d.Hospital; }));

        var bars = barSvg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(x.domain()[0]); })
              .attr("width", function(d) { return x(d["Overall YTD"]); })
              .attr("y", function(d) { return y(d.Hospital); })
              .attr("height", y.bandwidth())
              .attr("fill", function(d) { return "blue"; });
            //   .on("mouseover", function(d) { viewBarInfo(d); })
            //   .on("mouseout", function(d) { 
            //       d3.select("#infoBoxMap").classed("hidden", true); 
            //   })
            //   .on("click", function(d) { viewBarInfo(d); });

        var bottomAxis = d3.axisBottom(x)
          .tickFormat(function(d) {
            // if (muniSelect === "Percent") {
            //   return percentFormat(d);
            // }
            return d;
          });

        var xAxis = barSvg.append("g")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(bottomAxis);

        barSvg.append("g")
            .call(d3.axisLeft(y));

        d3.select("#infoBox")
            .on("click", function(d) {
                d3.select("#infoBox").classed("hidden", true);
            });

  });