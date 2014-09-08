var carColors = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

app.controller('mainCtrl', ['$scope', 'dataService', '$rootScope',
    function(s, DS, $rs) {
        s.tripLength = 50;
        s.elapsed = 0;

        s.timer = new Runner(tickFunction, 1 / 20 * 1000, true);
        s.timer.transform = function(v) {
            return v / 1000;
        };

        s.adder = new Stepper(DS.add, 9.75, true);
        s.adder.transform = function(v) {
            return v / 100;
        };

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

var ModalCtrl = function($scope, $modal, $log) {
    var modal = this;
    $scope.which = {
        toTry: false,
        patterns: false,
        application: false,
        further: false,
        controls: false
    };

    var selected = "toTry"

    modal.open = function(whichOne) {
        $scope.which[selected] = false;
        $scope.which[whichOne] = true;
        selected = whichOne;
        var modalInstance = $modal.open({
            templateUrl: 'modal.html',
            controller: ModalInstanceCtrl,
            size: 'lg',
            resolve: {
                which: function() {
                    return $scope.which;
                }
            }
        });
    };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function($scope, $modalInstance, which) {
    var instance = this;
    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.which = which;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

app.controller('ModalCtrl', ModalCtrl);
