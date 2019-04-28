init();

function init() {
    loadCSV();
    fetchData();
}

var data1 = [];
   var flag = true;
   function loadCSV(){
           d3.csv('word_bubble_data.csv', function(error, data) {
        if (error) throw error;
        //console.log(data[0])
        data.forEach(function(d){
         console.log("Hi")
             var dd = {"business_id": d.business_id, "stars": Number(d.stars), "keys": (d.keys), "dict":(d.dict)}
             data1.push(dd)});
      });

   };

   // function insertTitles(){
   //         var para = document.createElement("h2");                 // Create a <p> element
   //      para.innerHTML = "<center>NEIGHBORHOOD ANALYSIS</center>"
   //
   //      document.getElementById("neighborhood").append(para);
   //      var para = document.createElement("h2");                 // Create a <p> element
   //      para.innerHTML = "<center>RESTAURANT PERFORMANCE ANALYSIS</center>"
   //      document.getElementById("charts").append(para);
   //      var para1=document.createElement("h4");
   //
   //      para1.innerHTML = "<center><u>Sentiment Split across Customer Reviews</u></center>"
   //      document.getElementById("gauge").append(para1);
   //      var para1 = document.createElement("h2")
   //      para1.innerHTML = "<center>CUSTOMER SENTIMENT ANALYSIS</center>"//<br/><br/><p>Please Select the Star Rating to generate the word bubble.</p>"
   //      document.getElementById("sentiment").append(para1);
   //      var a = document.createElement("br")
   //      document.getElementById("sentiment").append(a);
   //      var a = document.createElement("br")
   //      document.getElementById("sentiment").append(a);
   //      var a = document.createElement("p");
   //      a.innerHTML = "Please Select the Star Rating to generate the word bubble."
   //      document.getElementById("sentiment").append(a);
   //     }

function fetchData() {
    d3.csv("restaurants.csv", function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
            d.Value = +d.Value;
        })
        restaurantData = data;
        createMap(restaurantData);
        createCuisinesChart(restaurantData);
        createCharts();

        var tornado_data = d3.json("word_semantic_strength_top10_New_2.json",function(error,tornado_data){
          tornado_data.forEach(function(d)
          {
            console.log("tornado")
            if (d["id"] == test)
            {

              var chart = createTornadoChart(test)
              console.log("Tornado")
              d3.select("#tornado")
              .datum(d["words"])
              .call(chart);
            }
          }
          );
        });
        createWordBubble("28hruDLwF_5s0QtDWH4rpg");
        drawGaugeChart("-0WegMt6Cy966qlDKhu6jA")

    });
};
var test;
/*Function to create the map*/
function createMap(data) {
    var restaurants = data;
    var map = L.map("map");
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
    map.setView([33.4225106, -111.936653], 15);
    var myRenderer = L.canvas({
        padding: 0.5
    });
    var circleOptions = {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }
    var geojsonMarkerOptions = {
        radius: 5,
        fillColor: "#FF8033",
        color: "#FAC3A2",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    };
    var circleCenter = [33.4225106, -111.936653];
    var circle = L.circle(circleCenter, 300, circleOptions);
    circle.addTo(map);
    var bounds = L.latLng(33.4225106, -111.936653).toBounds(300);
    var inRangeRestaurants = [],
        latlng_a = new L.LatLng(33.4225106, -111.936653),
        latlng_b;
    data.forEach(function(location) {
        latlng_b = new L.LatLng(location["latitude"], location["longitude"]);
        if (latlng_a.distanceTo(latlng_b) == 0) {
                    console.log(location["name"])
                    test = location["business_id"]
                    console.log(test)
        }
        if (latlng_a.distanceTo(latlng_b) < 300) {
            inRangeRestaurants.push(location);
        }
    });
    createRatingsChart(inRangeRestaurants);
    for (var i = 0; i < restaurants.length; i += 1) {

        L.circleMarker([restaurants[i]["latitude"], restaurants[i]["longitude"]], geojsonMarkerOptions).bindPopup(restaurants[i]["name"], {
            renderer: myRenderer,
            radius: 1
        }).addTo(map).bindPopup(restaurants[i]["name"]).on('click', function(e) {

            circle.setLatLng(e.latlng);
            inRangeRestaurants = [],
                latlng_a = new L.LatLng(e.latlng.lat, e.latlng.lng),
                latlng_b;
            data.forEach(function(location) {

                latlng_b = new L.LatLng(location["latitude"], location["longitude"]);
                if (latlng_a.distanceTo(latlng_b) == 0) {
                    console.log(location["name"])
                    test = location["business_id"]
                }
                if (latlng_a.distanceTo(latlng_b) < 300) {
                    inRangeRestaurants.push(location);
                }
            });
            d3.select(".chart").remove();
            d3.select(".cuisineChart").remove();
            d3.select(".checkins").remove();
            d3.select(".reviews").remove();
            d3.select(".rating").remove();
            d3.select(".ratings").remove();
            d3.select(".tornado").remove();

            //insertTitles();

            createRatingsChart(inRangeRestaurants);
            createCuisinesChart(inRangeRestaurants);
            createCharts();
            createWordBubble(test);
            drawGaugeChart(test);

            //Creating the tornado chart
            var tornado_data = d3.json("word_semantic_strength_top10_New_2.json",function(error,tornado_data){
              tornado_data.forEach(function(d)
              {
                console.log("tornado")
                if (d["id"] == test)
                {

                  var chart = createTornadoChart(test)
                  console.log("Tornado")
                  d3.select("#tornado")
                  .datum(d["words"])
                  .call(chart);
                }
              }
              );
            });

        });
    }
}

