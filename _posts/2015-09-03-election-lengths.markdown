---
layout: post
title:  "Length of Canadian Election Campaigns"
date:   2015-09-03 13:12:00
---

There has been much discussion about how long this election campaign is. How does it compare to past campaign lengths?

<style>

.g-table {
  margin: 6px 10px 20px 10px;
  font: 11px/15px sans-serif;
  -webkit-text-size-adjust: none;
}

.g-table-head {
  font: 13px/17px sans-serif;
}

.g-table-head .g-table-cell {
  height: 25px;
  cursor: pointer;
}

.g-table-row:after {
  display: block;
  content: "";
  clear: left;
}

.g-table-body {
  margin-top: 6px;
  position: relative;
}

.g-table-head,
.g-table-body {
  padding-bottom: 6px;
  border-bottom: solid 1px #ccc;
}

.g-table-body .g-table-row {
  position: absolute;
  width: 100%;
}

.g-table-cell {
  float: left;
  position: relative;
  overflow: hidden;
}

.g-table-bar,
.g-table-label {
  -webkit-transition: width .5s ease;
  -moz-transition: width .5s ease;
  -ms-transition: width .5s ease;
  -o-transition: width .5s ease;
  transition: width .5s ease;
}

.g-table-body .g-table-cell {
  height: 19px;
  line-height: 19px;
}

.g-table-body .g-table-row {
  -webkit-transition: top .5s ease;
  -moz-transition: top .5s ease;
  -ms-transition: top .5s ease;
  -o-transition: top .5s ease;
  transition: top .5s ease;
}

.g-table-bar {
  position: absolute;
  height: 100%;
  background: rgba(120,120,120,.5);
}

.g-table-label {
  position: absolute;
  right: 6px;
}

.g-table-cell-addDissolutionDays .g-table-label,
.g-table-cell-addWritDays .g-table-label {
  right: -4px;
  width: 0;
  color: #999;
}

.g-table-body .g-table-row:hover .g-table-bar {
  height: 18px;
  border-bottom: solid 1px rgba(0,0,0,.4);
}

.g-table-body .g-table-row:hover,
.g-table-body .g-table-row:hover .g-table-cell-election,
.g-table-body .g-table-row:hover .g-table-label,
.g-table-body-average,
.g-table-body-average .g-table-label {
  font-weight: bold;
  color: #000;
}

.g-table-body:not(:last-of-type) {
  border-bottom: dashed 1px #ccc;
}

.g-table-column-ascending:after,
.g-table-column-descending:after {
  padding-left: 4px;
}

.g-table-column-ascending:after {
  content: "\0025B2";
}

.g-table-column-descending:after {
  content: "\0025BC";
}

.g-table-cell {
  width: 300px;
}

.g-table-cell-election {
  font-size: 12px;
  width: 50px;
  text-align: center;
}

.g-table-cell-dissolutionDays {
  width: 300px;
  margin-left: 30px;
}

.g-table-cell-writDays {
	margin-left: 10px;
}

.g-table-cell-writDays .g-table-bar,
.g-table-cell-dissolutionDays .g-table-bar {
  background: rgba(185,185,185,.5);
}

.g-instruction {
  margin: 34px 10px 0 0;
  font: oblique 11px sans-serif;
  color: #aaa;
  text-align: right;
}

</style>

<script src="http://d3js.org/d3.v3.min.js"></script>
<!--<script src="{{ site.baseurl }}/d3.min.js"></script>-->
<script>

