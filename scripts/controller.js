var W = 7,
    numPos = 100,
    rampNumbers = [94, 4, 21, 29, 46, 54, 71, 79];

var colorKey = {
    green: "#1abc9c",
    red: "#e74c3c",
    blue: "#3498db",
    yellow: "#f1c40f"
};

var carColors = d3.scale.ordinal()
    .domain(d3.range(0, 4))
    .range(d3.values(colorKey));

function Car(index) {

    //initialize

    var ϕ = this;

    ϕ.index = index;ϕ.initRamp = Math.floor(Math.random() * 4);ϕ.initPos = rampNumbers[ϕ.initRamp * 2 + 1];ϕ.s = ϕ.initPos;ϕ.exitRamp = pickExit();ϕ.exitPos = rampNumbers[ϕ.exitRamp * 2];


    function pickExit() {
        var prospect = Math.floor(Math.random() * 4);
        return (prospect == ϕ.initRamp) ? pickExit() : prospect;
    }
    //the updating function

    ϕ.choose = function(state) {

        if (ϕ.exitPos == ϕ.s) return "exiting";

        //if it hasn't returned, its's still on the road, so do...
        var nextPos = (ϕ.s + 1) % numPos;
        var nextState = state[nextPos];

        if (nextState.empty && (nextState.howLong >= W)) {
          ϕ.s = nextPos;
          return "advancing";
        } else return "stopping";

    };
}

app.controller('mainCtrl', ['$scope',
    function(θ) {

        θ.paused = false;
        θ.addRate = 300;
        θ.tickRate = 50;
        var numCars = 0;
        θ.exitArray = [0, 0, 0, 0];
        θ.exitStats = [];

        var lastCount = 0;
        setInterval(function(){
          var newCount = θ.exitArray.reduce(function(a, b ){
           return a + b;
          });
          var exitRate = (newCount - lastCount);

          θ.exitStats.push({density: θ.carsArray.length, exits: exitRate});
          θ.$broadcast('check');
          lastCount = newCount;
        }, 1000);


        θ.carsArray = [];θ.state = d3.range(numPos).map(function(d) {
            return {
                empty: true,
                newEmpty: true,
                howLong: W + 1,
                number: d
            };
        });

        var add = function() {
            var state = θ.state,
                carsArray = θ.carsArray;

                var h = new Car(numCars++);
                if (state[h.initPos].empty && state[h.initPos].newEmpty) {
                    carsArray.push(h);
                    state[h.s].newEmpty = false;
                    state[h.s].empty = false;
                }

            θ.$apply(function() {θ.state = state;θ.carsArray = carsArray;
            });

        }

        var tick = function() {

            var state = θ.state,
                carsArray = θ.carsArray;

            if (carsArray.length == 0) return;

            carsArray.forEach(function(car, i) {
                var response = car.choose(state);

                if (response == "exiting") {
                    carsArray.splice(carsArray.indexOf(car), 1);
                    θ.exitArray[car.exitRamp] = θ.exitArray[car.exitRamp] + 1;
                    state[car.s].newEmpty = true;
                    θ.$broadcast('exit');
                } else {
                    state[car.s].newEmpty = false;
                }
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

            θ.$apply(function() {θ.state = state;θ.carsArray = carsArray;
            });

            θ.$broadcast("update");

        };



        function runner(fun, interval) {

            var t = 0,
                last = 0,
                timeSince = 0;

            d3.timer(function(elapsed) {
                t = (elapsed - last);
                timeSince = timeSince + t;
                if (timeSince > interval) {
                    timeSince = 0;
                    fun();
                }
                last = elapsed;
                return θ.paused;
            });

            this.update = function(ev, ui) {
                interval = ui.value;
            }

            this.restart = function(newInt){
              var t = 0,
                  last = 0,
                  timeSince = 0;
              d3.timer(function(elapsed) {
                  t = (elapsed - last);
                  timeSince = timeSince + t;
                  if (timeSince > newInt) {
                      timeSince = 0;
                      fun();
                  }
                  last = elapsed;
                  return θ.paused;
              });
            }

            return this;

        }

        θ.adder = new runner(add, θ.addRate);
        θ.ticker = new runner(tick, θ.tickRate);

        // θ.run = function(){
        //   θ.paused = false;
        //   θ.adder = new runner(add, θ.addRate);
        //   θ.ticker = new runner(tick, θ.tickRate);
        // };

        // θ.run();

        θ.$watch('paused', function(newVal){
          if(!newVal) {
            θ.adder.restart(θ.addRate);
            θ.ticker.restart(θ.tickRate);
          }
        });

    }

]);
