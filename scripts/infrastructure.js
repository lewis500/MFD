app.directive('infrastructure',
    function() {

        var margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom,
            radius = (width - 100) / 2,
            center = {
                x: width / 2,
                y: height / 2
            };

        var roadMaker = d3.svg.arc()
            .innerRadius(radius - 30)
            .outerRadius(radius + 30)
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
                            num: i,
                            place: d
                        }
                    }))
                    .enter()
                    .append("g")
                    .attr("class", "g-ramp")
                    .attr("transform", function(d) {
                        var m = d.place / numPos * 360;
                        return "rotate(" + m + ") translate(" + [0, -radius] + ")"
                    })
                    .append("rect")
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

                var gLabel = svg
                    .append("g")
                    .attr('transform', 'translate(' + center.x + ',' + (center.y - 25) + ')')

                var rateLabel = gLabel
                    .append("g")
                    .attr("class", "rate-label")
                    .append("text")
                    .attr("text-anchor", "middle")


                var numLabel = gLabel
                    .append("g")
                    .attr('transform', 'translate(' + 0 + ',' + (+30) + ')')
                    .attr("class", "rate-label")
                    .append("text")
                    .attr("text-anchor", "middle")


                var timeLabel = gLabel
                    .append("g")
                    .attr('transform', 'translate(' + 0 + ',' + (+60) + ')')
                    .attr("class", "rate-label")
                    .append("text")
                    .attr("text-anchor", "middle")


                var gCar = road
                    .append("g")
                    .attr('class', 'g-cars');

                //logic
                scope.$on('update', function() {

                    gCar.selectAll('.car')
                        .data(scope.carsArray, function(d) {
                            return d.index;
                        })
                        .transition()
                        .duration(scope.tickRate)
                        .ease('linear')
                        .attr("transform", function(d) {
                            return "rotate(" + (d.s / numPos * 360 - 3) + ")";
                        });

                    timeLabel.text(d3.format('.1f')(scope.elapsed) + " sec elapsed");

                });

                scope.$on('avgUpdate', function() {
                    rateLabel.text(d3.format('.2r')(scope.movAvg) + " exits/sec");
                    numLabel.text(scope.carsArray.length + " cars on the road");

                })

                scope.$on('addOrExit', function() {

                    //JOIN
                    var cars = gCar.selectAll('.car')
                        .data(scope.carsArray, function(d) {
                            return d.index;
                        });

                    //EXIT
                    cars.exit().remove();

                    //ENTER
                    cars.enter()
                        .append('g')
                        .attr("class", "car")
                        .attr("transform", function(d) {
                            return "rotate(" + (d.s / numPos * 360 - 3) + ")";
                        })
                        .append("g")
                        .call(sticker)
                        .attr({
                            class: "g-sticker",
                            transform: "translate(0," + (-radius + -10) + ") scale(.22) rotate(0)",
                            fill: function(d) {
                                return carColors(d.exitRamp);
                            }
                        });
                });

            }
        };
    }
);
