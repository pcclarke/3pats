---
layout: post
title:  "One Last Look at the Party Costing Plans"
date:   2015-10-20 12:00:00
---

<div id="costingChart"></div>
<form>
  <label><input type="radio" name="mode" value="2016-17" checked> 2016-17</label>
  <label><input type="radio" name="mode" value="2017-18"> 2017-18</label>
	<label><input type="radio" name="mode" value="2018-19"> 2018-19</label>
	<label><input type="radio" name="mode" value="2019-20"> 2019-20</label>
</form>
<div>
  <select id="selectCosting">
		<option value="Liberal" selected="selected">Liberal</option>
		<option value="Conservative">Conservative</option>
    <option value="NDP">NDP</option>
    <option value="Green">Green</option>
  </select>
</div>
<div id="costingTip">
  <p id="tipTop"><strong><span id="tipBudget"></span></strong></p>
	<p id="tipInfo"><span id="tipVal"></span></p>
</div>

* * *

Just for posterity, let's go over the party costing plans once again. This time, I'll show the full hierarchy in which the parties organized their spending. This is mainly so we can all remember the ridiculous names under which they categorized their spending, such as:

- "Our Conservative Plan for Hard-Working Families and Seniors"
- "Help Where it's Needed Most"
- "Finding Hidden Money"
- "Public health healthy kids campaign"

Guess which party wrote which – except the Conservative one of course.

Sources:

- [Liberal Costing Plan](http://www.liberal.ca/costing-plan/)
- [NDP Balanced Fiscal Plan](http://xfer.ndp.ca/2015/2015-Full-Platform-EN.pdf) (PDF)
- [Conservative Costing Plan](http://www.conservative.ca/media/plan/costing-plan.pdf) (PDF)
- [Green Budget Overview](http://www.greenparty.ca/en/budget)

<style>

#costingChart {
  font-size: 10px;
}

#selectCosting {
  font-family: Lora, Georgia, serif;
  font-size: 20px;
  padding: 5px 15px;
	width: 200px;
}

#costingChart .sel {
	fill: #000000 !important;
}

#costingTip {
	display: block;
	min-height: 50px;
	margin-bottom: 15px;
  pointer-events: none;
	text-align: center;
}

#costingTip #tipTop {
  font-size: 24px;
  margin-bottom: 10px !important;
}

#costingTip .tipInfo {
  font-size: 12px;
  margin: 0;
}

</style>

<script>

costingChart();

function costingChart() {

var width = 740,
    height = 800,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category20c();
		
var numFormat = d3.format(",");

var selYear = "2016-17";

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y / 2); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

drawCosting("liberal");



function drawCosting(kind) {

	var svg = d3.select("#costingChart").append("svg")
		.attr("class", "costingSvg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

	d3.json("{{ site.baseurl }}/data/2015/10/20/" + kind.toLowerCase() + "_costing.json", function(error, root) {
	  if (error) throw error;
	
		console.log(selected);
		var value = function(d) { return d[selYear]; };
		var highlight = -1;

	  var path = svg.datum(root).selectAll("path")
	      .data(partition.value(value).nodes)
	    .enter().append("path")
	      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
	      .attr("d", arc)
	      .style("stroke", "#fff")
	      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
	      .style("fill-rule", "evenodd")
	      .each(stash)
			.on("mouseover", function(d) {
				showTooltip(d, this);
			})
			.on("mousedown", function(d) {
				showTooltip(d, this);
			});
		
		function showTooltip(d, obj) {
			highlight = d;
			d3.selectAll("#costingChart .sel").classed("sel", false);
			d3.select(obj).classed("sel", true);
		  d3.select("#costingTip").select("#tipBudget")
		    .text(d.name);
		  d3.select("#costingTip").select("#tipVal")
		    .text(numFormat(d.value) + " million dollars");
		}

	  d3.selectAll("input").on("change", function change() {
			selYear = this.value;
	    var value = function(d) { return d[selYear]; };

		  path
			    .data(partition.value(value).nodes)
			  .transition()
			    .duration(1500)
			    .attrTween("d", arcTween);
				
			if (highlight !== -1) {
			  d3.select("#costingTip").select("#tipVal")
			    .text(numFormat(highlight[selYear]) + " million dollars");
			}
	  });
	});

	// Stash the old values for transition.
	function stash(d) {
	  d.x0 = d.x;
	  d.dx0 = d.dx;
	}

	// Interpolate the arcs in data space.
	function arcTween(a) {
	  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  return function(t) {
	    var b = i(t);
	    a.x0 = b.x;
	    a.dx0 = b.dx;
	    return arc(b);
	  };
	}

	d3.select(self.frameElement).style("height", height + "px");

	d3.select("#selectCosting")
	  .on("change", selected);

	function selected() {
	  d3.selectAll(".costingSvg")
	    .remove();
	  d3.select("#costingTip").select("#tipBudget")
	    .text("");
	  d3.select("#costingTip").select("#tipVal")
	    .text("");
	  drawCosting(this.options[this.selectedIndex].value);
	}

}

}

</script>
