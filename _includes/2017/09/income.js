var margin = {top: 10, right: 50, bottom: 30, left: 50},
    width = 740 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scaleOrdinal()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var line = d3.line()
    .x(function(d) { console.log(d); return x(d.year); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("#slope")
  .append("svg")
    .attr("class", "gender_income")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var type = function(d) {
  d["Median 2005 Total Income"] = +d["Median 2005 Total Income"];
  d["Median 2016 Total Income"] = +d["Median 2016 Total Income"];
  d.totalIncome = [
    {year: 2005, value: d["Median 2005 Total Income"]}, 
    {year: 2016, value: d["Median 2016 Total Income"]}
  ];

  return d;
}

d3.csv("{{ site.baseurl }}/data/2017/09/gender_income.csv", type, function(error, data) {

  x.domain([2005, 2016]);

  y.domain([d3.min(data, function(d) { return d["Median 2005 Total Income"]; }),
            d3.max(data, function(d) { return d["Median 2016 Total Income"]; })]);

  svg.append("g")
      .attr("class", "axis-y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("2005");

  svg.append("g")
      .attr("class", "axis-y")
      .attr("transform", "translate(" + width + ", 0)")
      .call(d3.axisRight(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -12)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("2016");

      console.log(data);


    var slope = svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d) {
          if (d.Gender === "Male") {
            return "steelblue";
          } 
          if (d.Gender === "Female") {
            return "red";
          }
        })
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("blah", function(d) {
          return d["Median 2016 Total Income"];
        })
        .attr("d", function(d) {
          console.log(d);
          return line(d.totalIncome);
        });
});
