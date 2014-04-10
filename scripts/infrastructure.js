app.directive('infrastructure',
    function() {

        var margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            radius = (width - 100) / 2,
            center = {
                x: width / 2,
                y: height / 2
            }


        var roadMaker = d3.svg.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius + 20)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        var sticker = d3.sticker("#car");

        // Runs during compile
        return {
            restrict: 'A',
            link: function(scope, el, attr) {

                //draw all the basics

                var svg = d3.select(el[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var road = svg.append("g")
                    .attr("class", "road")
                    .attr("transform", "translate(" + center.x + "," + center.y + ")");


                var roadPath = road.append('path')
                    .attr({
                        d: roadMaker,
                        fill: "#111",
                    });

                var rampG = road.selectAll("ramps")
                    .data(rampNumbers.map(function(d, i) {
                        return {
                            num: Math.floor(i / 2),
                            place: d,
                            on: (i % 2 == 0) ? true : false
                        }
                    }))
                    .enter()
                    .append("g")
                    .attr("class", "g-ramp")
                    .attr("transform", function(d) {
                        var m = d.place / numPos * 360;
                        return "rotate(" + m + ") translate(" + [0, -radius] + ")"
                    })
                    .attr("class", function(d) {
                        return d.on ? "on" : "off";
                    });

                var rampSubG = rampG.append("g")
                    .attr("transform", function(d, i) {
                        return "rotate(" + (d.on ? -20 : 20) + ")"
                    })

                rampSubG.append("rect")
                    .attr({
                        width: 25,
                        height: 85,
                        fill: function(d) {
                            return carColors(d.num);
                        },
                        y: -15,
                        x: -12.5,
                        opacity: .3
                    });

                var gCar = road.append("g")
                    .attr('class', 'g-cars');


                scope.$on('update', function() {
                    // if (scope.carsArray.length == 0) return;

                    //JOIN
                    var cars = gCar.selectAll('.car')
                        .data(scope.carsArray, function(d) {
                            return d.index;
                        })
                        .transition().duration(scope.tickRate).ease('linear')
                        .attr("transform", function(d) {
                            return "rotate(" + d.s / numPos * 360 + ")";
                        });

                });

                scope.$watch('carsArray.length', function(newVal) {
                    if (newVal == 0) return;

                    //JOIN
                    var cars = gCar.selectAll('.car')
                        .data(scope.carsArray, function(d) {
                            return d.index;
                        });

                    //EXIT
                    cars.exit().remove();

                    //ENTER
                    var newOne = cars.enter()
                        .append('g')
                        .attr("class", "car")
                        .attr("transform", function(d) {
                            return "rotate(" + d.s / numPos * 360 + ")";
                        })
                        .append("g")
                        .call(sticker)
                        .attr({
                            class: "g-sticker",
                            transform: "translate(8," + (-radius + 5) + ") scale(.3) rotate(180)",
                            fill: function(d) {
                                return carColors(d.exitRamp);
                            }
                        });
                });

            }
        };
    }
);
