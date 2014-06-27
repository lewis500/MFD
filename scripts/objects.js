function runnerGen(fun, pace) {
    var paused = true;

    function setPace(newpace) {
        pace = newpace;
    };

    function getPace() {
        return pace
    }

    function pause(newVal) {
        if (newVal !== undefined) paused = newVal;
        else {
            paused = !paused;
        }
        if (!paused) start();
    };

    function start() {

        var t = 0,
            timeSinceCall = pace,
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

function stepperGen(fun, pace) {
    var steps = pace;

    function reset() {
        steps = pace;
    }

    function step() {
        steps++;
        if (steps < pace) return;
        steps = 0;
        fun();
    }

    function setPace(newPace) {
        pace = newPace;
    }

    function setVelocity(newVel) {
        pace = 1 / newVel;
    }

    return {
        setPace: setPace,
        step: step,
        reset: reset,
        setVelocity: setVelocity
    };

}


function Stepper(fun, pace) {
    var self = this;
    var steps = pace;
    self.pace = pace;

    self.reset = function() {
        steps = self.pace;
    }

    self.step = function() {
        steps++;
        if (steps < self.pace) return;
        steps = 0;
        fun();
    }

    self.setVelocity = function(v) {
        self.pace = 1 / v
    }

    return self;
}


function Runner(fun, pace) {
    var self = this;
    var paused = true;
    self.pace = pace;

    self.pause = function(newVal) {
        if (newVal !== undefined) paused = newVal;
        else paused = !paused;
        if (!paused) self.start();
    };

    self.start = function() {
        var t = 0,
            timeSinceCall = self.pace,
            last = 0;

        d3.timer(function(elapsed) {
            t = (elapsed - last);
            timeSinceCall = timeSinceCall + t;
            if (timeSinceCall >= self.pace) {
                timeSinceCall = 0;
                fun();
            }
            last = elapsed;
            return paused;
        });
    };
    return self;
}
