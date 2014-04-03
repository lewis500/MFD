//===============PARAMETERS===================
var margin = {
  top: 0,
  right: 20,
  bottom: 0,
  left: 20
},
  width = 600 - margin.left - margin.right,
  height = 725 - margin.top - margin.bottom,
  radius = (width - 150) / 2,
  center = {
    x: width / 2,
    y: height / 2
  }


  var colorKey = {
  	green: "#1abc9c",
  	red: "#e74c3c",
  	blue: "#3498db",
  	yellow: "#f1c40f"
  }

  //=============DRAWING HELPERS===============

var format = d3.round(2);

var toRads = 2 * Math.PI;

var offset = 20;

var roadMaker = d3.svg.arc()
  .innerRadius(radius - 30)
  .outerRadius(radius + 30)
  .startAngle(0)
  .endAngle(2 * Math.PI);

//=============DRAW SVG AND ROAD===============

var sticker = d3.sticker("#car");

var svg = d3.select("#main")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var road = svg.append("g")
  .attr("class", "road")
  .attr("transform", "translate(" + center.x + "," + center.y + ")");




//DONUT CHART PART
var arc = d3.svg.arc()
  .outerRadius(radius + 30)
  .innerRadius(radius - 30)
  .startAngle(function(d) {
    return (d.number - 0.5) / 60 * 2 * Math.PI;
  })
  .endAngle(function(d) {
    return (d.number + 1 - 0.5) / 60 * 2 * Math.PI;
  });

var shade = d3.scale.ordinal()
  .domain(d3.range(0, 3))
  .range(['rgb(239,243,255)', 'rgb(189,215,231)', 'rgb(107,174,214)', 'pink']);

var rampNumbers = [];

var rampNumbers = [56, 4, 11, 19, 26, 34, 42, 49]

// d3.range(0, 4).forEach(function(n) {
//   rampNumbers.push({
//     num: n,
//     place: (n * 15 - 2)
//   });
//   rampNumbers.push({
//     num: n,
//     place: n * 15 + 2
//   });
// });

var carColors = d3.scale.ordinal()
  .domain(d3.range(0, 4))
  .range(d3.values(colorKey));

var rampG = road.selectAll("ramps")
  .data(rampNumbers.map(function(d, i) {
    return {
      num: Math.floor(i / 2),
      place: d,
      on: (i%2 == 0 ) ? true : false
    }
  }))
  .enter()
  .append("g")
  .attr("class", "g-ramp")
  .attr("transform", function(d) {
    var m = d.place / 60 * 360;
    return "rotate(" + m + ") translate(" + [0, -radius] + ")"
  })
  .attr("class", function(d){ return d.on ? "on" : "off"; })

rampG.append("g")
	.attr("transform",function(d,i){
		return "rotate(" + (d.on ? -30 : 30 ) + ")"
	})
	.append("rect")
  .attr({
    width: 25,
    height: 45,
    fill: function(d) {
      return carColors(d.num);
    },
    y: 30,
    x: -12.5
  });

var roadPath = road.append('path')
  .attr({
    d: roadMaker,
    fill: "#111",
  });

//=============DRAW THE CARS===============

var gCar = road.append("g")
  .attr('class', 'g-cars')
// .attr("transform", "translate(" + center.x + "," + center.y + ")");