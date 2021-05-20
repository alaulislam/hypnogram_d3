var imageArray = [];

var imageSize;
var tallChartGenerator = function (image_dimension) {
	var maxNBDataFile = 119;
	var count = 0;
	var textFontSize= 16;
	imageSize = image_dimension;

	$("#canvas_images").empty();
	$("#photoCount_card").val(maxNBDataFile + 1);

	iterateThroughAllDataFile();

	function iterateThroughAllDataFile() {
		for (i = count; i <= maxNBDataFile; i++) {
			var dataFileName = "/data/data_" + i + ".csv";
			console.log("dataFileName = " + dataFileName);

			generateHypnogram(dataFileName, imageSize);
		}
	}

	function generateHypnogram(datafile, imageSize) {

		var margin = {
				left: 50,
				right: 18,
				top: 50,
				bottom: 40
			},
			width = (160 - margin.left - margin.right), // 225
			height = (320 - margin.top - margin.bottom); // 262.5

		var chartLabeling = {
			header_X: -45,
			header_Y: -25,
			left_AxisLine_X1: 0,
			left_AxisLine_Y1: -1,
			left_AxisLine_X2: 0,
			left_AxisLine_Y2: 211,

		};

		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;


		var chart = d3.select(".chart")
			.attr("width", 160)
			.attr("height", 320)
			.append('g').attr('transform', 'translate(' + [margin.left, margin.top] + ')');
		// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		d3.csv(datafile, function (error, data) {

			if (error) console.log("Error: data not loaded!");
			// console.log(data);

			data.forEach(function (d) {
				d.date = parseDate(d.date);
				d.close = +d.close;
			});

			var xScale = d3.time.scale()
				.range([10, width])
				.domain(d3.extent(data, function (d) {
					return d.date;
				}));


			var yScale = d3.scale.linear()
				.range([0, height - 20])
				.domain([0, d3.max(data, function (d) {
					return d.close;
				})]);


			var xAxis = d3.svg.axis()
				.scale(xScale)
				.ticks(d3.time.hour, 1)
				.orient("bottom");
			// .tickSize([0, 0])

			var yAxis = d3.svg.axis().scale(yScale)
				.orient("left").ticks(5)
				.tickFormat(function (d) {
					if (d == 0) {
						return "Wake";
					} else if (d == 50) {
						return "REM";
					} else if (d == 100) {
						return "Light";
					} else if (d == 150) {
						return "Deep";
					} else {
						//provide some other format  
						return " ";
					}
				})
				.scale(yScale);


			barChartLabeling(chart, chartLabeling);

			chart.append("linearGradient")
				.attr("id", "line-gradient")
				.attr("gradientUnits", "userSpaceOnUse")
				.attr("x1", 0).attr("y1", yScale(0))
				.attr("x2", 0).attr("y2", yScale(150))
				.selectAll("stop")
				.data([{
						offset: "0%",
						color: "#b9515a"
					}, //Orange Coral
					// {offset: "40%", color: "red"},	
					{
						offset: "25%",
						color: "#6785d7"
					},
					// {offset: "62%", color: "black"},		
					{
						offset: "72%",
						color: "#969e4a"
					}, //frost
					{
						offset: "90%",
						color: "#9250a2"
					} //purple	
				])
				.enter().append("stop")
				.attr("offset", function (d) {
					return d.offset;
				})
				.attr("stop-color", function (d) {
					return d.color;
				});


			chart.append("path")
				.datum(data)
				.attr("fill", "none")
				// .attr("stroke", "steelblue")
				.attr("stroke", "url(#line-gradient)")
				.attr("stroke-width", 1.5)
				// .attr("d", line);
				.attr("d", d3.svg.line()
					.x(function (d) {
						return xScale(d.date);
					})
					.y(function (d) {
						return yScale(d.close);
					})
				);


			chart.selectAll("circle")
				.data(data)
				.enter()
				.append("rect")
				// .attr("stroke", "url(#line-gradient)" )
				.style("fill", "url(#line-gradient)")
				.attr("stroke-width", 4.5)
				.attr("x", function (d) {
					return xScale(d.date) - .75
				}) // position the left of the rectangle
				.attr("y", function (d) {
					return yScale(d.close) - 7.5
				})
				.attr("height", 15) // set the height
				.attr("width", 1.70); // set the width


			chart.append("g")
				.call(customYAxis);

			chart.append("g")
				.call(customXAxis);

			function customYAxis(g) {
				g.call(yAxis);
				// g.select(".domain").remove();
				g.selectAll(".tick line").attr("stroke", "white").attr("stroke-width", 2);
				// g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#000").attr("stroke-width", 1.5);
				g.selectAll(".tick text").attr("y", -6).attr("dy", ".71em");
				g.select(".domain").remove();
				g.selectAll("text").style("stroke", "none");
				g.selectAll("text").style("fill", "white");
				g.selectAll("text").style("font-size", textFontSize+'px');
				g.selectAll("text").style("font-family", "Arial");
			}


			function customXAxis(g) {
				g.call(xAxis);
				g.select(".domain").remove();
				g.selectAll(".tick line").attr("stroke", "white").attr("stroke-width", 2);
				// g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#000").attr("stroke-width", 1.5);
				g.attr("transform", "translate(0,0)");
				// g.attr("transform", "translate(0," + height + ")");
				g.attr("transform", "translate(0," + height + ")");
				g.selectAll(".tick text").attr("y", 10).attr("dy", ".71em");
				g.selectAll(".tick text").each(function (d, i) {
					// console.log(i);
					if (i === 1 || i === 2 || i === 3 || i === 5 || i === 6 || i === 7) {
						this.remove();
					}
					if (i === 0) {
						if (this.innerHTML == "10 PM") {
							this.innerHTML = "10pm";
						}
					}
					if (i === 4) {
						if (this.innerHTML == "02 AM") {
							this.innerHTML = "2am";
						}
					}
					if (i === 8) {
						if (this.innerHTML == "06 AM") {
							this.innerHTML = "6am";
						}
					}
				});
				g.selectAll(".tick line").each(function (d, i) {
					// console.log(i);
					if (i === 1 || i === 2 || i === 3 || i === 5 || i === 6 || i === 7) {
						// console.log(this);
						// console.log(this.getAttribute('stroke'));
						this.setAttribute('stroke', 'gray');
					}
				});
				g.selectAll("text").style("stroke", "none");
				g.selectAll("text").style("fill", "white");
				g.selectAll("text").style("font-size", textFontSize+'px');
				g.selectAll("text").style("font-family", "Arial");

			}


			var answer_task_1 = '';
			var answer_task_2 = '';
			var answer_task_3 = '';

			var lastDigit = count % 10;
			if (lastDigit >= 0 && lastDigit < 5) {
				answer_task_1 = 't1r'; //  left
			} else {
				answer_task_1 = 't1l'; // right
			}

			if ((count < 20) || (count > 39 && count < 60) || (count > 79 && count < 100)) {
				answer_task_2 = 't2r';
			} else {
				answer_task_2 = 't2l';
			}

			if (count < 10 || (count > 19 && count < 30) || (count > 39 && count < 50) || (count > 59 && count < 70) || (count > 79 && count < 90) || (count > 99 && count < 110)) {
				answer_task_3 = 't3l';
			} else {
				answer_task_3 = 't3r';
			}

			name = "s3_" + count + "_" + answer_task_1 + answer_task_2 + answer_task_3;

			savePNG(name, count);

			chart.selectAll("*").remove();
			count++;
		});


	}


	function savePNG(name, count) {
		var html = d3.select("svg")
			.attr("version", 1.1)
			.attr("xmlns", "http://www.w3.org/2000/svg")
			.node().parentNode.innerHTML;

		var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);


		// var canvas = document.getElementById("canvas"),
		// 	context = canvas.getContext("2d");
		var canvas = createCanvas(160,320,true),
		context = canvas.getContext("2d");

		var image = new Image;
		image.src = imgsrc;
		image.onload = function () {
			context.drawImage(image, 0, 0);

			var canvasdata = canvas.toDataURL("image/png");

			var a = document.createElement("a");
			a.download = name + ".png";
			a.href = canvasdata;
			//a.click();
			galleryGenerator(canvasdata, a.download, imageSize, count);
			imageArray.push(a);
		};

	}

	function createCanvas(width, height, set2dTransform = true) {
		// const ratio = Math.ceil(window.devicePixelRatio);
		const ratio = 1;
		const canvas = document.createElement('canvas');
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		if (set2dTransform) {
		  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
		}
		return canvas;
	  }
	function barChartLabeling(chart, chartLabeling) {

		chart.append("text")
		.attr("x", chartLabeling.header_X)
		.attr("y", chartLabeling.header_Y)
		.style("font-size", textFontSize+'px')
		.style("font-family", "Arial")
		.style('fill', 'white')
		.text("8 hours sleep phases");


		chart.append("line")
			.style("stroke", "white")
			.attr("stroke-width", 2)
			.attr("x1", chartLabeling.left_AxisLine_X1)
			.attr("y1", chartLabeling.left_AxisLine_Y1)
			.attr("x2", chartLabeling.left_AxisLine_X2)
			.attr("y2", chartLabeling.left_AxisLine_Y2);


	}


}