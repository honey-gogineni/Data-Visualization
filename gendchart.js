function drawSexPie() {
	let svg = d3
		.select("#sex")
		.append("svg")
		.attr("width", pieWidth)
		.attr("height", pieHeight)
		.attr('viewBox', [0, 0, pieWidth, pieHeight]);

	const ang = 2 * Math.PI;


	const color = d3.scaleOrdinal()
		.domain([0, 1])
		.range(['blue', 'magenta']);

	const pie = d3.pie()
		.value((d) => d[1].length);

	// Creating arc
	const arc = d3.arc()
		.outerRadius(Math.min(pieHeight, pieWidth) / 2)
		.innerRadius(0)
		.cornerRadius(5)
		.endAngle(Math.PI / 2);


	let g = svg.append("g")
		.attr("transform", "translate(150,160) rotate(-90)");

	let sexg = d3.group(agesex, (d) => +d.gender);

	// Grouping different arcs
	const arcs = g.selectAll("arc")
		.data(pie(sexg))
		.enter()
		.append("g");

	const updateMapPoints = (event, data) => {
		d3.selectAll('.map-point')
			.attr('opacity', 0);

		d3.selectAll(`.map-point-${+data.data[0] === 0 ? 'male' : 'female'}`)
			.attr("r", 6)
			.attr('opacity', 1);

			showTooltip(`Gender: ${+data.data[0] === 0 ? 'Male' : 'Female'} <br/>No. of Deaths: ${data.data[1].length} <br/>${((data.data[1].length / agesex.length) * 100).toFixed(1) + '%'}`,
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
		.text((d) => d.data[0] === 0 ? 'Male' : 'Female')
		.on("mouseover", updateMapPoints)
        .on("mousemove", updateMapPoints)
        .on("mouseout", resetMapPoints);

	// arcs.append("text")
	// 	.attr("transform", (d) => `translate(${arc.centroid(d)[0] - 25}, ${arc.centroid(d)[1] - 25}) rotate(90)`)
	// 	.text((d) => ((d.data[1].length / agesex.length) * 100).toFixed(1) + '%')
	// 	.on("mouseover", updateMapPoints)
    //     .on("mousemove", updateMapPoints)
    //     .on("mouseout", resetMapPoints);

}