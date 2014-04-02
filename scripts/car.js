//wait time
var W = 4,
  numPos = 60,
  TL = numPos * .5,
  nums = d3.range(numPos)

  var Colors = {
    RED: "#e74c3c",
    BLUE: "#3498db",
    MAGENTA: "#9b59b6",
    GREEN: "#2ecc71",
    ORANGE: "#f39c12"
};

var state = nums.map(function(d) {
  return {
    empty: true,
    newEmpty: true,
    howLong: W + 1,
    number: d
  };
});

var arcG = road.selectAll(".arc")
  .data(state)
  .enter().append("g")
  .attr("class", "arc");

var arcPath = arcG.append("path")
  .attr("d", arc)
  .style("fill", function(d) {
    return shade(d3.min([d.howLong,3]));
  })
  .style("opacity",0.4)
  .attr("class","statusArc");

var carsArray = [];

function Car(index) {

  this.index = index;

  var c = this;

  var initRamp = parseInt(Math.random() * (4));

  var initPos = initRamp * numPos / 4 + 2;

  c.initPos = initPos;

  var s = initPos;

  function findExit(){
  	var prospect = parseInt(Math.random() * (4));
  	return (prospect == initRamp) ? findExit() : prospect;
  }

  c.exitRamp = findExit();

  c.exitPos = rampNumbers[c.exitRamp * 2]

  c.stopped = false;

  c.s = s;

  c.choose = function() {

  	if((c.exitPos) == s) {

  		var me = carsArray.indexOf(c);
  		carsArray.splice(me,1);
  		return;
  	}

    var next = state[(s + 1) % numPos];

    if (next.empty && (next.howLong >= W)) {
      s = (s + 1) % numPos;
      state[s].newEmpty = false;
      c.stopped = false;
    } else {
      state[s].newEmpty = false;
      c.stopped = true;
    }

    c.s = s;

  };

}

//=============GET IT GOING===============

// setInterval(redraw, dur);
var paused = false;
var last = 0;
var dur = 50;
var tPerm = 0.5;
var timeSince = 0;
var rate = 2000;
var timeSince2 = 0;
var rate2 = 150
var color = d3.scale.category20c().domain(d3.range(20));
var i = 0;



function add() {
  if (carsArray.length < 20) {
    var h = new Car(i++);
    if (state[h.s].empty) {
      timeSince = 0;
      carsArray.push(h);
      state[h.s].newEmpty = false;
      state[h.s].empty = false;
    }
  }
}

var redraw = function() {

  if (carsArray.length == 0) return;

  carsArray.forEach(function(car,i){
    car.choose();
  });

  state.forEach(function(spot) {
    if (spot.newEmpty) {
      spot.empty = true;
      spot.howLong++;
    } else {
      spot.howLong = 0;
      spot.empty = false;
    }
    spot.newEmpty = true;
  });


  //JOIN
  var car = gCar.selectAll('.car')
    .data(carsArray, function(d){ return d.index; });

  //UPDATE
  car.transition().duration(rate2).ease('linear').attr({
    transform: function(d) {
      return "rotate(" + d.s / numPos * 360 + ")";
    }
  });

  //ENTER
  var newOne = car.enter()
    .append('g')
    .attr("class", "car")
    .attr({
      transform: function(d) {
        return "rotate(" + d.s / numPos * 360 + ")";
      }
    })
    .append("g")
    .append("rect")
    .attr({
    	y: (-radius +5),
    	width: 8,
    	height: 8,
  	  fill: function(d) {
  	    return carColors(d.exitRamp);
  	  }
    });

    //UPDATE ARCS

    arcG.data(state);

    arcPath.transition().duration(rate2).ease('linear').style("fill", function(d) {
  	    return shade(d3.min([d.howLong,3]));
  	  });

    // .call(sticker)
    // .attr({
    //   class: "g-sticker",
    //   transform: "translate(0," + (-radius + 5) + ") scale(.5) rotate(180)",
    //   fill: function(d) {
    //     return color(d.index % 2 == 0 ? d.index : d.index + 10);
    //   }
    // });
  car.exit().remove();

};

var runInterval = setInterval(redraw, rate2);

var addInterval = setInterval(add, 2000);

function pause() {
  clearInterval(runInterval);
  clearInterval(addInterval);
}
