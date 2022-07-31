// set the dimensions and margins of the graph
var margin = {top: 10, right: 50, bottom: 90, left: 100},
    width = 1600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#f8f8ff")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "auto")
    .style("position", "absolute")
    .style("font-size", "13px")

 var mouseover = function(d) {
    var formatDecimal = d3.format(",.3f");
    var stateName = d.State;
    var rank = d.Rank
    var pop = d.Population
    tooltip
        .html("State: " + stateName
        + "<br>" + "Vaccination Rank: " + rank
        + "<br>" + "Total Population: " + pop
        )
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/asahoo-4/data_vis/main/VaccinationData.csv", function(data) {

    data.sort(function(b, a) {
        return a.Population - b.Population;
      });

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.State; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
var gY = svg.append("g")
    .attr('class', 'axis')
    .attr("transform","translate(-20,300)")
    .call(x)
    .append("text")
    .attr("fill", "black")//set the fill here
    .attr("transform","translate(-50,0)rotate(-90)")
    .text("Percentage Vaccinated");
var gX = svg.append("g")
    .attr('class', 'axis')
    .attr("transform","translate(740,570)")
    .call(x)
    .append("text")
    .attr("fill", "black")//set the fill here
    .attr("transform","translate(-50,0)")
    .text("States");
    
// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 50000000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.State); })
    .attr("width", x.bandwidth())
    .attr("fill", "#d93927")
    // no bar at the beginning thus:
    .attr("height", function(d) { return height - y(0); }) // always equal to 0
    .attr("y", function(d) { return y(0); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    

// Animation
svg.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function(d) { return y(d.Population); })
  .attr("height", function(d) { return height - y(d.Population); })
  .delay(function(d,i){console.log(i) ; return(i*100)})

})
