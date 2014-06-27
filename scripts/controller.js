var carColors = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', 'dataService', '$rootScope',
    function(s, DS, $rs) {
        s.paused = true;
        s.tripLength = 50;
        s.elapsed = 0;

        s.timer = new Runner(tickFunction, 20);
        s.timer.velocity = 1 / 20 * 1000;
        s.$watch('timer.velocity', function(newVal) {
            s.timer.pace = 1 / newVal * 1000;
        });

        s.adder = new Stepper(DS.add, 1 / 9.75 * 100);
        s.adder.velocity = 9.75;
        s.$watch('adder.velocity', function(newVal) {
            s.adder.pace = 1 / newVal * 100;
        });

        s.reset = function() {
            s.elapsed = 0;
            DS.setTripLength(s.tripLength);
            DS.reset();
            tickFunction();
        };

        s.highlighted = null;
        s.highlighter = function(i) {
            s.highlighted = i;
            $rs.$emit('highlightEvent');
            s.$apply();
        }

        s.$watch('tripLength', DS.setTripLength);


        var DB = _.throttle(function() {
            $rs.$emit('tickEvent');
        }, 30);

        function tickFunction() {
            DS.tick();
            s.adder.step();
            s.elapsed++;
            DB();
        }

    } //end of link function
]); //end of
