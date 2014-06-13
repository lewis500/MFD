var carColors = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', 'dataService',
    function(s, DS) {
        s.tickPace = 50;
        s.tickFreq = 105 - 50;
        s.addFreq = 2.5;
        s.paused = true;
        s.tripLength = 60;
        s.cars = DS.getCars();
        s.stops = DS.getStops();
        s.reset = function reset() {
            s.elapsed = 0;
            DS.reset();
            eRate = rateFinder();
            tickFunction();
        };
        s.elapsed = 0;

        var preVal = s.tickPace;

        s.$watch('tripLength', function(newVal) {
            DS.setTripLength(newVal);
        });

        var adder = stepperGen(DS.add, 1 / s.addFreq * 100);

        s.timer = runnerGen(tickFunction, s.tickPace);

        var eRate = rateFinder();

        // s.$watch('paused', timer.pause);

        s.$watch('tickFreq', function(newVal) {
            s.tickPace = 105 - newVal;
            s.timer.setPace(s.tickPace);
            // s.$apply();
        });

        s.$watch('addFreq', function(newVal) {
            adder.setPace(1 / newVal * 100);
        });


        function tickFunction() {
            adder.step();
            DS.tick();
            s.cars = DS.getCars();
            s.numCars = s.cars.length;
            s.stops = DS.getStops();
            s.rate = eRate.increment(s.stops);
            s.elapsed++;
            s.$broadcast('tickEvent')
            s.safeApply();
        }

        function rateFinder() {
            var data = [];

            function increment(newStops) {
                var sum = d3.sum(newStops, function(d) {
                    return d.getExited().length;
                });
                data.push(sum);
                return getRate();
            }

            var form = d3.format('.1f');

            function getRate() {
                var a = d3.min([100, data.length]);
                var b = (data[data.length - 1] - data[data.length - a]) / a;
                return form(b * 10);
            }

            return {
                increment: increment
            };
        }

        s.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

    } //end of link function
]); //end of
