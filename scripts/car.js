
//wait time
var W = 8,
	numPos = 60,
	TL = numPos*.5,
	nums = d3.range(numPos)

var Colors = {
	RED: "#e74c3c",
	BLUE: "#3498db",
	MAGENTA: "#9b59b6",
	GREEN: "#2ecc71",
	ORANGE: "#f39c12"
};

var state = nums.map(function(d){
	return {
		empty: true,
		newEmpty: true,
		howLong: W+1,
		number: d
	};
});

var carsArray = [];

function Car(index){

	this.index = index;

	var c = this;

	var initRamp = parseInt(Math.random()*(4));

	var initPos = initRamp * numPos/4 + 2;

	c.initPos = initPos;

	var s = initPos;

	c.stopped = false;

	c.s = s;

	c.choose = function(){
		var q = false;

		var next = state[(s + 1)%numPos];

		if(next.empty && (next.howLong >= W)) {
			s=(s+1)%numPos;
			next.newEmpty = false;
			c.stopped=false;
		}else{
			state[s].newEmpty = false;
			c.stopped=true;
		}

		c.s=s;

	}

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
var rate2 = 100
var color = d3.scale.category20c().domain(d3.range(20));
var i = 0

var run = function(){

	d3.timer(function(elapsed){
		t = (elapsed - last);

		timeSince+=t;

		timeSince2+=t;

		if(timeSince>rate && carsArray.length < 20){
			var h = new Car(i++);
			if(state[h.s].empty){
				timeSince = 0;
				carsArray.push(h);
				// state[h.s].newEmpty = false;
				state[h.s].empty = false;
			}
		}

		d3.selectAll(".car").filter(function(d){ return !d.stopped; })
			.select("#top").attr("transform", function(d,i){
				var u = i%2==0 ? 1 : -1
				var g = Math.abs( Math.cos((elapsed)/(500) *Math.PI + i/5 * u) )
				return "translate(" + [0,g*-7] + ")";
			});

		d3.selectAll(".car").filter(function(d){ return d.stopped; })
			.select("#top").attr("transform", function(d,i){
				return "translate(" + [0,0] + ")";
			});

		if(timeSince2>rate2){
			timeSince2 = 0;
			redraw();
		}

		last = elapsed;
	  return paused;

	});

};

run();


var redraw = function(){

	if (carsArray.length == 0) return;
	
	carsArray.forEach(function(d){
		d.choose();
	});

	state.forEach(function(d){
		if(d.newEmpty){
			d.empty=true;
			d.howLong++;
		}
		else{
			d.howLong = 0;
			d.empty = false;
		}
		d.newEmpty = true;
	});

	//Data Join
	var car = gCar.selectAll('.car')
	    .data(carsArray)


  //UPDATE
  car.transition().duration(rate2).ease('linear').attr({
		transform: function(d){
		  return "rotate(" + d.s / numPos * 360 + ")";
		}
	});

  //ENTER
  var newOne = car.enter()
    .append('g')
    .attr("class","car")
    .attr({
				transform: function(d){
				  return "rotate(" + d.s / numPos * 360 + ")";
				}
			})
    .append("g")
		.call(sticker)
			.attr({
				class: "g-sticker",
				transform: "translate(0," + (-radius + 5 ) +") scale(.5) rotate(180)",
				fill: function(d){ return color(d.index%2==0 ? d.index: d.index + 10); }
			});

};