function createRatingsChart(data) {
    console.log(test)
    var ratingCount = [{
        "count": 0,
        "rating": 1
    }, {
        "count": 0,
        "rating": 1.5
    }, {
        "count": 0,
        "rating": 2
    }, {
        "count": 0,
        "rating": 2.5
    }, {
        "count": 0,
        "rating": 3
    }, {
        "count": 0,
        "rating": 3.5
    }, {
        "count": 0,
        "rating": 4
    }, {
        "count": 0,
        "rating": 4.5
    }, {
        "count": 0,
        "rating": 5
    }];
    data.forEach(function(d) {
        ratingCount.forEach(function(r) {
            if (r["rating"] == d["stars"]) {
                r["count"] += 1;
            }
        })
    });
    var margin = {top: 60, right: 20, bottom: 50, left: 70},
    width = 600,//960 - margin.left - margin.right,
    height = 380//500 - margin.top - margin.bottom;
    // set the ranges
    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);
    var svg = d3.select("#countRating").style("width", "60%").style("display", "inline").attr("float", "left").append("svg").attr("class", "chart").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x.domain(ratingCount.map(function(d) {
        return d.rating;
    }));
    y.domain([0, d3.max(ratingCount, function(d) {
        return d.count+5;
    })]);

    var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

    svg.selectAll(".bar").data(ratingCount).enter().append("rect").attr("class", "bar").attr("x", function(d) {
        return x(d.rating);
    }).attr("width", x.bandwidth()).attr("y", function(d) {
        return y(d.count);
    }).attr("height", function(d) {
        return height - y(d.count);
    })
    .on ("mouseover", function(d) {
            var matrix = this.getScreenCTM()
                .translate(+ this.getAttribute("x"), + this.getAttribute("y"));
            div.style("height", "20px")
            div.style("width", "60px")
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html("Count:" + d.count)
                .style("left", (window.pageXOffset + matrix.e) + "px")
                .style("top", (window.pageYOffset + matrix.f - 30) + "px");
            })
    .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top - 15) + ")")
      .style("text-anchor", "middle")
      .text("Star Ratings of Neighborhood Business");
    svg.append("g").call(d3.axisLeft(y));
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Count");
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("Distribution of Star ratings in Neighborhood Businesses");
}

