var tEmpty = 5;
var numPatches = 100;
var numCars = 0;
var patches = d3.range(numPatches).map(function(d) {
    return patcher(d);
});
var cars = [];
var stops = [];
var tripLength = 60;

patches.forEach(function(d) {
    if (d.loc % 25 == 0) {
        var newStop = stopper(d);
        d.stop = newStop;
        stops.push(newStop);
    }
});

var avgKeeper = avger();

var carColors = d3.scale.ordinal()
    .domain(d3.range(0, 3))
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope',
    function(s) {

        s.tickPace = 50;
        s.addPace = 1000;
        s.paused = true;
        var preVal = s.tickPace;

        s.tripLength = 60;

        s.$watch('tripLength', function(newVal) {
            tripLength = s.tripLength;
        });

        var timer = runnerGen(function() {
            tick();
            s.cars = cars;
            s.stops = stops;
            s.$broadcast('tickEvent');
        }, s.tickPace);

        var adder = runnerGen(function() {
            add();
            s.cars = cars;
            s.$apply();
        }, s.addPace);

        s.$watch('paused', switchIt);
        
        s.$watch('tickPace', function(newVal) {
            timer.setPace(newVal);

            //now for addder
            var p = adder.getPace();
            var n = p * newVal / preVal;
            s.addPace = n;
            // adder.setPace(n);
            preVal = newVal;
        });

        s.$watch('addPace', function(newVal) {
            adder.setPace(newVal);
        });

        s.pausedText = "Play";

        function switchIt() {
            adder.pause();
            timer.pause();
        };

    } //end of link function
]); //end of

function add() {

    stops.forEach(function(d) {
        d.choose();
    });

}
