var imageArray = [];

var imageSize;
var squareChartGenerator = function (image_dimension) {
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
				left: 55,
				right: 28,
				top: 50,
				bottom: 40
			},
			width = (320 - margin.left - margin.right), // 240-10 => 480 min = 230px => 1min = .47px => 18 min = 18 x .47 =  8.47 px
			height = (320 - margin.top - margin.bottom); // 262.5

		var chartLabeling = {
			header_X: 35,
			header_Y: -25,
			left_AxisLine_X1: 0,
			left_AxisLine_Y1: -1,
			left_AxisLine_X2: 0,
			left_AxisLine_Y2: 211,
		};

		var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;


		var chart = d3.select(".chart")
			.attr("width", 320)
			.attr("height", 320)
			.append('g').attr('transform', 'translate(' + [margin.left, margin.top] + ')');
			
		var svg = d3.select("svg")
			svg.append('text')

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
				// .attr("stroke-width", 4.5)
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
				// style="fill: #000000; stroke: none; font-size: 48px;"
				// g.selectAll("line").style("stroke", "white");
				// g.selectAll("path").style("stroke", "white");
			    // g.selectAll("text").style("stroke", "none");
				g.selectAll("text").style("fill", "white");
				g.selectAll("text").style("font-size", textFontSize+'px');
				// g.selectAll("text").style("font-weight", "bold");
				g.selectAll("text").style("font-family", "Arial");
			}


			function customXAxis(g) {
				g.call(xAxis);
				g.select(".domain").remove();
				g.selectAll(".tick line").attr("stroke", "white").attr("stroke-width", 2);
				// g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#000").attr("stroke-width", 1.5);
				g.attr("transform", "translate(0,0)");
				// g.attr("transform", "translate(0," + height + ")");
				g.attr("transform", "translate(0," + 223 + ")");
				g.selectAll(".tick text").attr("y", 12).attr("dy", ".71em");
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
				// g.selectAll("text").style("stroke", "none");
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

			name = "s1_" + count + "_" + answer_task_1 + answer_task_2 + answer_task_3;

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

		// var svgString = getSVGString(d3.select("svg").node());

		//console.log(html);
		// var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
		var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
		var img = '<img src="' + imgsrc + '">';

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
		  
		  var canvas = createCanvas(320,320,true),
		  context = canvas.getContext("2d");

		// function setupCanvas(canvas) {
		// 	// Get the device pixel ratio, falling back to 1.
		// 	var dpr = window.devicePixelRatio || 1;
		// 	// Get the size of the canvas in CSS pixels.
		// 	var rect = canvas.getBoundingClientRect();
		// 	// Give the canvas pixel dimensions of their CSS
		// 	// size * the device pixel ratio.
		// 	canvas.width = rect.width * dpr;
		// 	canvas.height = rect.height * dpr;
		// 	var ctx = canvas.getContext('2d');
		// 	// Scale all drawing operations by the dpr, so you
		// 	// don't have to worry about the difference.
		// 	ctx.scale(dpr, dpr);
		// 	return ctx;
		//   }

		//   var context = setupCanvas(document.getElementById("canvas"));

		// var canvas = document.getElementById("canvas"),
		// 		context = canvas.getContext("2d");
				
		

		context.imageSmoothingEnabled = false;

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
	function scaleIt(source,scaleFactor){
		var c=document.createElement('canvas');
		var ctx=c.getContext('2d');
		var w=source.width*scaleFactor;
		var h=source.height*scaleFactor;
		c.width=w;
		c.height=h;
		ctx.drawImage(source,0,0,w,h);
		return(c);
	  }

	function sharpen(ctx, w, h, mix) {
		var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
			weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
			katet = Math.round(Math.sqrt(weights.length)),
			half = (katet * 0.5) | 0,
			dstData = ctx.createImageData(w, h),
			dstBuff = dstData.data,
			srcBuff = ctx.getImageData(0, 0, w, h).data,
			y = h;
	
		while (y--) {
			x = w;
			while (x--) {
				sy = y;
				sx = x;
				dstOff = (y * w + x) * 4;
				r = 0;
				g = 0;
				b = 0;
				a = 0;
	
				for (cy = 0; cy < katet; cy++) {
					for (cx = 0; cx < katet; cx++) {
						scy = sy + cy - half;
						scx = sx + cx - half;
	
						if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
							srcOff = (scy * w + scx) * 4;
							wt = weights[cy * katet + cx];
	
							r += srcBuff[srcOff] * wt;
							g += srcBuff[srcOff + 1] * wt;
							b += srcBuff[srcOff + 2] * wt;
							a += srcBuff[srcOff + 3] * wt;
						}
					}
				}
	
				dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
				dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
				dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
				dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
			}
		}
	
		ctx.putImageData(dstData, 0, 0);
	}

	// function resizeTo(canvas,pct){
	// 	var cw=canvas.width;
	// 	var ch=canvas.height;
	// 	tempCanvas.width=cw;
	// 	tempCanvas.height=ch;
	// 	tctx.drawImage(canvas,0,0);
	// 	canvas.width*=pct;
	// 	canvas.height*=pct;
	// 	var ctx=canvas.getContext('2d');
	// 	ctx.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);
	//   }


	function barChartLabeling(chart, chartLabeling) {

		chart.append("text")
			.attr("x", chartLabeling.header_X)
			.attr("y", chartLabeling.header_Y)
			.style("font-size", textFontSize+'px')
			.style("font-family", "Arial")
			// .attr("font-size", chartLabeling.headerFontSize+"px")
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