function createCuisinesChart(data) {
    var top_cuisines = [{
        "name": 'Mexican',
        "count": 0
    }, {
        "name": 'Tacos',
        "count": 0
    }, {
        "name": 'Sushi',
        "count": 0
    }, {
        "name": 'Pizza',
        "count": 0
    }, {
        "name": 'Burgers',
        "count": 0
    }, {
        "name": 'Chinese',
        "count": 0
    }, {
        "name": 'Chicken',
        "count": 0
    }, {
        "name": 'Seafood',
        "count": 0
    }];
    top_cuisines.forEach(function(c) {
        data.forEach(function(d) {
            var each = new RegExp(c.name);
            var cuisines = d.categories;
            if (each.test(cuisines)) {
                c["count"] += 1
            }
        });
    });
    var margin = {top: 60, right: 35, bottom: 50, left: 70},
    width = 550//960 - margin.left - margin.right,
    height = 380//500 - margin.top - margin.bottom;
    var svg = d3.select("#cuisine").style("display", "inline").style("width", "50%").append("svg").attr("class", "cuisineChart").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleLinear().range([0, width]).domain([0, d3.max(top_cuisines, function(d) {
        return d.count+5;
    })]);
    var y = d3.scaleBand().rangeRound([0, height]).padding(0.1).domain(top_cuisines.map(function(d) {
        return d.name;
    }));
    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);
    var gy = svg.append("g").attr("class", "y axis").call(yAxis)
    var bars = svg.selectAll(".bar").data(top_cuisines).enter().append("g")
    //append rects
    bars.append("rect").attr("class", "bar").attr("y", function(d) {
        return y(d.name);
    }).attr("height", y.bandwidth()).attr("x", 0).attr("width", function(d) {
        return x(d.count);
    });
    bars.append("text").attr("class", "label").attr("y", function(d) {
        return y(d.name) + y.bandwidth() / 2 + 4;
    }).attr("x", function(d) {
        return x(d.count) + 3;
    }).text(function(d) {
        return d.count;
    });
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("Distribution of Neighboring Restaurants based on Cuisines");

}
function createCharts(){

d3.csv("ratings_and_reviews_yearwise.csv", function(data1) {
  var dat = [];
    data1.forEach(function(d) {
                    var player = d.business_id;

                    if (test == player) {
                      var parseDate = d3.timeParse("%Y");
                      var dd = {"year":parseDate(d.year.toString()), "rating": Number(d.stars), "reviews": Number(d.review_count)}
                      dat.push(dd);
    }
    });
    console.log(dat)
var margin = {top: 60, right: 20, bottom: 50, left: 70},
    width = 600//960 - margin.left - margin.right,
    height = 400//500 - margin.top - margin.bottom;

// The number of datapoints

// 5. X scale will use the index of our data
var xScale = d3.scaleTime()
    .rangeRound([0, width]); // output
xScale.domain(d3.extent(dat, function(d){ return d.year;}))
// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 5]) // input
    .range([height, 0]); // output

// 7. d3's line generator
var line = d3.line()
    .x(function(d) { return xScale(d.year); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.rating); }) // set the y values for the line generator
// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
// 1. Add the SVG to the page and employ #2
var svg = d3.select("#charts").append("svg").attr("class", "ratings").style("display", "inline")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year of Review");

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Rating");
     svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("Annual Average Rating of the Restaurant");


// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dat) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        // 12. Appends a circle for each datapoint
        svg.selectAll(".dot")
            .data(dat)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function(d) { return xScale(d.year) })
            .attr("cy", function(d) { return yScale(d.rating) })
            .attr("r", 5)
            .on("mouseover", function(d) {

              var matrix = this.getScreenCTM()
                        .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

              div.style("width","110px");
              div.style("height","20px");
              div.transition()
                        .duration(200)
                        .style("opacity", 1);
              div.html("Average Rating: " + Math.round(d.rating * 100) / 100)
                        .style("left", (window.pageXOffset + matrix.e - 55) + "px")
                        .style("top", (window.pageYOffset + matrix.f - 45) + "px");
              console.log(d.rating);
             d3.select(this).attr("r", 10)

            }).on("mouseout", function(d) {
              div.transition()
                        .duration(500)
                        .style("opacity", 0);
              d3.select(this).attr("r", 5)
            });

var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#charts").append("svg").attr("class", "reviews").style("display", "inline")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var parseDate = d3.timeParse("%Y");
// get the data
  // format the data
  // Scale the range of the data in the domains
  x.domain(dat.map(function(d) { return d.year; }));
  y.domain([0, d3.max(dat, function(d) { return d.reviews; })]);


      var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(dat)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.reviews); })
      .attr("height", function(d) { return height - y(d.reviews); })
      .on ("mouseover", function(d) {
            var matrix = this.getScreenCTM()
                .translate(+ this.getAttribute("x"), + this.getAttribute("y"));
            div.style("height", "20px")
            div.style("width", "60px")
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html("Count:" + d.reviews)
                .style("left", (window.pageXOffset + matrix.e) + "px")
                .style("top", (window.pageYOffset + matrix.f - 30) + "px");
            })
    .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

  // add the x Axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year of Review");

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));
svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 20 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Reviews");
  // add the y Axis
   svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("Annual Number of Reviews");
  svg.append("g")
      .call(d3.axisLeft(y));
  });

