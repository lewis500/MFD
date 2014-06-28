// function runnerGen(fun, pace) {
//     var paused = true;

//     function setPace(newpace) {
//         pace = newpace;
//     };

//     function getPace() {
//         return pace
//     }

//     function pause(newVal) {
//         if (newVal !== undefined) paused = newVal;
//         else {
//             paused = !paused;
//         }
//         if (!paused) start();
//     };

//     function start() {

//         var t = 0,
//             timeSinceCall = pace,
//             last = 0;

//         d3.timer(function(elapsed) {
//             t = (elapsed - last);

//             //the tick part
//             timeSinceCall = timeSinceCall + t;
//             if (timeSinceCall >= pace) {
//                 timeSinceCall = 0;
//                 fun();
//             }

//             last = elapsed;

//             return paused;
//         });
//     };

//     return {
//         start: start,
//         pause: pause,
//         setPace: setPace,
//         getPace: getPace
//     };

// }

// function stepperGen(fun, pace) {
//     var steps = pace;

//     function reset() {
//         steps = pace;
//     }

//     function step() {
//         steps++;
//         if (steps < pace) return;
//         steps = 0;
//         fun();
//     }

//     function setPace(newPace) {
//         pace = newPace;
//     }

//     function setVelocity(newVel) {
//         pace = 1 / newVel;
//     }

//     return {
//         setPace: setPace,
//         step: step,
//         reset: reset,
//         setVelocity: setVelocity
//     };

// }


// function Stepper(fun, pace) {
//     var self = this;
//     var steps = pace;
//     self.pace = pace;

//     self.reset = function() {
//         steps = self.pace;
//     }

//     self.step = function() {
//         steps++;
//         if (steps < self.pace) return;
//         steps = 0;
//         fun();
//     }

//     self.setVelocity = function(v) {
//         self.pace = 1 / v
//     }

//     return self;
// }


// function Runner(fun, pace) {
//     var self = this;
//     var paused = true;
//     self.pace = pace;

//     self.pause = function(newVal) {
//         if (newVal !== undefined) paused = newVal;
//         else paused = !paused;
//         if (!paused) self.start();
//     };

//     self.isPaused = function() {
//         return paused;
//     }

//     self.start = function() {
//         var t = 0,
//             timeSinceCall = self.pace,
//             last = 0;

//         d3.timer(function(elapsed) {
//             t = (elapsed - last);
//             timeSinceCall = timeSinceCall + t;
//             if (timeSinceCall >= self.pace) {
//                 timeSinceCall = 0;
//                 fun();
//             }
//             last = elapsed;
//             return paused;
//         });
//     };
//     return self;
// }

function Runner(fun, val, useVel) {
    var self = this;
    var paused = true;
    if (useVel) self.velocity = val;
    else self.pace = val;

    self.transform = function(v) {
        return v;
    };

    self.pause = function(newVal) {
        if (newVal !== undefined) paused = newVal;
        else paused = !paused;
        if (!paused) self.start();
    };

    self.isPaused = function() {
        return paused;
    };

    self.start = function() {
        var t = 0,
            timeSinceCall = useVel ? (1 / self.transform(self.velocity)) : self.transform(self.pace),
            last = 0;

        d3.timer(function(elapsed) {
            t = (elapsed - last);
            timeSinceCall = timeSinceCall + t;
            last = elapsed;
            if (!(timeSinceCall >= self.getPace())) return;
            timeSinceCall = 0;
            fun();
            return paused;
        });
    };

    self.getPace = function() {
        return useVel ? (1 / self.transform(self.velocity)) : self.transform(self.pace);
    };

    return self;
}


function Stepper(fun, val, useVel) {
    var self = this;
    var steps;
    if (useVel) self.velocity = val;
    else self.pace = val;

    self.reset = function() {
        steps = useVel ? (1 / self.velocity) : self.pace;
    };

    self.transform = function(v) {
        return v;
    };

    self.paused = false;

    self.step = function() {
        if(self.paused) return;
        steps++;
        if (!(steps >= self.getPace())) return;
        steps = 0;
        fun();
    };

    self.reset();

    self.getPace = function() {
        return useVel ? (1 / self.transform(self.velocity)) : self.transform(self.pace);
    };

    return self;
}
