var carColors = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(["#1abc9c", "#e74c3c", "#3498db", "#f1c40f"]);

function circleCtrl($scope, dataService, $rootScope) {
    $scope.tripLength = 50;
    $scope.elapsed = 0;

    $scope.timer = new Runner(tickFunction, 1 / 20 * 1000, true);
    
    $scope.timer.transform = function(v) {
        return v / 1000;
    };

    $scope.adder = new Stepper(dataService.add, 9.75, true);

    $scope.adder.transform = function(v) {
        return v / 100;
    };

    $scope.reset = function() {
        $scope.elapsed = 0;
        dataService.setTripLength($scope.tripLength);
        dataService.reset();
        tickFunction();
    };

    $scope.$watch('tripLength', dataService.setTripLength);

    var DB = _.throttle(function() {
        $rootScope.$emit('tickEvent');
    }, 30);

    function tickFunction() {
        dataService.tick();
        $scope.adder.step();
        $scope.elapsed++;
        DB();
    }
}