//d3.select("#charts").append("br").append("br");
// d3.csv("starwise_count.csv", function(data) {
//     var dat = []
//     data.forEach(function(d) {
//                     var player = d.business_id;
//                     if (test == player) {
//                       var da = {"stars":Number(d.stars), "count":Number(d.star_count)};
//                       dat.push(da)}});
//                       console.log(dat)
//                       dat.reverse();
//                       var margin = {top: 20, right: 20, bottom: 50, left: 70},
//     width = 600//960 - margin.left - margin.right,
//     height = 400//500 - margin.top - margin.bottom;
//     var svg = d3.select("#charts").append("svg").attr("class", "stars").style("display", "inline").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//     var x = d3.scaleLinear().range([0, width]).domain([0, d3.max(dat, function(d) {
//         return d.count+5;
//     })]);
//     var y = d3.scaleBand().rangeRound([0, height]).padding(0.1).domain(dat.map(function(d) {
//         return d.stars;
//     }));
//     var xAxis = d3.axisBottom().scale(x);
//     var yAxis = d3.axisLeft().scale(y);
//     var gy = svg.append("g").attr("class", "y axis").call(yAxis)
//     var bars = svg.selectAll(".bar").data(dat).enter().append("g")
//     //append rects
//     bars.append("rect").attr("class", "bar").attr("y", function(d) {
//         return y(d.stars);
//     }).attr("height", y.bandwidth()).attr("x", 0).attr("width", function(d) {
//         return x(d.count);
//     });
//     bars.append("text").attr("class", "label").attr("y", function(d) {
//         return y(d.stars) + y.bandwidth() / 2 + 4;
//     }).attr("x", function(d) {
//         return x(d.count) + 3;
//     }).text(function(d) {
//         return d.count;
//     });
// svg.append("text")
//         .attr("x", (width / 2))
//         .attr("y", 5 - (margin.top / 2))
//         .attr("text-anchor", "middle")
//         .style("font-size", "18px")
//         .style("text-decoration", "underline")
//         .text("Total number of reviews for each rating");
//                                           }
// );


d3.csv("final.csv", function(data) {
data.forEach(function(d) {
                var player = d.business_id;
                if (test == player) {
                  var dat = [{"weekday":"Monday", "checkins":Number(d.Monday)}, {"weekday":"Tuesday", "checkins":Number(d.Tuesday)},{"weekday":"Wednesday", "checkins":Number(d.Wednesday)},{"weekday":"Thursday", "checkins":Number(d.Thursday)},{"weekday":"Friday", "checkins": Number(d.Friday)}, {"weekday":"Saturday", "checkins":Number(d.Saturday)},{"weekday":"Sunday", "checkins":Number(d.Sunday)}]
                  console.log(dat)
                  var margin = {top: 60, right: 30, bottom: 50, left: 70},
width = 600//960 - margin.left - margin.right,
height = 400//500 - margin.top - margin.bottom;
                    var svg = d3.select("#charts").append("svg").attr("class", "checkins").style("display", "inline").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    var x = d3.scaleLinear().range([0, width]).domain([0, d3.max(dat, function(d) {
                        return d.checkins;
                    })]);
                    var y = d3.scaleBand().rangeRound([0, height]).padding(0.1).domain(dat.map(function(d) {
                        return d.weekday;
                    }));
                    var xAxis = d3.axisBottom().scale(x);
                    var yAxis = d3.axisLeft().scale(y);
                    var gy = svg.append("g").attr("class", "y axis").call(yAxis)
                    var bars = svg.selectAll(".bar").data(dat).enter().append("g")
                    //append rects
                    bars.append("rect").attr("class", "bar").attr("y", function(d) {
                        return y(d.weekday);
                    }).attr("height", y.bandwidth()).attr("x", 0).attr("width", function(d) {
                        return x(d.checkins);
                    });
                    bars.append("text").attr("class", "label").attr("y", function(d) {
                        return y(d.weekday) + y.bandwidth() / 2 + 4;
                    }).attr("x", function(d) {
                        return x(d.checkins) + 3;
                    }).text(function(d) {
                        return d.checkins;
                    });
                     svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 5 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("text-decoration", "underline")
    .text("Weekly Check-In Distribution");

            }

});});
}

