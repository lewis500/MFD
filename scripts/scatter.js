app.directive('scatterChart', function() {
    // Runs during compile
    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(θ, el, attr) {
            var margin = {
                top: 10,
                right: 10,
                bottom: 20,
                left: 42
            },
                width = 400 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;

            var svg = d3.select(el[0]).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var x = d3.scale.linear()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(",.0f"))
		            // .ticks(10);

            var data = [];

            x.domain([4, 40]);

            y.domain([0,10]);

            var gXAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            var gYAxis = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

              gYAxis.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -40)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("number exited");


            θ.$on('check', function(newVal) {

            		svg.selectAll(".scatterDot")
            			.data(θ.exitStats)
            			.enter()
            			.append("g")
            			.attr('transform', function(d){
            				return 'translate(' + x(d.density) + ',' + y(d.exits) + ')'
            			})
            			.append("svg:circle")
            			.attr('class', "scatterDot")
            			.attr('r', "4px")
                        .attr('fill','red' )
            			
            });

        }
    };
});
