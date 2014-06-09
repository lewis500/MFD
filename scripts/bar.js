app.directive('barChart', function() {
    var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 55
    },
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, el, attr) {

            var svg = d3.select(el[0]).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(",.0f"))

            var data = [0, 0, 0, 0];

            x.domain([0, 1, 2, 3]);

            y.domain([0, 100]);

            var gXAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            var gYAxis = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            gYAxis.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("number exited");

            var bar = svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d, i) {
                    return x(i);
                })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                    return y(d);
                })
                .attr("height", function(d) {
                    return height - y(d);
                })
                .attr('fill', function(d, i) {
                    // console.log(carColors(i))
                    return carColors(i+1);
                });

            scope.$watch(function() {
                return scope.stops.reduce(function(a, b) {
                    return a + b.getExited().length;
                }, 0);
            }, updater);

            function updater() {
                var data = scope.stops
                    .map(function(d) {
                        return d.getExited().length;
                    });

                gYAxis.transition().call(yAxis);

                bar.data(data)
                    .transition().duration(100)
                    .attr("y", function(d) {
                        return y(d);
                    })
                    .attr("height", function(d) {
                        return height - y(d);
                    });


            };

        }
    };
});
