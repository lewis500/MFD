app.directive('barChart', function() {
    var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 55
    },
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
    // .rangeRoundBands([0, width], .1)
    .domain([0, 1, 2, 3]);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, 100]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(",.0f"));

    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, el, attr) {

            var svg = d3.select(el[0])
                .append("svg")
                .style('width', '100%')
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var gXAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")

            var gYAxis = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            gYAxis.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -45)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("number exited");

            scope.$on("windowResize", render);
            scope.$on('tickEvent', updater);

            render();

            function render() {

                // svg.selectAll('*').remove();

                var width = d3.select(el[0]).node().parentElement.offsetWidth - margin.left - margin.right;

                x.rangeRoundBands([0, width], .2);
                xAxis.scale(x);
                gXAxis.call(xAxis);

                svg.selectAll('.bar')
                    .attr("width", x.rangeBand())
                    .attr("x", function(d, i) {
                        return x(i);
                    });

            }

            function updater() {
                var data = scope.stops
                    .map(function(d) {
                        return d.getExited().length;
                    });

                var bar = svg.selectAll(".bar")
                    .data(data);

                bar.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d, i) {
                        return x(i);
                    })
                    .attr('fill', function(d, i) {
                        return carColors(i);
                    })
                    .attr("width", x.rangeBand());

                bar.transition().duration(250)
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
