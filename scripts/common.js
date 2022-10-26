const formatDate = (date) => date.toDateString().replaceAll(' ', '-');

async function loadFiles() {
    streets = await d3.json('./data/streets.json');
    pumps = await d3.csv('./data/pumps.csv');
    agesex = await d3.csv('./data/deaths_age_sex.csv');
    // days = await d3.csv('./data/deathdays.csv');
    days = await d3.csv('./data/deathdays.csv', (d) => {
        return { date: new Date(`${d.date}-1884`), deaths: +d.deaths };
    });

    var index = 0;

    days.map((item) => {
        var deaths = item.deaths;
        while (deaths > 0 && index < agesex.length) {
            agesex[index].date = item.date;

            deaths--;
            index++;
        }
    });
}

const resetMapPoints = () => {
    d3.selectAll(`.map-point`)
        .attr("r", 4)
        .attr('opacity', 1);

    hideTooltip();
}

const ages = d3
.scaleOrdinal()
.domain([0, 1, 2, 3, 4, 5])
.range(["0-10", "11-21", "21-40", "41-60", "61-80", ">80"]);

const tooltipDiv = d3.select(".content")
    .append("div")
    .attr("class", "tooltip").style("opacity", 0);

const showTooltip = (msg, x, y) => {
    tooltipDiv.html(msg)
        .style("left", `${x}px`)
        .style("top", `${y}px`)
        .transition().duration(200).style("opacity", 1);
};

const moveTooltip = (x, y) => {
    tooltipDiv
        .style("left", `${x}px`)
        .style("top", `${y}px`)
};

const hideTooltip = () => {
    tooltipDiv.transition().duration(500).style("opacity", 0);
}

const mapWidth = 600;
const mapHeight = 600;
const lineWidth = 500;
const lineHeight = 500;
const pieWidth = 300;
const pieHeight = 300;
const margin = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20
};

loadFiles().then(() => {
    drawStreetMap();
    drawLineChart();
    //drawPieChart();
    drawAgePie();
    drawSexPie();
});