// ************************* Tornado Chart *************************

function createTornadoChart(business_id) {

  //var margin = {top: 50, right: 30, bottom: 60, left: 200},
  var margin = {top: 20, right: 40, bottom: 50, left: 70},
   // width = 800 - margin.left - margin.right,
   // height = 600 - margin.top - margin.bottom;
    width = 1080 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
      .range([0, width]);

  var y = d3.scaleBand()
      .rangeRound([40, height])
      .padding(0.1)

  var xAxis = d3.axisBottom(x)
      .ticks(7);
      //.tickFormat(d3.format("d"))
      //.tickSubdivide(0);

  var yAxis = d3.axisRight(y)
      .tickSize(0)
      .tickValues([]);

  var svg = d3.select("body").select("#tornado").append("svg").attr("class", "tornado")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  function chart(selection) {
    selection.each(function(data) {

      x.domain(d3.extent(data, function(d) { return d.score; })).nice();
      //x.domain(d3.scaleLinear().domain([0,5]));
      //x.domain([-1,1]);
      y.domain(data.map(function(d) { return d.word; }));

      var minscore = Math.min.apply(Math, data.map(function(o){return o.score;}))
      yAxis.tickPadding(Math.abs(x(minscore) - x(0)) + 10);

      var bar = svg.selectAll(".bar")
          .data(data)

      bar.enter().append("rect")
          .attr("class", function(d) { return "bar bar--" + (d.score < 0 ? "negative" : "positive"); })
          .attr("x", function(d) { return x(Math.min(0, d.score)); })
          .attr("y", function(d) { return y(d.word); })
          .attr("width", function(d) { return Math.abs(x(d.score) - x(0)); })
          .attr("height", y.bandwidth())

      bar.enter().append('text')
          .attr("text-anchor", "middle")
          .attr("class", "label_text")
          .attr("x", function(d,i) {
              //console.log(x(Math.min(0, d.score)) + (Math.abs(x(d.score) - x(0)) / 2));
              return x(Math.min(0, d.score)) + (Math.abs(x(d.score) - x(0)) / 2);
          })
          .attr("y", function(d,i) {
              return y(d.word) + (y.bandwidth() / 2);
          })
          .attr("dy", ".35em")
          .text(function (d) { return d.word; });


      bar.enter().append('text')
          //.attr("text-anchor","start")
          .attr("class", "label_values")
          .attr("x", function(d,i){
            if (d.score > 0)
              return x(d.score) + 5;
            else
              return x(d.score) - 35; })
          .attr("y", function(d) {
            return y(d.word) + 12; })
          .attr("dy", ".35em")
          .attr("font-weight", "bold")
          .text(function(d){return Math.round(d.score * 100) / 100})


/*
      bar.enter().append('text')
          .attr("text-anchor","end")
          .attr("x", function(d,i){
            return x(d.score) + 5; })
          .attr("y", function(d) { return y(d.word) + 12; })
          .attr("dy", ".35em")
          .text(function(d){return Math.round(d.score * 100) / 100})
*/
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + x(0) + ",0)")
          .call(yAxis);
    });
    var axis_labels = svg.append('text')
          .attr("text-anchor","middle")
          .attr("class", "axis_labels")
          //.attr("font-weight", "bold")
          .attr("x", width/2)
          .attr("y", height + 40)
          .attr("dy", ".35em")
          .text("(-ve) Sentiment Strength (+ve)");


          var chart_heading = svg.append('text')
          .attr("class", "chart_heading")
          .attr("x", width/2)
          .attr("y", 0)
          //.attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .style("text-decoration", "underline")
          .text("Most Positive and Negative Characteristics of the Restaurant");
  }

  return chart;
}

