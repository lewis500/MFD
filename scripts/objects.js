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

function stepperGen(fun, pace) {
    var steps = 0;

    function reset() {
        steps = 0;
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

    return {
        setPace: setPace,
        step: step,
        reset: reset
    };

}
