function lineCtrl($scope, $rootScope, Cars) {
    var emitter = _.throttle(function() {
        $rootScope.$emit('tickEvent');
    }, 1);

    var tickFunction = function() {
        Cars.array.forEach(function(car, i) {
            car.choose(i);
        });
        Cars.array.forEach(function(car, i) {
            car.place(i);
        });
        line.adder.step();
        $rootScope.$emit('tickEvent');
    };

    var line = this;
    line.Cars = Cars;

    line.timer = new Runner(tickFunction, 1 / 200 * 1000, true);
    line.timer.transform = function(v) {
        return v / 1000;
    };

    line.adder = new Stepper(Cars.addCar, 3, false);

    line.reset = function() {
        Cars.array = [];
        $rootScope.$emit('tickEvent');
    };
    // line.adder.transform = function(v) {
    //     return v / 100;
    // };

    // line.timer.pause();
}

function Cars() {
    var F = {};
    var j = 0;

    var Car = {
        init: function(i) {
            _.assign(this, {
                loc: -16,
                potLoc: -16,
                index: i
            });
        },
        choose: function(i) {
            var potLoc = this.loc + (this.loc >= 150 && this.loc <= 225 ? 2 : 10);
            var nextCar = F.array[i + 1];
            if (nextCar) potLoc = mi(nextCar.loc - 4, ma(potLoc, this.loc));
            this.potLoc = potLoc;
        },
        place: function(i) {
            this.loc = this.potLoc;
            if (this.loc > 300) F.array.splice(i, 1);
        }
    };

    F.array = [];

    F.addCar = function() {
        var newCar = Object.create(Car);
        newCar.init(j);
        F.array.unshift(newCar);
        j++;
    };

    return F;
}

function ma(a, b) {
    return d3.max([a, b]);
}

function mi(a, b) {
    return d3.min([a, b]);
}