// ************************* Tornado Chart *************************

// ************************* Gauge Chart *************************

function drawGaugeChart(business_id) {


  console.log("Gauge chart")
  var gaugeData = d3.csv("review_count_per_sentiment.csv", function(error, gaugeData) {

    var positive = 0;
    var negative = 0;
    var neutral = 0;

    gaugeData.forEach(function(d) {
      console.log("Checking")
      if (d.business_id === business_id) {
        console.log("Found")
        positive = parseInt(d.positive_review_count)
        negative = parseInt(d.negative_review_count)
        neutral = parseInt(d.neutral_review_count)
      }
    });

    total = positive + negative + neutral

    console.log(positive)
    var config1 = liquidFillGaugeDefaultSettings();
    config1.circleColor = "#34cbcb";
    config1.textColor = "#34cbcb";
    config1.waveTextColor = "#D2F3F3";
    config1.waveColor = "#34cbcb";
    config1.circleThickness = 0.1;
    config1.textVertPosition = 0.5;
    config1.waveAnimateTime = 0;
    var gauge1 = loadLiquidFillGauge("fillgauge2", (positive / total) * 100, config1);
    var config1 = liquidFillGaugeDefaultSettings();
    config1.circleColor = "#FF8080";
    config1.textColor = "#FF8080";
    config1.waveTextColor = "#FFDDDD";
    config1.waveColor = "#FF8080";
    config1.circleThickness = 0.1;
    config1.textVertPosition = 0.5;
    config1.waveAnimateTime = 0;
    var gauge2 = loadLiquidFillGauge("fillgauge4", (neutral / total) * 100, config1);
    var config2 = liquidFillGaugeDefaultSettings();
    config2.circleColor = "#C2C9D1";
    config2.textColor = "#C2C9D1";
    config2.waveTextColor = "#E3E8ED";
    config2.waveColor = "#C2C9D1";
    config2.circleThickness = 0.1;
    config2.textVertPosition = 0.5;
    config2.waveAnimateTime = 0;
    var gauge3 = loadLiquidFillGauge("fillgauge3", (negative / total) * 100, config2);

    function NewValue(){
        if(Math.random() > .5){
            return Math.round(Math.random()*100);
        } else {
            return (Math.random()*100).toFixed(1);
        }
    }
  });
};

