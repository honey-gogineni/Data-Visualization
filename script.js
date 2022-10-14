const width = 680;
const height = 680;

const margin = {
	left: 50,
	right: 20,
	top: 20,
	bottom: 40
};

async function loadFiles() {
	streets = await d3.json('./data/streets.json');
	pumps = await d3.csv('./data/pumps.csv');
	agesex = await d3.csv('./data/deaths_age_sex.csv');
	days = await d3.csv('./data/deathdays.csv');
}


loadFiles().then(() => {

	let mapsvg = d3
		.select("#map")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr('viewBox', [0, 0, width, height]);

	// SVG 1 - street map
	let xScale = d3.scaleLinear()
		.domain(d3.extent(streets.reduce((prev, curr) => prev.concat(curr), []), (d) => d.x))
		.range([margin.left, width - margin.right]);

	let yScale = d3.scaleLinear()
		.domain(d3.extent(streets.reduce((prev, curr) => prev.concat(curr), []), (d) => d.y))
		.range([height - margin.top, margin.bottom]);

	let line = d3.line()
		.x(d => xScale(d.x))
		.y(d => yScale(d.y));

	// making streets into groups
	let sg = mapsvg.append('g');

	// generating streets in the map
	streets.forEach(street => {
		sg.append('path')
			.datum(street)
			.attr('d', line)
			.attr('class', 'street');
	});

	// drawing street names
	const stName = [
		{ name: 'POLAND STREET', x: 347, y: 160, rotate: 68 },
		{ name: 'BROAD STREET', x: 378, y: 320, rotate: -28 },
		{ name: 'RUPERT STREET', x: 580, y: 525, rotate: -115 },
		{ name: 'REGENT STREET', x: 207, y: 350, rotate: 62 },
		{ name: 'CONDUIT STREET', x: 152, y: 400, rotate: -55 },
		{ name: 'OXFORD STREET', x: 307, y: 125, rotate: -12 },
		{ name: 'DEAN STREET', x: 550, y: 210, rotate: 67 },
		{ name: 'Brewery', x: 448, y: 330, rotate: -116 },
		{ name: 'Work', x: 325, y: 257, rotate: -28 },
		{ name: 'House', x: 330, y: 270, rotate: -28 },
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
		{ x: 439, y: 338, rotate: -116, w: 40, h: 19 },
		{ x: 322, y: 282, rotate: -116, w: 35, h: 50 },
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

	// // Plotting Landmarks - brewery and work house
	// 		const br = {x: 438, y: 337, rotate: -116, w: 41, h: 20};
	// 		const wh = {x: 322, y: 282, rotate: -116, w: 35, h: 50};

	// 		mapsvg.append('rect')
	// 			// .classed('work-house', true)
	// 			.attr('class', 'lmarks')
	// 			.attr('x', br.x)
	// 			.attr('y', br.y)
	// 			.attr("transform", `rotate(${br.rotate} ${br.x}, ${br.y})`)
	// 			.attr('width', br.w)
	// 			.attr('height', br.h)

	// 			mapsvg.append('rect')
	// 			// .classed('work-house', true)
	// 			.attr('class', 'lmarks')
	// 			.attr('x', wh.x)
	// 			.attr('y', wh.y)
	// 			.attr("transform", `rotate(${wh.rotate} ${wh.x}, ${wh.y})`)
	// 			.attr('width', wh.w)
	// 			.attr('height', wh.h)

	// // Plotting pumps
	// let pW = 6;
	// let pH = 6;
	// let pg = mapsvg.append('g');
	// pumps.forEach(pump => {
	// 	// let rect = d3.path().rect(pump.x, pump.y, pumpW, pumpH);
	// 	console.log
	// 	pg.append('rect')
	// 		.attr('x', xScale(pump.x) - (pW / 2))
	// 		.attr('y', yScale(pump.y) - (pH / 2))
	// 		.attr('width', pW)
	// 		.attr('height', pH)
	// 		.attr('class', 'lmarks');
	// });
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
	//.style("cursor", "pointer");

	// Collecting deaths data
	// 	let byAge = true;
	//     let byGender = false;
	//     let togglePlot = (event) => {
	// 	console.log(event.target.value)
	// 	if (event.target.value === 'age') {
	// 		byAge = true;
	// 		byGender = false;
	// 	} else {
	// 		byAge = false;
	// 		byGender = true;
	// 	}
	// }
	// Data
	// let mapPoints = agesex;
	// let dData = days;

	const genderColors = d3.scaleOrdinal()
		.domain([0, 1])
		.range(d3.schemeSet3);
	// const ageGroupColors = d3.scaleOrdinal()
	// 						.domain([0, 1, 2, 3, 4, 5])
	// 						  .range(d3.schemePaired);
	// let myColor = (d) => {
	// 	if (byAge) {
	// 		return ageGroupColors(d.age);
	// 	} else if (byGender) {
	// 		return genderColors(d.gender);
	// 	}
	// };
	// let mylegendColor = (d, type) => {
	// 	if (type === 'age') {
	// 		return ageGroupColors(d);
	// 	} else if (type === 'gender') {
	// 		return genderColors(d);
	// 	}
	// };

	// Plotting map points
	let mappg = mapsvg.append('g').classed('map-points', true);
	let drawPoints = () => {

		mappg.selectAll("circle")
			.data(agesex)
			.enter()
			.append("circle")
			.attr('stroke', 'black')
			.attr('stroke-width', 0.6)
			.attr("fill", d => genderColors(d.gender))
			.attr("cx", d => xScale(d.x))
			.attr("cy", d => yScale(d.y))
			.attr("r", 5)
			.classed('map-point', true);
		mappg.selectAll('.map-point').data(agesex).exit().remove();

	}
	drawPoints();

});