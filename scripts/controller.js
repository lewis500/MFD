var carColors = d3.scale.ordinal()
    .domain([0,1,2,3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', 'dataService',
    function(s, DS) {
        s.tickPace = 50;
        s.addPace = 1000;
        s.paused = true;
        s.tripLength = 60;
        s.cars = DS.getCars();
        s.stops = DS.getStops();
        s.reset = DS.reset;

        var preVal = s.tickPace;

        s.$watch('tripLength', function(newVal) {
            DS.setTripLength(newVal);
        });

        var timer = runnerGen(function() {
            DS.tick();
            s.cars = DS.getCars();
            s.stops = DS.getStops();
            s.avg = DS.getAvgKeeper().getAvg();
            s.$broadcast('tickEvent');
        }, s.tickPace);

        var adder = runnerGen(function() {
            DS.add();
            s.cars = DS.getCars();
            s.$apply();
        }, s.addPace);

        s.$watch('paused', switchIt);

        s.$watch('tickPace', function(newVal) {
            timer.setPace(newVal);
            //now for addder
            // var p = adder.getPace();
            // var n = p * newVal / preVal;
            // s.addPace = n;
            // // adder.setPace(n);
            // preVal = newVal;
        });

        s.$watch('addPace', function(newVal) {
            adder.setPace(newVal);
        });

        s.pausedText = "Play";

        function switchIt(newVal) {
            adder.pause(newVal);
            timer.pause(newVal);
        };

    } //end of link function
]); //end of
