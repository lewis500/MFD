app.directive('barChart', ['$rootScope', 'dataService',
    function($rs,DS) {
        var margin = {
            top: 10,
            right: 20,
            bottom: 20,
            left: 55
        },
            height = 300 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
        // .rangeRoundBands([0, width], .1)
        .domain([0, 1, 2, 3]);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, 8]);

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

                var throttled = _.throttle(function(data) {
                    y.domain([0, d3.max([d3.max(data) * 1.2, 8])]);
                    gYAxis.transition().duration(300)
                        .call(yAxis);
                }, 300);

                var svg = d3.select(el[0])
                    .append("svg")
                    .style('width', '100%')
                    .style("height", height + margin.top + margin.bottom + "px")
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
                    .attr("y", -50)
                    .attr("dy", ".71em")
                    .attr("x", -70)
                    .style("text-anchor", "end")
                    .text("number exited");

                svg.selectAll(".bar")
                    .data([0, 0, 0, 0])
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("rx", 1.5)
                    .attr("ry", 1.5)
                    .attr("x", function(d, i) {
                        return x(i);
                    })
                    .attr('fill', function(d, i) {
                        return carColors(i);
                    })
                    .attr('stroke', function(d, i) {
                        return carColors(i);
                    })
                    .attr("width", x.rangeBand())
                    .on('mouseover', mOverFunc)
                    .on('mouseout', mOutFun);

                $rs.$on("windowResize", render);
                $rs.$on('tickEvent', updater);

                render();

                function mOverFunc(d, i) {
                    scope.highlighter(i);
                    svg.selectAll('.highlighted').classed("highlighted", false);
                    d3.select(this).classed("highlighted", true);
                }

                function mOutFun(d, i) {
                    d3.select(this).classed("highlighted", false);
                    scope.highlighter(null);
                }

                function render() {

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
                    var data = DS.getStops()
                        .map(function(d) {
                            return d.getExited().length;
                        });

                    throttled(data);

                    var bar = svg.selectAll(".bar")
                        .data(data);

                    bar.transition().duration(50)
                        .ease('cubic')
                        .attr("y", function(d) {
                            return y(d);
                        })
                        .attr("height", function(d) {
                            return height - y(d);
                        });

                }

            }
        };
    }
]);
