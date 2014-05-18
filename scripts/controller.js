var W = 5,
    numPos = 100,
    rampNumbers = [0, 25, 50, 75];

var colorKey = {
    green: "#1abc9c",
    red: "#e74c3c",
    blue: "#3498db",
    yellow: "#f1c40f"
};

var carColors = d3.scale.ordinal()
    .domain(d3.range(0, 4))
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', '$timeout',
    function($s, $timeout) {

        var intervalAvg = 500,
            lastCount = 0,
            numCars = 0,
            exitHistory = d3.range(1000).map(function(d){return 0});

        $s.paused = true;
        $s.addRate = 300;
        $s.tickRate = 50;
        $s.exitArray = [0, 0, 0, 0];
        $s.movAvg = 0;
        $s.carsArray = [];
        $s.spots = d3.range(numPos)
            .map(function(d) {
                return {
                    empty: true,
                    newEmpty: true,
                    howLong: W + 1,
                    number: d
                };
            });

        $s.runner = new runner();

        $s.reset = function() {

            exitStats = [];
            lastCount = 0;
            numCars = 0;

            $s.addRate = 300;
            $s.tickRate = 50;
            $s.exitArray = [0, 0, 0, 0];
            $s.movAvg = 0;
            $s.carsArray = [];
            $s.spots = d3.range(numPos)
                .map(function(d) {
                    return {
                        empty: true,
                        newEmpty: true,
                        howLong: W + 1,
                        number: d
                    };
                });

            // $s.$apply();
            // $s.runner.remove();
            $s.runner.updateAdd(null, {
                value: $s.addRate
            });
            $s.runner.updateTick(null, {
                value: $s.tickRate
            });

            $s.paused = false;

        };

        $s.$watch('paused', function() {
            if (!$s.paused) {
                $s.runner.start();
            }
        });

        function add() {
            var spots = $s.spots,
                carsArray = $s.carsArray;

            var h = new Car(numCars++);
            if (spots[h.s].empty && spots[h.s].newEmpty) {
                carsArray.push(h);
                spots[h.s].newEmpty = false;
                spots[h.s].empty = false;
            }

            $s.spots = spots;
            $s.carsArray = carsArray;
            $s.$broadcast('addOrExit');

        } //end of add

        function tick() {
            var spots = $s.spots,
                carsArray = $s.carsArray;

            if (carsArray.length == 0) return;

            //have the cars advance, stop or exit
            carsArray.forEach(function(car, i) {
                var response = car.choose(spots);

                if (response == "exiting") {
                    carsArray.splice(carsArray.indexOf(car), 1);
                    $s.exitArray[car.exitRamp] = $s.exitArray[car.exitRamp] + 1;
                    spots[car.s].newEmpty = true;
                    $s.$broadcast('addOrExit');
                } else {
                    spots[car.s].newEmpty = false;
                }
            }); //end foreach

            //clean out the spots
            spots.forEach(function(spot) {
                if (spot.newEmpty) {
                    spot.empty = true;
                    spot.howLong++;
                } else {
                    spot.howLong = 0;
                    spot.empty = false;
                }
                spot.newEmpty = true;
            }); //end foreach


            $s.spots = spots;

            $s.carsArray = carsArray;

            $s.$broadcast("update");

        } // end of tick


        function avg() {

            //count what happened for summary statistics
            var newCount = $s.exitArray
                .reduce(function(a, b) {
                    return a + b;
                });

            exitHistory.push(newCount);

            var b = exitHistory.length-1000/intervalAvg;
            var a = exitHistory.length-2*1000/intervalAvg;
            var newMean = d3.mean(exitHistory.slice(b));
            var oldMean = d3.mean(exitHistory.slice(a,b));


            $s.movAvg = (newMean - oldMean);



            $s.$broadcast('avgUpdate');

        }

        function runner() {

            var t = 0,
                timeSinceAdd = 0,
                timeSinceTick = 0,
                timeSinceAvg = 0,
                intervalAdd = $s.addRate,
                intervalTick = $s.tickRate,
                last = 0;

            this.updateAdd = function(ev, ui) {
                intervalAdd = ui.value;
            }

            this.updateTick = function(ev, ui) {
                intervalTick = ui.value;
            }

            this.start = function() {

                t = 0;
                timeSinceAdd = 0;
                timeSinceTick = 0;
                last = 0;
                timeSinceAvg = 0;

                d3.timer(function(elapsed) {

                    t = (elapsed - last);

                    //the add Part
                    timeSinceAdd = timeSinceAdd + t;
                    if (timeSinceAdd > intervalAdd) {
                        timeSinceAdd = 0;
                        add();
                    }

                    //the tick part

                    timeSinceTick = timeSinceTick + t;
                    if (timeSinceTick > intervalTick) {
                        timeSinceTick = 0;
                        tick();
                    }

                    timeSinceAvg = timeSinceAvg + t;
                    if (timeSinceAvg > intervalAvg) {
                        timeSinceAvg = 0;
                        avg();
                    }

                    last = elapsed;

                    $s.elapsed = elapsed/1000;

                    return $s.paused;
                });
            }

            return this;

        } //end of runner

        function Car(index) {

            var C = this;
            var initRamp = Math.floor(Math.random() * 4);
            C.index = index;
            C.s = rampNumbers[initRamp];
            C.exitRamp = pickExit();
            C.exitPos = rampNumbers[C.exitRamp];

            function pickExit() {
                var prospect = Math.floor(Math.random() * 4);
                return (prospect == initRamp) ? pickExit() : prospect;
            }

            //the updating function
            C.choose = function(spots) {

                if (C.exitPos == C.s) return "exiting";

                //if it hasn't returned, its's still on the road, so do...
                var nextPos = (C.s + 1) % numPos;
                var nextspots = spots[nextPos];

                if (nextspots.empty && (nextspots.howLong >= W)) {
                    C.s = nextPos;
                    return "advancing";
                } else return "stopping";

            };

        }

    } //end of link function

]); //end of
