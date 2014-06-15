app.factory('dataService', function() {

    var tEmpty, numPatches, numCars, patches, cars, stops, tripLength, avgKeeper;

    var maxTripLength = 3;

    reset();

    function reset() {
        tEmpty = 4;
        numPatches = 100;
        numCars = 0;

        patches = d3.range(numPatches).map(function(d) {
            return patcher(d);
        });

        cars = [];
        stops = [];
        tripLength = 60;

        patches.forEach(function(d, i) {
            if (d.loc % 25 == 0) {
                var newStop = stopper(d);
                d.stop = newStop;
                stops.push(newStop);
            }
        });

        avgKeeper = avger();

    }

    function getAvgKeeper() {
        return avgKeeper;
    }

    function tick() {
        patches.forEach(function(d) {
            d.choose();
        });

        cars.forEach(function(car) {
            car.choose();
        });

        avgKeeper.increment();
    }

    function getCars() {
        return cars;
    }

    function getStops() {
        return stops;
    }

    function setTripLength(newVal) {
        tripLength = newVal;
    }

    function avger() {
        var lastCount = 0;
        var rates = [];

        function increment() {
            newCount = cars.length;
            newRate = newCount - lastCount;
            rates.push(newRate);
            lastCount = newCount;
        }

        function getAvg() {
            if (rates.length < 20) return null;
            return d3.mean(_.last(rates, 20));
        }

        return {
            increment: increment,
            getAvg: getAvg
        };
    }

    function add() {
        _.shuffle(stops).forEach(function(d) {
            d.choose();
        });

    }

    function patcher(num) {
        var loc = num;
        var car = null;
        var stop = null;
        var howLong = tEmpty + 1;

        function choose() {
            if (isEmpty()) howLong++;
            else howLong = 0;
        }

        function isFree() {
            return howLong >= tEmpty && isEmpty(); //must create 
        }

        function isEmpty() {
            return car === null; //must create 
        }

        function setCar(newCar) {
            car = newCar;
            howLong = 0;
        }

        function removeCar() {
            car = null;
        }

        function getNext() {
            var nextLoc = (loc + 1) % numPatches;
            return patches[nextLoc];
        }

        return {
            loc: loc,
            getNext: getNext,
            setCar: setCar,
            isFree: isFree,
            removeCar: removeCar,
            choose: choose,
            isEmpty: isEmpty
        };

    }

    function Car(patch, dest) {
        var C = this;

        C.index = numCars;
        C.dest = dest;

        var loc = patch.loc;
        var patch = patch;
        var stop = stops[dest / numPatches * 4];

        if (stop == undefined) debugger;

        function advance() {
            patch.removeCar();
            patch = patch.getNext();
            patch.setCar(C);
            loc = patch.loc;
        }

        function choose() {
            if (patch.loc == dest) exit();
            else if (patch.getNext().isFree()) advance();
        }

        function exit() {
            patch.removeCar();
            stop.receiveCar(C);
            cars.splice(cars.indexOf(C), 1);
        }

        function getLoc() {
            return loc;
        }

        C = _.extend(C, {
            choose: choose,
            getLoc: getLoc,
        });

        return C;
    }

    function destMaker(orig) {
        // var a = Math.random() < tripLength / numPatches ? 3 : 2;
        var threshold = 1.0 - (maxTripLength - tripLength / 25);
        var a = (Math.random() >= threshold) ?
            2 : 3;
        return (orig + a * 25) % numPatches;
    }

    function stopper(patch) {
        var loc = patch.loc;
        var exited = [];

        function receiveCar(newCar) {
            exited.push(newCar);
        }

        function getExited() {
            return exited;
        }

        function choose() {
            if (!patch.isEmpty()) return;
            var dest = destMaker(loc);
            var newCar = new Car(patch, dest);
            patch.setCar(newCar);
            cars.push(newCar);
            numCars++
        }

        return {
            choose: choose,
            loc: loc,
            getExited: getExited,
            receiveCar: receiveCar
        };

    }

    return {
        getCars: getCars,
        getStops: getStops,
        setTripLength: setTripLength,
        tick: tick,
        add: add,
        reset: reset,
        getAvgKeeper: getAvgKeeper
    };

});
