var carColors = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', 'dataService',
    function(s, DS) {
        s.tickPace = 20;
        s.tickFreq = 105 - 20;
        s.addFreq = 9.75;
        s.paused = true;
        s.tripLength = 50;
        DS.setTripLength(s.tripLength);
        s.cars = DS.getCars();
        s.stops = DS.getStops();

        s.reset = function reset() {
            s.elapsed = 0;
            DS.setTripLength(s.tripLength);
            DS.reset();
            eRate = rateFinder();
            tickFunction();
        };
        s.elapsed = 0;

        s.highlighted = null;

        s.highlighter = function(i) {
            s.highlighted = i;
            s.$broadcast('highlightEvent');
            s.$apply();
        }

        var preVal = s.tickPace;

        s.$watch('tripLength', function(newVal) {
            DS.setTripLength(newVal);
        });

        var adder = stepperGen(DS.add, 1 / s.addFreq * 100);

        s.timer = runnerGen(tickFunction, s.tickPace);

        var eRate = rateFinder();

        s.$watch('tickFreq', function(newVal) {
            s.tickPace = 105 - newVal;
            s.timer.setPace(s.tickPace);
            s.transitionPace = d3.max([10, s.tickPace]);
            // s.$apply();
        });

        s.$watch('addFreq', function(newVal) {
            adder.setPace(1 / newVal * 100);
        });

        var DB = _.throttle(function() {
            s.$broadcast('tickEvent');
        }, 18);

        function tickFunction() {
            DS.tick();
            adder.step();
            s.cars = DS.getCars();
            s.numCars = s.cars.length;
            s.stops = DS.getStops();
            s.rate = eRate.increment(s.stops);
            s.elapsed++;
            // s.$broadcast('tickEvent');
            DB();
            // s.safeApply();
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
