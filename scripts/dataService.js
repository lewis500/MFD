app.factory('dataService', function() {
    var tEmpty, numPatches, numCars, patches, cars, stops, tripLength, avgKeeper, exits;
    var maxTripLength = 3;
    var tripLength = 50;

    reset();

    function reset() {
        tEmpty = 4;
        numPatches = 100;
        numCars = 0;
        exits = [];
        cars = [];
        stops = [];

        patches = d3.range(numPatches)
            .map(function(d) {
                return patcher(d);
            });

        patches.forEach(function(d, i, k) {
            d.setNext(k[(i + 1) % numPatches])
        });

        patches.forEach(function(d, i) {
            if (d.loc % 25 !== 0) return;
            d.stop = stopper(d);
            stops.push(d.stop);
        });
    }

    function tick() {
        _.invoke(patches, 'choose');

        var sum = 0;
        stops.forEach(function(stop) {
            stop.queueChoice();
            sum += stop.getExited().length;
        });
        exits.push(sum);

        _.invoke(cars, 'choose');
    }


    function add() {
        _.invoke(_.shuffle(stops), 'choose');
    }

    function patcher(num) {
        var loc = num,
            car = null,
            stop, next;

        var howLong = tEmpty + 1;

        function choose() {
            if (isEmpty()) howLong++;
            else howLong = 0;
        }

        function isFree() {
            return ((howLong >= tEmpty) && !car); //must create 
        }

        function isEmpty() {
            return !car; //must create 
        }

        function getHowLong() {
            return howLong;
        }

        function setCar(newCar) {
            car = newCar;
            howLong = 0;
        }

        function removeCar() {
            car = null;
        }

        function setNext(newNext) {
            next = newNext;
        }

        function getNext() {
            return next;
        }

        return {
            loc: loc,
            getNext: getNext,
            setNext: setNext,
            getHowLong: getHowLong,
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
        var queue = [];

        var onPatch = patch.getNext().getNext();

        function receiveCar(newCar) {
            exited.push(newCar);
        }

        function getExited() {
            return exited;
        }

        function queueChoice() {
            if (!onPatch.isFree() || queue.length == 0) return;
            var newCar = queue.pop();
            onPatch.setCar(newCar);
            cars.push(newCar);
        }

        function choose() {
            var dest = destMaker(loc);
            var newCar = new Car(onPatch, dest);
            queue.push(newCar);
            numCars++;
        }

        return {
            choose: choose,
            loc: loc,
            getExited: getExited,
            receiveCar: receiveCar,
            queueChoice: queueChoice
        };

    }

    function getExitRate() {
        var a = d3.min([100, exits.length]);
        var b = (exits[exits.length - 1] - exits[exits.length - a]) / a;
        return b * 10;
    }


    return {
        getCars: function() {
            return cars;
        },
        getStops: function() {
            return stops;
        },
        setTripLength: function(newVal) {
            tripLength = newVal;
        },
        getExitRate: getExitRate,
        tick: tick,
        add: add,
        reset: reset,
    };

});
