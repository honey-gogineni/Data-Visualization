const scale = 1;

const width = 680 * scale;
const height = 680 * scale;

const margin = {
	left: 50 * scale,
	right: 20 * scale,
	top: 20 * scale,
	bottom: 40 * scale
};


async function loadFiles() {
	streets = await d3.json('./data/streets.json');
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
		{name: 'CEORCE STREET', x: 86, y: 281, rotate: -72},
		{name: 'BREWER STREET', x: 275, y: 160, rotate: 43},
		{name: 'REGENT STREET', x: 207, y: 350, rotate: 62},
		{name: 'OXFORD STREET', x: 162, y: 156, rotate:-13},
		{name: 'DEAN STREET', x: 350, y: 375, rotate:-66},
	];
	let stnameg = mapsvg.append('g').attr('class', 'streets');

	stnameg.selectAll('.street-name')
			.data(stName)
			  .enter()
			.append('text')
			.attr('font-size', '10')
			  .classed('street-name', true)
			  .attr('x', d => d.x)
			.attr('y', d => d.y)
			.attr('transform', d =>  `rotate(${d.rotate} ${d.x}, ${d.y})`)
		   //.attr("transform", function(d) { return "translate(" + d.x+"," +d.y ")"; })
			   // .attr("dy", ".35em")
		//.text("ddddddddd");
			   .text(d => d.name);
});