function liquidFillGaugeDefaultSettings(){
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: false, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: false, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, config) {

    d3.select('.' + elementId).select("svg").remove();
    if(config == null) config = liquidFillGaugeDefaultSettings();


    var gauge = d3.select('.' + elementId).append("svg").attr("id", "#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scaleLinear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scaleLinear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    console.log(value)
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scaleLinear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scaleLinear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scaleLinear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scaleLinear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scaleLinear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scaleLinear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scaleLinear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .on("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease(d3.easeLinear)
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .on('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
            var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
            var waveRiseScale = d3.scaleLinear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scaleLinear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scaleLinear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                    .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease(d3.easeLinear)
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .on("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }

    return new GaugeUpdater();
}

// // ************************* Gauge Chart *************************


function createWordBubble(business_id){
    d3.select('.starts').remove();
    d3.select('.word-bubble').remove();
    d3.selectAll('.star.rating').remove();
    var tr = d3.select("#stars").append("div").attr("class","starts")
    for(var i = 1; i <=5; i++){
        tr.append("svg").attr("width", 25).attr("height", 25).attr("class","star rating").attr("data-rating",Number(i)).append("polygon").attr("points", "9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78").style("fill-rule","nonzero");
    };



    var rating = 2;
    //console.log(data1)
  var size = Math.min(Math.min(window.innerWidth, window.innerHeight), 600);
  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var chart = d3.select("#word-bubble")
    .append('svg').attr("class","word-bubble")
      .attr("width", size)
      .attr("height", size);

  var pack = d3.pack()
      .size([size, size])
      .padding(size*0.005);

  console.log(data1.size)
  console.log(test)
     data1.forEach(function(d){
          console.log("Check")
          var player = d.business_id
          var rat = d.stars
       if (test == player && rat == rating){
            console.log(d.keys)
            //console.log(d.dict)
            keys = JSON.parse(d.keys)
            counts = JSON.parse(d.dict)
            //console.log(counts)

               keys.sort(function(a,b) {
                 return counts[b] - counts[a];
               });

                //only keep words used 10 or more times
                keys = keys.filter(function(key) {
                 return counts[key] >= 5 ? key : '';
                });
               var root = d3.hierarchy({children: keys})
                   .sum(function(d) { console.log(d); return counts[d]; });


               var node = chart.selectAll(".node")
                 .data(pack(root).leaves())
                 .enter().append("g")
                   .attr("class", "node")
                   .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

               node.append("circle")
                   .attr("id", function(d) {
                    return d.data; })
                   .attr("r", function(d) { return d.r; })
                   .style("fill", function(d) { return color(d.data); });

               node.append("clipPath")
                   .attr("id", function(d) { return "clip-" + d.data; })
                 .append("use")
                   .attr("xlink:href", function(d) { return "#" + d.data; });

               node.append("text").attr("class", "bubbleText")
                   .attr("clip-path", function(d) { return "url(#clip-" + d.data + ")"; })
                 .append("tspan")
                   .attr("x", 0)
                   .attr("y", function(d) { return d.r/8; })
                   .attr("font-size", function(d) { return d.r/2; })
                   .text(function(d) { return d.data; });
                  node.append("text").attr("class", "bubbleText")
                   .attr("clip-path", function(d) { return "url(#clip-" + d.data + ")"; })
                 .append("tspan")
                   .attr("x", 0)
                   .attr("y", function(d) { return d.r/8+d.r/2; })
                   .attr("font-size", function(d) { return d.r/2; })
                   .text(function(d) { return counts[d.data]; });
       }


     });


  $('.star.rating').click(function(){
    d3.select(".word-bubble").remove();
    var rating = $(this).data('rating');
    $(this).parent().parent().attr('data-stars', $(this).data('rating'));
    var chart = d3.select("#word-bubble")
    .append('svg').attr("class","word-bubble")
      .attr("width", size)
      .attr("height", size);

  var pack = d3.pack()
      .size([size, size])
      .padding(size*0.005);
        console.log(data1[0])
    console.log(test)
    data1.forEach(function(d) {

       var player = d.business_id

       var rat = d.stars
       if (test == player && rat == rating){
            console.log(player)
            console.log(d.stars)


            keys = JSON.parse(d.keys)
            counts = JSON.parse(d.dict)
            console.log(counts)
            console.log(keys)




               keys.sort(function(a,b) {
                 return counts[b] - counts[a];
               });

                //only keep words used 10 or more times
                keys = keys.filter(function(key) {
                 return counts[key] >= 5 ? key : '';
                });
               var root = d3.hierarchy({children: keys})
                   .sum(function(d) { console.log(d); return counts[d]; });


               var node = chart.selectAll(".node")
                 .data(pack(root).leaves())
                 .enter().append("g")
                   .attr("class", "node")
                   .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

               node.append("circle")
                   .attr("id", function(d) { console.log(d); return d.data; })
                   .attr("r", function(d) { return d.r; })
                   .style("fill", function(d) { return color(d.data); });

               node.append("clipPath")
                   .attr("id", function(d) { return "clip-" + d.data; })
                 .append("use")
                   .attr("xlink:href", function(d) { return "#" + d.data; });

               node.append("text").attr("class", "bubbleText")
                   .attr("clip-path", function(d) { return "url(#clip-" + d.data + ")"; })
                 .append("tspan")
                   .attr("x", 0)
                   .attr("y", function(d) { return d.r/8; })
                   .attr("font-size", function(d) { return d.r/2; })
                   .text(function(d) { return d.data; });

              node.append("text").attr("class", "bubbleText")
                    .attr("clip-path", function(d) { return "url(#clip-" + d.data + ")"; })
                  .append("tspan")
                    .attr("x", 0)
                    .attr("y", function(d) { return d.r/8+d.r/2; })
                    .attr("font-size", function(d) { return d.r/2; })
                    .text(function(d) { return counts[d.data]; });
       };


   });
  });
}
