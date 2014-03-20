//===============PARAMETERS===================
var margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = 600 - margin.left - margin.right,
    height = 725 - margin.top - margin.bottom,
    radius = (width-150)/2,
    center = {x: width/2, y: height/2}

//=============DRAWING HELPERS===============

	var format = d3.round(2);

  var toRads = 2*Math.PI;

  var offset = 20;    

  var roadMaker = d3.svg.arc()
  	.innerRadius(radius-30)
  	.outerRadius(radius+30)
  	.startAngle(0)
  	.endAngle(2*Math.PI);

//=============DRAW SVG AND ROAD===============

	var sticker = d3.sticker("#car");

	var svg = d3.select("#main")
		.append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var road = svg.append("g")
			.attr("class","road");

	road.append('path')
			.attr({
				d: roadMaker,
				fill: "#111",
				transform: "translate(" + center.x + "," + center.y + ")"
			});

//=============DRAW THE CARS===============

  var gCar = road.append("g")
      .attr('class', 'g-cars')
      .attr("transform","translate(" + center.x + "," + center.y + ")" );

