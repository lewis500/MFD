
//wait time
var W = 5,
	numPos = 100,
	TL = 50,
	nums = d3.range(numPos),
	carNum = 200;

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

	var initPos = initRamp * 25 + 2;
	var maxTripLength = 3.0;
	var destProb = 1.0 - (maxTripLength - TL/25);

	c.initPos = initPos;

	var s = initPos;


	c.destination = Math.random() >= destProb ? 
		(s + 48) % numPos  : (s + 73) % numPos ;

	switch (c.destination) {
		case 0: color = Colors.RED;
				break;
		case 25: color = Colors.BLUE;
				break;
		case 50: color = Colors.MAGENTA;
				break;
		case 75: color = Colors.GREEN;
				break;
		default: color = Colors.ORANGE;
	};

	c.color = color;

	c.s = s;

	c.choose = function(){

		var next = state[(s + 1)%numPos];

		if(next.empty && (next.howLong >= W)) {
			s=(s+1)%numPos;
			next.newEmpty = false;
		}else{
			state[s].newEmpty = false;
		}

		// s=(s+1)%numPos;

		c.s=s;

	}

	// return c;

}

//=============GET IT GOING===============

// setInterval(redraw, dur);
var paused = false;
var last = 0;
var numLoop = 0;
var dur = 50;
var tPerm = 0.5;
var timeSince = 0;
var rate = 20;
var timeSince2 = 0;
var cars
// var rate2 = 5

var i = 0

var numLoop2


setInterval(function(){
	// numLoop++;

	timeSince++;

	if(timeSince>rate){
		timeSince = 0;
		carsArray.push(new Car(i++));
	}

	// timeSince2++;

	// if(timeSince2>rate2){
		// timeSince2 = 0;
		redraw();
	// }


},50);

var run = function(){

	d3.timer(function(elapsed){
		t = (elapsed - last);

		timeSince+=t;

		timeSince2+=t;

		if(timeSince>rate){
			timeSince = 0;
			carsArray.push(new Car(i++));
		}

		last = elapsed;


		if(timeSince2>rate2){
			timeSince2 = 0;
			redraw();
		}

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
	car = gCar.selectAll('.car')
	    .data(carsArray)

    car.attr({
			transform: function(d){
			  return "rotate(" + d.s / numPos * 360 + ")";
			}
		});

    car.enter()
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
					transform: "translate(0," + (-radius + 5 ) +") scale(.4, 0.4) rotate(180)",
					fill: "white"
				})


};
