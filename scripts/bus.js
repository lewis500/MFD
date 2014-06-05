app.directive('bus', function() {
    var margin = {
        top: 25,
        right: 0,
        bottom: 0,
        left: 25
    },
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        radius = (width - 200) / 2,
        center = {
            x: width / 2,
            y: height / 2
        };

    var roadMaker = d3.svg.arc()
        .innerRadius(radius - 30)
        .outerRadius(radius + 30)
        .startAngle(0)
        .endAngle(2 * Math.PI);

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);


    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, el, attr) {

            var sticker = d3.sticker("#bus");

            var svg = d3.select(el[0])
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            var gMain = svg.append("g")
                .attr("class", "g-main")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var road = svg.append("g")
                .attr("class", "road")
                .attr("transform", "translate(" + center.x + "," + center.y + ")");

            var roadPath = road.append('path')
                .attr({
                    d: roadMaker,
                    fill: "#111",
                });

            scope.$on('tickEvent', update);

            function update() {

                var B = road.selectAll(".g-bus")
                    .data(scope.buses);

                B.enter()
                    .append("g")
                    .attr("class", "g-bus")
                    .append("rect")
                    .attr("transform", "translate(" + [0, radius] + " )")
                    .attr({
                        width: 5,
                        height: 5,
                        fill: "crimson"
                    });
                // .call(sticker);

                B.exit().remove();

                B
                    // .duration(scope.tickTime)
                    .attr("transform", function(d) {
                        return "rotate(" + d.getLoc() / numPatches * 360 + ")";
                    });

            }


        } //end link function
    }; //end return
}); //end directive
