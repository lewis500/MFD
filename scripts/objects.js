function tick() {
    patches.forEach(function(d) {
        d.choose();
    });

    cars.forEach(function(car) {
        car.choose();
    });

    avgKeeper.increment();
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
    var a = Math.random() < tripLength / numPatches ? 3 : 2
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

function runnerGen(fun, pace) {
    var paused = true;

    function setPace(newpace) {
        pace = newpace;
    };

    function getPace() {
        return pace
    }

    function pause() {
        paused = !paused;
        if (!paused) start();
    };

    function start() {

        var t = 0,
            timeSinceCall = 0,
            last = 0;

        d3.timer(function(elapsed) {
            t = (elapsed - last);

            //the tick part
            timeSinceCall = timeSinceCall + t;
            if (timeSinceCall >= pace) {
                timeSinceCall = 0;
                fun();
            }

            last = elapsed;

            return paused;
        });
    };

    return {
        start: start,
        pause: pause,
        setPace: setPace,
        getPace: getPace
    };

}

