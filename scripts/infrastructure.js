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

            var outerRadius, innerRadius, carRadius;
            render();

            var hasText = false;
            scope.$on("windowResize", render);
            scope.$on('tickEvent', updateCars);
            scope.$on('highlightEvent', highlightCars)

            function highlightCars() {
                var i = scope.highlighted;
                d3.selectAll('.car')
                    .classed('highlighted', function(d) {
                        if (i == null) return false;
                        return d.dest == i * numPatches / 4;
                    })
                    .classed('diminished', function(d) {
                        if (i == null) return false;
                        return d.dest !== i * numPatches / 4;
                    });
                // .classed('')
            }

            function render() {

                var width = d3.select(el[0]).node().offsetWidth - margin.left - margin.right;

                outerRadius = d3.min([width / 2, height / 2]);
                innerRadius = outerRadius * 0.8;
                carRadius = outerRadius * 0.9

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
                        rx: 3,
                        ry: 3,
                        fill: function(d) {
                            return carColors(d.loc / numPatches * 4);
                        },
                        opacity: .5,
                        stroke: "#ccc",
                        "stroke-width": 3
                    });

                gRamp.attr("transform", function(d) {
                    var m = d.loc / numPatches * 360;
                    return "rotate(" + m + ") translate(" + [0, outerRadius + 1] + ")"
                });

                gRamp.selectAll("rect")
                    .attr({
                        width: outerRadius * 0.2,
                        height: outerRadius * 0.4,
                        y: -outerRadius * 0.4,
                        x: -outerRadius * 0.1,
                    });

                roadMaker.innerRadius(innerRadius)
                    .outerRadius(outerRadius*.97);

                roadPath.attr("d", roadMaker);

                var H = outerRadius * 0.05

                gCar.selectAll(".car")
                    .attr({
                        "transform": "translate(0," + carRadius + ")",
                        width: H,
                        height: H / 2,
                        ry: H / 2,
                        rx: H / 5,
                        y: -H / 2
                    })


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
                    .html("<h5>Exit Rate: " + scope.rate * 10 + " (cars/10 sec)</h5><h5>Time Elapsed: " + scope.elapsed + " sec</h5><h5>Cars on the road: " + scope.numCars + "</h5>");

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

                var H = outerRadius * 0.05

                carsArray.enter()
                    .append('g')
                    .attr("class", "g-car")
                    .attr("transform", function(d) {
                        return "rotate(" + (d.getLoc() / numPatches * 360) + ")";
                    })
                    .append("g")
                    .attr("class", "car")
                    .attr("transform", "translate(0," + carRadius + ")")
                    .append('rect')
                    .attr({
                        width: H,
                        height: H / 2,
                        ry: H / 2,
                        rx: H / 5,
                        y: -H / 2,
                        transform: "scale(2)",
                        fill: function(d) {
                            return carColors(d.dest / numPatches * 4);
                        },
                        stroke: function(d) {
                            return carColors(d.dest / numPatches * 4);
                        }
                    })
                    .transition()
                    .duration(scope.tickPace * 3)
                    .ease('cubic')
                    .attr('transform', 'scale(1)');

                highlightCars(scope.highlighted);

            } //end updateCars

        } //end link
    }; //end return
}); //end directive
