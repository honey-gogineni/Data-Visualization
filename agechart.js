function drawAgePie() {
    let svg = d3
        .select("#age")
        .append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
        .attr('viewBox', [0, 0, pieWidth, pieHeight]);

    const ang = 2 * Math.PI;

    const pie = d3.pie()
        .value((d) => d[1].length)
        .sort(null);

    // Creating arc
    const arc = d3.arc()
        .outerRadius(Math.min(pieHeight, pieWidth) / 2)
        .innerRadius(Math.min(pieHeight, pieWidth) / 6)

    let g = svg.append("g")
        .attr("transform", "translate(150,150) rotate(-90)");

    const color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5])
        .range(['red', 'orange', 'yellow', 'lightgreen', 'teal', 'blueviolet']);


    const ages = d3
        .scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5])
        .range(["0-10", "11-21", "21-40", "41-60", "61-80", ">80"]);

    let ageg = d3.group(agesex, (d) => +d.age);
    ageg = d3.sort(ageg, (d) => +d[0]);
    // Grouping different arcs
    const arcs = g.selectAll("arc")
        .data(pie(ageg))
        .enter()
        .append("g");

    const updateMapPoints = (event, data) => {
        d3.selectAll('.map-point')
            .attr('opacity', 0);

        d3.selectAll(`.age-${+data.data[0]}`)
            .attr("r", 6)
            .attr('opacity', 1);

        showTooltip(`Age Group: ${ages(data.data[0])}<br/>Deaths: ${data.data[1].length} <br/>${((data.data[1].length / agesex.length) * 100).toFixed() + '%'}`,
            event.pageX + 20, event.pageY - 20);

    }

    // Appending path
    arcs.append("path")
        .attr("fill", (d) => color(d.data[0]))
        .attr("d", arc)
        .on("mouseover", updateMapPoints)
        .on("mousemove", updateMapPoints)
        .on("mouseout", resetMapPoints);

    // Adding data to each arc
    arcs.append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 25}) rotate(90)`)
        .text((d) => ages(+d.data[0]))
        .on("mouseover", updateMapPoints)
        .on("mousemove", updateMapPoints)
        .on("mouseout", resetMapPoints);

    // arcs.append("text")
    //     .attr("transform", (d) => `translate(${arc.centroid(d)[0] - 25}, ${arc.centroid(d)[1] - 25}) rotate(90)`)
    //     .text((d) => ((d.data[1].length / agesex.length) * 100).toFixed(1) + '%')
    // 	.on("mouseover", updateMapPoints)
    //     .on("mousemove", updateMapPoints)
    //     .on("mouseout", resetMapPoints);

}