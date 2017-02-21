var muniSelect = "Percent";

var percentFormat = d3.format(".0%");

// Map variables

var margin = {top: 30, right: 10, bottom: 10, left: 50},
    width = 740,
    height = 300;

var projection = d3.geoMercator()
    .scale(22000)
    .translate([370, 128])
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

var barMargin = {top: 20, right: 20, bottom: 40, left: 170},
    barWidth = 740 - barMargin.left - barMargin.right,
    barHeight = 450 - barMargin.top - barMargin.bottom;

var x = d3.scaleLinear()
          .range([0, barWidth]);
var y = d3.scaleBand()
          .range([0, barHeight])
          .padding(0.1);

var stack = d3.stack()
    .keys(["Non-Homeless YTD", "Homeless YTD"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

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

        var viewBarInfo = function(d) {
            d3.select("#infoBox")
                .style("left", function(temp) {
                    var shift = (d3.event.pageX + 5) + "px";
                    if (d3.event.pageX > 500) {
                      shift = (d3.event.pageX - 330) + "px";
                    }
                    return shift;
                })
                .style("top", (d3.event.pageY - 12) + "px");

            d3.select("#label").text(d.data.Hospital);
            d3.select("#community").text(d.data.Community);
            d3.select("#hlsVal").text(d.data["Homeless YTD"]);
            d3.select("#hlsPer").text(function(e) {
                return percentFormat(d.data["Homeless YTD"] / d.data["Overall YTD"]);
            });
            d3.select("#ovVal").text(d.data["Overall YTD"]);

            d3.select("#infoBox").classed("hidden", false);
        };

        var setXDomain = function() {
            x.domain([
              0, 
              d3.max(data, function(d) { return d["Overall YTD"]; })
            ]);
        };

        var makeLegend = function() {
            var legData = [
                {
                    pie: [
                        {
                            total: 50,
                            value: 1
                        },
                        {
                            total: 50,
                            value: 1
                        }
                    ]
                },
                {
                    pie: [
                        {
                            total: 500,
                            value: 1
                        },
                        {
                            total: 500,
                            value: 1
                        }
                    ]
                },
                {
                    pie: [
                        {
                            total: 1000,
                            value: 1
                        },
                        {
                            total: 1000,
                            value: 1
                        }
                    ]
                }
            ];

            mapSvg.append("rect")
                .attr("x", 2)
                .attr("y", 2)
                .attr("width", 105)
                .attr("height", 105)
                .attr("class", "legendBox");

            var leg = mapSvg.selectAll(".legend")
                .data(legData)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(45," + (15 + i * (Math.sqrt(d.pie[0].total) / pieScale + 9)) + ")"; });

            var legPies = leg.selectAll(".legPie")
                .data(function(d) { return pie(d.pie); })
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("class", "legPie")
                .style("fill", function(d, i) { return color(i); });

            leg.append("text")
                .attr("x", 25)
                .attr("dy", ".35em")
                .attr("class", "legendText")
                .style("text-anchor", "start")
                .text(function(d) {
                    return d.pie[0].total;
                });

            mapSvg.append("text")
                .attr("x", 42)
                .attr("y", 100)
                .attr("class", "legendText")
                .style("text-anchor", "end")
                .text("Homeless");

            mapSvg.append("text")
                .attr("x", 48)
                .attr("y", 100)
                .attr("class", "legendText")
                .style("text-anchor", "start")
                .text("Non-homeless");
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

        // console.log(data);

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

        makeLegend();
        
        
        // Bar chart
        setXDomain();
        
        y.domain(data.map(function(d) { return d.Hospital; }));

        var barStack = stack(data);
        // console.log(barStack);

        var bars = barSvg.selectAll("g")
            .data(barStack)
            .enter().append("g")
            .attr("class", "bar")
            .attr("fill", function(d) { return color(d.key); })
            
        var stacks = bars.selectAll("rect")
            .data(function(d) { console.log(d); return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d.data.Hospital); })
            .attr("height", y.bandwidth())
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .on("mouseover", viewBarInfo)
            .on("mouseout", function(d) { 
                d3.select("#infoBox").classed("hidden", true)
            })
            .on("click", viewBarInfo);

        var xAxis = barSvg.append("g")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("class", "bottomLabel")
            .attr("transform", "translate(280, 35)")
            .text("Overdoses");;

        barSvg.append("g")
            .call(d3.axisLeft(y));


        d3.select("#infoBox")
            .on("click", function(d) {
                d3.select("#infoBox").classed("hidden", true);
            });

  });