app.directive('infrastructure', function() {

    var margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
        height = 450 - margin.top - margin.bottom;

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

            scope.$on("windowResize", render);
            scope.$on('tickEvent', updateCars);

            function render() {

                var width = d3.select(el[0]).node().parentElement.offsetWidth - margin.left - margin.right,
                    center = {
                        x: width / 2,
                        y: height / 2
                    };

                radius = (width) / 2 * .7;

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

                roadMaker.innerRadius(radius - radius*0.2)
                    .outerRadius(radius + radius*0.2);

                roadPath.attr("d", roadMaker);

                gCar.selectAll(".car")
                    .attr("transform", "translate(0," + radius + ")");
            }

            function updateCars() {

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
                    .append('rect')
                    .attr("class", "car")
                    .attr({
                        width: 10,
                        height: 10,
                        // class: "g-sticker",
                        transform: "translate(0," + radius + ")",
                        fill: function(d) {
                            return d.dest == 0 ? carColors(3) : carColors(numPatches / d.dest);
                        }
                    });

            } //end updateCars

        } //end link
    }; //end return
}); //end directive
