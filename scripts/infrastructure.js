app.directive('infrastructure', function() {

    var margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom,
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

    var numPatches = 100;

    // Runs during compile
    return {
        restrict: 'A',
        link: function(scope, el, attr) {

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
                .data(scope.stops)
                .enter()
                .append("g")
                .attr("class", "g-ramp")
                .attr("transform", function(d) {
                    var m = d.loc / numPatches * 360;
                    return "rotate(" + m + ") translate(" + [0, radius] + ")"
                })
                .append("rect")
                .attr({
                    width: 25,
                    height: 85,
                    fill: function(d) {
                        return d.loc == 0 ? carColors(3) : carColors(numPatches / d.loc);
                    },
                    y: -15,
                    x: -12.5,
                    opacity: .3
                });

            var gCar = road
                .append("g")
                .attr('class', 'g-cars');

            //logic
            scope.$on('tickEvent', updateCars);

            function updateCars() {
                var carsArray = gCar.selectAll('.car')
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
                    .attr("class", "car")
                    .attr("transform", function(d) {
                        return "rotate(" + (d.getLoc() / numPatches * 360) + ")";
                    })
                    .append('rect')
                    .attr({
                        width: 10,
                        height: 10,
                        class: "g-sticker",
                        transform: "translate(0," + (radius) + ")",
                        fill: function(d) {
                            return d.dest == 0 ? carColors(3) : carColors(numPatches / d.dest);
                        }
                    });

            } //end updateCars

        } //end link
    }; //end return
}); //end directive
