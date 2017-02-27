// Map variables

var mapWidth = 1200,
    mapHeight = 1000;

var projection = d3.geoMercator()
    .scale(586000)
    .translate([7200, -845])
    .center([-122.275085, 49.292385]);

var color = d3.scaleOrdinal()
    .range(["#000000", "#ff0000"]);

var path = d3.geoPath()
    .projection(projection);

var mapSvg = d3.select("#map").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
      .classed("svg-content", true);

// Bar chart variables

var barMargin = {top: 20, right: 20, bottom: 40, left: 210},
    barWidth = 740 - barMargin.left - barMargin.right,
    barHeight = 550 - barMargin.top - barMargin.bottom;

var barSvg = d3.select("#chart")
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

var x = d3.scaleLinear()
    .rangeRound([0, barWidth]);

var y = d3.scaleBand()
    .rangeRound([0, barHeight])
    .paddingInner(0.05)
    .align(0.1);

var z = d3.scaleOrdinal()
    .range(["#590CE8", "#C500DB", "#E80C35", "#AAAAAA", "#a05d56", "#d0743c", "#ff8c00"]);


var type = function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    
    return d;
}

d3.queue()
    .defer(d3.json, "{{ site.baseurl }}/data/2017/02/lowermainland.json")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/02/fountains.csv")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/02/neigh.csv", type)
    .await(function ready(error, nw, fountains, neigh) {
        console.log(nw);
        console.log(fountains);
        console.log(neigh)

        var viewMapInfo = function(d) {

            d3.select("#infoBox")
                .style("left", function(temp) {
                    var shift = (d3.event.pageX + 5) + "px";
                    if (d3.event.pageX > 500) {
                      shift = (d3.event.pageX - 330) + "px";
                    }
                    return shift;
                })
                .style("top", function(temp) {
                    var shift = (d3.event.pageY - 12) + "px";
                    if (d.Y < 49.20752788) {
                        shift = (d3.event.pageY - 420) + "px";
                    }
                    return shift;
                });

            d3.select("#area").text(d.Area);
            d3.select("#type").text(d.Type);
            d3.select("#neighbourhood").text(d.Neighbourhood);
            d3.select("#colour").text(d["Colour/Material"]);
            if (d.Style === "-") {
                d3.select("#styleLine").classed("hidden", true);
            } else {
                d3.select("#style").text(d.Style);
                d3.select("#styleLine").classed("hidden", false);
            }
            if (d["Bowl Height"] === "-") {
                d3.select("#bowlLine").classed("hidden", true);
            } else {
                d3.select("#height").text(d["Bowl Height"]);
                d3.select("#bowlLine").classed("hidden", false);
            }
            d3.select("#objid").text(d.OBJECTID);

            d3.select("#infoImg").attr("src", "{{ site.baseurl }}/img/2017/02/" + d.OBJECTID + ".jpg");

            d3.select("#infoBox").classed("hidden", false);
        };


        // Map

        var ndub = mapSvg.selectAll(".ndub")
            .data(topojson.feature(nw, nw.objects.lowermainland).features)
            .enter().append("path")
            .attr("class", function(d) {
                if (d.properties.CSDNAME === "New Westminster") {
                    return "ndub";
                }
                return "city";
            })
            .attr("d", path);

        var fountainCircles = mapSvg.selectAll(".fountain")
            .data(fountains)
            .enter()
            .append("circle")
            .attr("class", "fountain")
            .attr("cx", function(d) {
                return projection([d.X, d.Y])[0];
            })
            .attr("cy", function(d) {
                return projection([d.X, d.Y])[1];
            })
            .attr("r", 3)
            .style("fill", function(d) {
                return z(d.Type);
            })
            .on("mouseover", viewMapInfo)
            .on("mouseout", function(d) {
                d3.select("#infoBox").classed("hidden", true);
            });


        // Bar Chart

        var keys = neigh.columns.slice(1);

        neigh.sort(function(a, b) { return b.total - a.total; });
        x.domain([0, d3.max(neigh, function(d) { return d.total; })]).nice();
        y.domain(neigh.map(function(d) { return d.Neighbourhood; }));
        z.domain(keys);

        barSvg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(neigh))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(0); })
            .attr("y", function(d) { return y(d.data.Neighbourhood); })
            .attr("height", y.bandwidth())
            .attr("width", function(d) { return x(d[1]) - x(d[0]); });

        barSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(d3.axisBottom(x));

        barSvg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        var legend = barSvg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", barWidth - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", barWidth - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

    });