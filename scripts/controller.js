var carColors = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', 'dataService',
    function(s, DS) {
        s.tickPace = 50;
        s.addPace = 20;
        s.paused = true;
        s.tripLength = 60;
        s.cars = DS.getCars();
        s.stops = DS.getStops();
        s.reset = function reset() {
            DS.reset();
            tickFunction();
        }

        var preVal = s.tickPace;

        s.$watch('tripLength', function(newVal) {
            DS.setTripLength(newVal);
        });

        var adder = stepperGen(DS.add, s.addPace);

        var timer = runnerGen(tickFunction, s.tickPace);

        s.$watch('paused', timer.pause);

        s.$watch('tickPace', function(newVal) {
            timer.setPace(newVal);
        });

        s.$watch('addPace', function(newVal) {
            adder.setPace(newVal);
        });

        function tickFunction() {
            adder.step();
            DS.tick();
            s.cars = DS.getCars();
            s.stops = DS.getStops();
            s.avg = DS.getAvgKeeper().getAvg();
            s.$broadcast('tickEvent');
        }

    } //end of link function
]); //end of
