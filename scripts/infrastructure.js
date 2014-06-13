app.directive('infrastructure', function() {

    var margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
        height = 450;

    var roadMaker = d3.svg.arc()
        .startAngle(0)
        .endAngle(2 * Math.PI);

    var numPatches = 100;

    // Runs during compile
    return {
        restrict: 'A',
        link: function(scope, el, attr) {

            var svg = d3.select(el[0])
                .append("svg")
                .style('width', '100%')
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var road = svg.append("g")
                .attr("class", "road")

            var roadPath = road.append('path')
                .attr("fill", "#111");

            var gCar = road
                .append("g")
                .attr('class', 'g-cars');

            var radius;
            render();

            var hasText = false;
            scope.$on("windowResize", render);
            scope.$on('tickEvent', updateCars);

            function render() {

                var width = d3.select(el[0]).node().parentElement.offsetWidth - margin.left - margin.right;

                radius = d3.min([width / 2, height / 2]) * .8;

                var center = {
                    x: width / 2,
                    y: height / 2
                };


                road.attr("transform", "translate(" + center.x + "," + center.y + ")");

                var gRamp = road.selectAll(".g-ramp")
                    .data(scope.stops);

                gRamp.enter()
                    .append("g")
                    .attr("class", "g-ramp")
                    .append("rect")
                    .attr({
                        fill: function(d) {
                            return d.loc == 0 ? carColors(3) : carColors(numPatches / d.loc);
                        },
                        opacity: .4
                    });

                gRamp.attr("transform", function(d) {
                    var m = d.loc / numPatches * 360;
                    return "rotate(" + m + ") translate(" + [0, radius] + ")"
                });

                gRamp.selectAll("rect")
                    .attr({
                        width: radius * 0.2,
                        height: radius * 0.4,
                        y: -radius * 0.2,
                        x: -radius * 0.1,
                    });

                roadMaker.innerRadius(radius * .85)
                    .outerRadius(radius * 1.15);

                roadPath.attr("d", roadMaker);

                gCar.selectAll(".car")
                    .attr("transform", "translate(0," + radius + ")");


                if (!hasText) {

                    svg.append("g")
                        .attr("class", "g-text")
                        .append("foreignObject")
                        .attr("width", 300)
                        .attr("height", 300)
                        .append("xhtml:div");

                    hasText = true;
                }

                d3.select(".g-text")
                    .attr("transform", "translate(" + [center.x - 75, center.y - 25] + ")")
            }

            function updateCars() {

                d3.select(".g-text").select("div")
                    .html("<h5>Exit Rate: " + scope.rate + " (cars/sec)</h5><h5>Elapsed: " + scope.elapsed + " sec</h5><h5>Cars on the road: " + scope.numCars + "</h5>");

                var carsArray = gCar.selectAll('.g-car')
                    .data(scope.cars, function(d) {
                        return d.index;
                    });

                carsArray.exit().remove();

                carsArray
                    .transition()
                    .duration(scope.tickPace)
                    .ease('linear')
                    .attr("transform", function(d) {
                        return "rotate(" + (d.getLoc() / numPatches * 360) + ")";
                    });

                carsArray.enter()
                    .append('g')
                    .attr("class", "g-car")
                    .attr("transform", function(d) {
                        return "rotate(" + (d.getLoc() / numPatches * 360) + ")";
                    })
                    .append("g")
                    .attr("transform", "translate(" + [0, radius] + ")")
                    .append('rect')
                    .attr("class", "car")
                    .attr({
                        width: 10,
                        height: 10,
                        // class: "g-sticker",
                        transform: "scale(2)",
                        fill: function(d) {
                            return d.dest == 0 ? carColors(3) : carColors(numPatches / d.dest);
                        }
                    })
                    // .transition()
                    // .duration(scope.tickPace)
                    // .ease('cubic')
                    // .attr('transform', 'scale(.5)')
                    // .delay(scope.tickPace)
                    .transition()
                    .duration(scope.tickPace*3)
                    .ease('cubic')
                    .attr('transform', 'scale(1)');

            } //end updateCars

        } //end link
    }; //end return
}); //end directive
