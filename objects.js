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
