//wait time
var W = 4,
  numPos = 60,
  TL = numPos * .5,
  nums = d3.range(numPos)

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

// var arcPath = arcG.append("path")
//   .attr("d", arc)
//   .style("fill", function(d) {
//     return shade(d3.min([d.howLong, 3]));
//   })
//   .style("opacity", 0.4)
//   .attr("class", "statusArc");

var carsArray = [];

function Car(index) {

  this.index = index;

  var c = this;

  var initRamp = parseInt(Math.random() * (3));

  var initPos = rampNumbers[initRamp * 2 + 1];

  c.initPos = initPos;

  var s = initPos;

  function findExit() {
    var prospect = parseInt(Math.random() * (3));
    return (prospect == initRamp) ? findExit() : prospect;
  }

  c.exitRamp = findExit();

  c.exitPos = rampNumbers[c.exitRamp * 2];

  c.stopped = false;

  c.s = s;

  c.choose = function() {

    if ((c.exitPos) == s) {

      var me = carsArray.indexOf(c);
      carsArray.splice(me, 1);
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
var rate1 = 1000;
var rate2 = 75
var color = d3.scale.category20c().domain(d3.range(20));
var i = 0;

function add() {
  if (carsArray.length < 20) {
    var h = new Car(i++);
    if (state[h.initPos].empty && state[h.initPos].newEmpty) {
      carsArray.push(h);
      state[h.s].newEmpty = false;
      state[h.s].empty = false;
    }
  }
}

var redraw = function() {

  if (carsArray.length == 0) return;

  carsArray.forEach(function(car, i) {
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
    .data(carsArray, function(d) {
      return d.index;
    });

  car.exit().remove();


  //UPDATE
  car.transition().ease('linear').attr({
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
  .call(sticker)
  .attr({
    class: "g-sticker",
    transform: "translate(0," + (-radius + 5) + ") scale(.3) rotate(180)",
      fill: function(d) {
        return carColors(d.exitRamp);
      }
  });
    // .append("rect")
    // .attr({
    //   y: (-radius + 5),
    //   width: 8,
    //   height: 8,
    //   fill: function(d) {
    //     return carColors(d.exitRamp);
    //   }
    // });

  // //UPDATE ARCS

  // arcG.data(state);

  // arcPath.transition().duration(rate2).ease('linear').style("fill", function(d) {
  //   return shade(d3.min([d.howLong, 3]));
  // });


};

var paused = false;

function runner(fun, interval){

	var t = 0, last = 0, timeSince = 0;

	d3.timer( function(elapsed){
		t = (elapsed - last);
		timeSince = timeSince + t;
		if(timeSince > interval) {
			timeSince = 0;
			fun();
		}
		last = elapsed;
		return paused;
	});

	this.update = function(newInterval){
		interval = newInterval;
	}

	return this;

}

var a, b;

function run(){
	paused = false;
	a = new runner(redraw, rate2);
	b = new runner(add, rate1);
}

function pause(){
	paused = true;
}

run();

function adjustRate(ev, ui){
	b.update(ui.value);
}

// var runInterval = setInterval(redraw, rate2);

// var addInterval = setInterval(add, 2000);

// function pause() {
//   clearInterval(runInterval);
//   clearInterval(addInterval);
// }
