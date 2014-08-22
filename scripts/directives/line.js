function singleLink($rootScope) {

    var height = 66;

    return function(scope, el, attr) {

        var svg = d3.select(el[0])
            .append("svg")
            .style({
                width: "100%",
                height: height + "px"
            });


        var road = svg.append("rect")
            .attr({
                height: height + "px",
                fill: "#ecf0f1"
            });

        var greenLines = svg.selectAll("greenlines")
            .data(d3.range(2))
            .enter()
            .append("line")
            .attr({
                x1: 0,
                transform: function(d, i) {
                    return "translate(" + [0, i * height] + ")";
                },
                stroke: "#2ecc71",
                "stroke-width": 5
            });

        var yellowLines = svg.selectAll("yellowlines")
            .data(d3.range(2))
            .enter()
            .append("line")
            .attr({
                transform: function(d, i) {
                    return "translate(" + [0, i * height] + ")";
                },
                stroke: "#f1c40f",
                "stroke-width": 6
            });

        var color = d3.scale.category10();
        var x = d3.scale.linear()
            .domain([0, 300]);

        var render = _.throttle(function() {
            var width = d3.select(el[0]).node().offsetWidth;
            road.attr("width", width);
            // greenPart.attr("width",width)
            x.range([0, width]);
            greenLines.attr("x2", width);
            yellowLines.attr({
                x1: function() {
                    return x(150)
                },
                x2: function() {
                    return x(225)
                }
            });
        }, 50);

        var gCar = svg.append("g")
            .attr("transform", "translate(0," + height / 2 + ")");

        render();

        $(window).resize(render);

        $rootScope.$on('tickEvent', function() {
            var data = scope.line.Cars.array;

            var cars = gCar.selectAll(".car")
                .data(data, function(d) {
                    return d.index;
                });
            cars.transition().duration(scope.line.timer.getPace()).ease('linear').attr("transform", placer);

            cars.enter()
                .append("g")
                .attr("class", "car")
                .append('rect')
                .attr({
                    width: 16,
                    height: 10,
                    rx: 3,
                    ry: 3,
                    y: -5,
                    x: 16,
                    fill: "#3498db",
                    transform: placer
                });

            cars.exit().remove();


        });

        function placer(d) {
            return "translate(" + [x(d.loc), 0] + ")"
        }
    }


}
