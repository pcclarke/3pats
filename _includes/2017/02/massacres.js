// Map variables

var mapWidth = 740,
    mapHeight = 400;

var projection = d3.geoAlbers()
    .scale(920)
    .translate([310, 450]);

var path = d3.geoPath()
    .projection(projection);

var mapSvg = d3.select("#map").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + mapWidth + " " + mapHeight)
      .classed("svg-content", true);

// Bar chart variables

var barMargin = {top: 20, right: 20, bottom: 40, left: 200},
    barWidth = 740 - barMargin.left - barMargin.right,
    barHeight = 550 - barMargin.top - barMargin.bottom;

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
    d.Longitude = +d.Longitude;
    d.Latitude = +d.Latitude;
    d.Deaths = +d.Deaths;

    return d;
}


d3.queue()
    .defer(d3.json, "{{ site.baseurl }}/data/2017/02/can_prov.json")
    .defer(d3.csv, "{{ site.baseurl }}/data/2017/02/massacres.csv", type)
    .await(function ready(error, prov, data) {

        console.log(prov);
        console.log(data);

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

            d3.select("#label").text(d.Name);
            d3.select("#date").text(d.Date);
            d3.select("#location").text(d.Location);
            d3.select("#deaths").text(d.Deaths);

            d3.select("#infoBox").classed("hidden", false);
        }

        var setXDomain = function() {
            x.domain([0, d3.max(data, function(d) { return d.Deaths; })]);
        };

        // Map

        var province = mapSvg.selectAll(".province")
                .data(topojson.feature(prov, prov.objects.can_prov).features)
                .enter().append("path")
                .attr("class", "province")
                .attr("d", path);

        data.sort(function(a, b) { return b.Deaths - a.Deaths; });

        var circles = mapSvg.selectAll(".circle")
            .data(data)
            .enter()
            .append("circle")
            .filter(function (d) { return d.Name !== "Air India Bombing"; })
            .attr("class", "circle")
            .attr("cx", function(d) {
                console.log(d);
                return projection([d.Longitude, d.Latitude])[0];
            })
            .attr("cy", function(d) {
                return projection([d.Longitude, d.Latitude])[1];
            })
            .on("mouseover", viewMapInfo)
            .on("mouseout", function(d) {
                d3.select("#infoBox").classed("hidden", true);
            });

        circles.transition()
            .ease(d3.easeLinear)
            .duration(400)
            .attr("r", function(d) {
                return Math.sqrt(d.Deaths) * 1.5;
            });

        // Bar chart

        setXDomain();
        y.domain(data.map(function(d) { return d.Name; }));

        var bars = barSvg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(x.domain()[0]); })
              .attr("width", 0)
              .attr("y", function(d) { return y(d.Name); })
              .attr("height", y.bandwidth())
              .on("mouseover", function(d) { viewMapInfo(d); })
              .on("mouseout", function(d) { 
                  d3.select("#infoBox").classed("hidden", true); 
              })
              .on("click", function(d) { viewMapInfo(d); });

        bars.transition()
            .ease(d3.easeLinear)
            .duration(600)
            .attr("width", function(d) { return x(d.Deaths); });

        barSvg.append("g")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("class", "bottomLabel")
            .attr("transform", "translate(280, 35)")
            .text("Deaths");

        barSvg.append("g")
            .call(d3.axisLeft(y));

    });