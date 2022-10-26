function drawStreetMap() {
	let mapsvg = d3
		.select("#map")
		.append("svg")
		.attr("width", mapWidth)
		.attr("height", mapHeight)
		.attr('viewBox', [0, 0, mapWidth, mapHeight]);

	// SVG 1 - street map
	let xScale = d3.scaleLinear()
		.domain(d3.extent(streets.reduce((prev, curr) => prev.concat(curr), []), (d) => d.x))
		.range([margin.left, mapWidth - margin.right]);

	let yScale = d3.scaleLinear()
		.domain(d3.extent(streets.reduce((prev, curr) => prev.concat(curr), []), (d) => d.y))
		.range([mapHeight - margin.top, margin.bottom]);

	let lineM = d3.line()
		.x(d => xScale(d.x))
		.y(d => yScale(d.y));

	// making streets into groups
	let sg = mapsvg.append('g');

	// generating streets in the map
	streets.forEach(street => {
		sg.append('path')
			.datum(street)
			.attr('d', lineM)
			.attr('class', 'street');
	});

	// drawing street names
	const stName = [
		{ name: 'POLAND STREET', x: 293, y: 120, rotate: 70 },
		{ name: 'RUPERT STREET', x: 521, y: 487, rotate: -117 },
		{ name: 'REGENT STREET', x: 165, y: 300, rotate: 62 },
		{ name: 'CONDUIT STREET', x: 112, y: 349, rotate: -55 },
		{ name: 'OXFORD STREET', x: 254, y: 96, rotate: -11 },
		{ name: 'DEAN STREET', x: 510, y: 245, rotate: 67 },
		{ name: 'Brewery', x: 385, y: 290, rotate: -116 },
		{ name: 'Work', x: 275, y: 205, rotate: -28 },
		{ name: 'House', x: 275, y: 218, rotate: -28 },
	];
	let stnameg = mapsvg.append('g');//.attr('class', 'streets');

	stnameg.selectAll('.stname')
		.data(stName)
		.enter()
		.append('text')
		.attr('class', 'stnames')
		// .classed('street-name', true)
		.attr('x', d => d.x)
		.attr('y', d => d.y)
		.attr('transform', d => `rotate(${d.rotate} ${d.x}, ${d.y})`)
		.text(d => d.name);

	// Plotting Landmarks - brewery and work house
	const landmarks = [
		//brewery
		{ x: 375, y: 300, rotate: -116, w: 45, h: 22 },
		//work house
		{ x: 270, y: 230, rotate: -116, w: 35, h: 45 },
	];

	let lmarksg = mapsvg.append('g');

	lmarksg.selectAll('.lmarks')
		.data(landmarks)
		.enter()
		.append('rect')
		.attr('class', 'lmarks')
		.attr('x', d => d.x)
		.attr('y', d => d.y)
		.attr("transform", (d) => `rotate(${d.rotate} ${d.x}, ${d.y})`)
		.attr('width', d => d.w)
		.attr('height', d => d.h)


	// Plotting pumps
	let pumpg = mapsvg.append('g');

	pumpg.selectAll(".pump")
		.data(pumps)
		.enter()
		.append("ellipse")
		.attr('class', 'pumps')
		.attr("cx", (d) => xScale(d.x))
		.attr("cy", (d) => yScale(d.y))
		.attr("rx", 8)
		.attr("ry", 3)

	const genderColors = d3.scaleOrdinal()
		.domain([0, 1])
		.range(['blue', 'magenta']);

	// Plotting map points
	let mappg = mapsvg.append('g').classed('map-points', true);
	let drawPoints = () => {

		mappg.selectAll("circle")
			.data(agesex)
			.enter()
			.append("circle")
			.attr("fill", d => genderColors(+d.gender))
			.attr("cx", d => xScale(d.x))
			.attr("cy", d => yScale(d.y))
			.attr("r", 4)
			.attr('class', (d) => `map-point map-point-${formatDate(d.date)} map-point-${+d.gender === 0 ? 'male' : 'female'} age-${+d.age}`)
			.on("mouseover", (event, data) => {
				showTooltip(`Date: ${formatDate(data.date)}<br/>Gender: ${+data.gender === 0 ? 'Male' : 'Female'}<br/>Age: ${ages(+data.age)}`,
					event.pageX + 20, event.pageY - 20);
			})
			.on("mousemove", (event, data) => {
				moveTooltip(event.pageX + 20, event.pageY - 20);
			})
			.on("mouseout", (event, data) => {
				hideTooltip();
			});
		mappg.selectAll('.map-point').data(agesex).exit().remove();
	}
	drawPoints();
}