(function() {

var rowHeight = 20;

var columns = [
  "dissolutionDays",
  "writDays"
];

var sortKey = "electionNum", // default column selected to be sorted
sortOrder = d3.descending; // default sorting order

var formatCurrency = d3.format("$,.0f"),
    formatNumber = d3.format(",.0f");

var x = d3.scale.linear()
    .domain([0, 100])
    .range([0, 300]);

d3.csv("{{ site.baseurl }}/data/election_lengths.csv", type, function(error, elections) {

  // Create the election rows
  var electionRow = d3.select(".g-table-body-elections")
      .style("height", elections.length * rowHeight + "px")
    .selectAll(".g-table-row")
      .data(elections.sort(function(a, b) { return sortOrder(a[sortKey], b[sortKey]); })) // Sort by the currently selected column
    .enter().append("div")
      .attr("class", "g-table-row")
      .style("top", function(d, i) { return i * rowHeight + "px"; });

	// Create the rows
  var row = d3.selectAll(".g-table-body .g-table-row");

	// Append campaign number column
  row.append("div")
      .attr("class", "g-table-cell g-table-cell-election")
      .text(function(d) { return d.electionNum; });

  // Append data cells
  columns.forEach(function(c) {
    row.append("div")
        .attr("class", "g-table-cell g-table-cell-" + c)
      .append("div")
        .datum(function(d) { return d[c]; })
        .attr("class", "g-table-bar")
      .append("div")
        .attr("class", "g-table-label")
        .text(function(d, i) { 
			if (d == 0) {
				return "n/a";
			}
			return d; 
		});
  });

	// Initial width of bars on page load
  var bar = row.selectAll(".g-table-bar")
	  .style("width", 0);

  // Animate bars width from initial position to data length
  row.transition()
      .delay(function(d, i) { return i * 8; })
    .selectAll(".g-table-bar")
      .each("start", function(d) { this.style.width = x(d) + "px"; });

  // The arrow that controls sorting
  var columnLabel = d3.selectAll(".g-table-head .g-table-cell")
      .datum(function() { return this.getAttribute("data-key"); })
      .on("click", clicked)
    .select(".g-table-column")
      .classed("g-table-column-" + (sortOrder === d3.ascending ? "ascending" : "descending"), function(d) { return d === sortKey; });

  function clicked(key) {
	  // Prevents selection of text, presumably so arrow acts like a button when clicked on
    d3.event.preventDefault();

	// Flips the class on the arrow so it points in the correct direction
    columnLabel
		.classed("g-table-column-" + (sortOrder === d3.ascending ? "ascending" : "descending"), false);

	// If clicking on selected column, flip between ascending and descending, otherwise set key to selected column
    if (sortKey === key) {sortOrder = sortOrder === d3.ascending ? d3.descending : d3.ascending; 
		console.log(key);
	}
    else sortKey = key;

    elections
        .sort(function(a, b) { return sortOrder(a[sortKey], b[sortKey]); })
        .forEach(function(d, i) { d.index = i; });

    columnLabel
	        .classed("g-table-column-" + (sortOrder === d3.ascending ? "ascending" : "descending"), function(d) { return d === sortKey; });

	    electionRow.transition()
	        .delay(function(d) { return d.index * 8; })
	        .each("start", function(d) { return this.style.top = d.index * rowHeight + "px"; });
	  }
	});

function type(d) {
	d.electionNum = +d.electionNum;
  d.dissolutionDays = +d.dissolutionDays;
  d.addDissolutionDays = +d.addDissolutionDays;
  d.writDays = +d.writDays;
  d.addWritDays = +d.addWritDays;
  return d;
}

})()

</script>

<div class="g-graphic">
	<div class="g-instruction">Click a column header to sort.</div>
	<div class="g-table">
		<div class="g-table-head">
			<div class="g-table-row">
				<div data-key="electionNum" class="g-table-cell" style="width:80px;">
					<div class="g-table-column" style="position:absolute;bottom:0;">Election</div>
				</div>
				<div data-key="dissolutionDays" class="g-table-cell" style="width:300px;border-top:solid 1px #000;margin-right:10px;">
					<div class="g-table-column" style="font-size:13px;line-height:32px;">Days from dissolution to election</div>
				</div>
				<div data-key="writDays" class="g-table-cell" style="width:300px;border-top:solid 1px #000;">
					<div class="g-table-column" style="font-size:13px;line-height:32px;">Days from writ to election</div>
				</div>
			</div>
		</div>
		<div class="g-table-body g-table-body-elections"></div>
	</div>
</div>

Source: [Parliament of Canada](http://www.parl.gc.ca/about/parliament/PARLINFO/infography/LengthFederalElection-e.htm)

Retrieved August 27, at 4:00pm PST

[CBC](http://www.cbc.ca/news/politics/canada-election-2015-stephen-harper-confirms-start-of-11-week-federal-campaign-1.3175136)

