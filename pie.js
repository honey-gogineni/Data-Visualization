const pieSvgOne = d3
    .select("#second-pie")
    .append("svg")
    .attr("width", dimensions.pieWidth)
    .attr("height", dimensions.pieHeight);

  const pieSvgTwo = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", dimensions.pieWidth)
    .attr("height", dimensions.pieHeight);

  const ageArcGroups = d3.group(deaths_age_sex_data, (d) => +d.age);
  const sexArcGroup = d3.group(deaths_age_sex_data, (d) => +d.gender);

  const ageGroupContainer = pieSvgOne
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.pieWidth / 2}, ${dimensions.pieHeight / 2})`
    );

  pieSvgOne
    .append("text")
    .attr("x", dimensions.pieWidth / 2)
    .attr("y", margins.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .style("font-weight", "semi-bold")
    .text("Number of Deaths by Age Group");

  pieSvgTwo
    .append("text")
    .attr("x", dimensions.pieWidth / 2)
    .attr("y", margins.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .style("font-weight", "semi-bold")
    .text("Number of Deaths by Sex");

  const pie = d3
    .pie()
    .value((d) => d[1].length)
    .sort(null);

  const path = d3
    .arc()
    .outerRadius(dimensions.pieHeight / 2 - margins.top)
    .innerRadius(0);

  const ageArcs = ageGroupContainer
    .selectAll(".arcs")
    .data(pie(ageArcGroups))
    .enter()
    .append("g")
    .attr("class", "arcs");

  ageArcs
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => pieColors(d.data[0]))
    //opacity is set to 0 for all arcs except the one with the highest value
    .attr("opacity", 0.5)
    .attr("stroke", "#ddd")
    .attr("stroke-width", "0.5px")
    .style("cursor", "pointer")
    .on("mouseover", function (event, data) {
      hoverValue = data.data[0];
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", (d) => (hoverValue === +d.age ? 1 : 0));
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `Age Range: ${ages(data.data[0])}<br/>Percentage: ${
            (data.data[1].length / deaths_age_sex_data.length).toFixed(2) *
              100 +
            "%"
          }<br>No. of Deaths: ${data.data[1].length}`
        )
        .style("left", `${event.pageX - 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .style("border", "1px solid #8A0100")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "5px");
    })
    .on("mousemove", function (event, data) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
    })
    .on("mouseout", function (event) {
      hoverValue = "";
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  ageArcs
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "middle")
    .text((d) => ages(d.data[0]))
    .style("pointer-events", "none");

  const sexGroupContainer = pieSvgTwo
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.pieWidth / 2}, ${dimensions.pieHeight / 2})`
    );

  const sexArcs = sexGroupContainer
    .selectAll(".sex-arcs")
    .data(pie(sexArcGroup))
    .enter()
    .append("g")
    .attr("class", "sex-arcs");

  sexArcs
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      d.data[0] === 0
        ? mapLegendColorScale("Male")
        : mapLegendColorScale("Female")
    )
    .attr("opacity", 0.8)
    .attr("stroke", "#ddd")
    .attr("stroke-width", "0.5px")
    .style("cursor", "pointer")
    .on("mouseover", function (event, data) {
      hoverValue = data.data[0];
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", (d) => (hoverValue === +d.gender ? 1 : 0));
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `Sex: ${data.data[0] === 0 ? "Male" : "Female"}<br/>Deaths: ${
            data.data[1].length
          }`
        )
        .style("left", `${event.pageX - 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .style("border", "1px solid #8A0100")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "5px");
    })
    .on("mousemove", function (event, data) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
    })
    .on("mouseout", function (event) {
      hoverValue = "";
      d3.selectAll(".age-sex-circle")
        .transition()
        .duration(100)
        .attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  sexArcs
    .append("text")
    .attr(
      "transform",
      (d) => `translate(${path.centroid(d)[0]}, ${path.centroid(d)[1] - 25})`
    )
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "middle")
    .text((d) => (+d.data[0] === 0 ? "Male" : "Female"));

  sexArcs
    .append("text")
    .attr("transform", (d) => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "middle")
    .text(
      (d) =>
        Math.round((d.data[1].length / deaths_age_sex_data.length) * 100) + "%"
    )
    .style("pointer-events", "none");
