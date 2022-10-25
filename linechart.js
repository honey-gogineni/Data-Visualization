
// SVG 2: Line chart of deaths

function drawLineChart() {
	let linesvg = d3
		.select("#lines")
		.append("svg")
		.attr("width", lineWidth)
		.attr("height", lineHeight)
		.attr('viewBox', [0, 0, lineWidth, lineHeight]);

	let dline = days;
	let length = (path) => {
		return d3.create("svg:path").attr("d", path).node().getTotalLength();
	}

	// Drawing daily deaths
	let x = d3.scaleUtc()
		.domain(d3.extent(days, d => d.date))
		.range([margin.left, lineWidth - margin.right]);

	let y = d3.scaleLinear()
		.domain(d3.extent(days, d => d.deaths))
		.nice()
		.range([lineHeight - margin.bottom * 2, margin.top]);

	let line = d3.line()
		.curve(d3.curveCatmullRom)
		.x(d => x(d.date))
		.y(d => y(d.deaths))
	const l = length(line(days));

	let xAxis = g => g
		.attr("transform", `translate(0,${lineHeight - margin.bottom * 2})`)
		.call(d3.axisBottom(x).ticks(lineWidth / 80))
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick line").clone()
			.attr("y2", -lineHeight)
			.attr("stroke-opacity", 0.1))
		.call(g => g.append("text")
			.attr("x", lineWidth - 4)
			.attr("y", -4)
			.text(dline.date)
			.attr('class', 'linex')
		)

	let yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).ticks(null, "d"))
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick line").clone()
			.attr("x2", lineWidth)
			.attr("stroke-opacity", 0.1))
		.call(g => g.select(".tick:last-of-type text").clone()
			.attr("x", 4)
			.text(dline.deaths)
			.attr('class', 'liney')
		)

	const gx = linesvg.append('g')
		.call(xAxis);
	const gy = linesvg.append('g')
		.call(yAxis);
	let pathsg = linesvg.append('g');
	pathsg.append("path")
		.datum(dline)
		.attr('class', 'lineg')
		.attr("stroke-dasharray", `0,${l}`)
		.attr("d", line)
		.transition()
		.duration(1500)
		.ease(d3.easeLinear)
		.attr("stroke-dasharray", `${l},${l}`);
	let pointsg = linesvg.append('g');

	const updateMapPoints = (event, data) => {
		d3.selectAll('.timeline-point')
			.attr('opacity', 0.5);

		d3.select(`#timeline-${formatDate(data.date)}`)
			.attr("rx", 8)
			.attr("ry", 5)
			.attr('opacity', 1);

		d3.selectAll('.map-point')
			.attr('opacity', 0);

		d3.selectAll(`.map-point-${formatDate(data.date)}`)
			.attr("r", 6)
			.attr('opacity', 1);

		showTooltip(`Date: ${formatDate(data.date)} <br/>Deaths: ${data.deaths}`, event.pageX + 20, event.pageY - 20);
	}

	pointsg.append("g")
		.selectAll("ellipse")
		.data(dline)
		.join("ellipse")
		.attr('class', 'timeline-point')
		.attr("id", (d) => `timeline-${formatDate(d.date)}`)
		.attr("cx", d => x(d.date))
		.attr("cy", d => y(d.deaths))
		.attr("rx", 4)
		.attr("ry", 4)
		.on("mouseover", updateMapPoints)
		.on("mousemove", updateMapPoints)
		.on("mouseout", (event, data) => {
			resetMapPoints();

			d3.selectAll('.timeline-point')
				.attr("rx", 4)
				.attr("ry", 4)
				.attr('opacity', 1);
		});

}