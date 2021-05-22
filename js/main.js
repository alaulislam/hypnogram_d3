function resetMessage() {
	$("#result").removeClass().text("");
	$("#card_result").removeClass("visible").addClass("invisible");
	$("#card_progress_bar").attr("style", "width: 0%")
}

function showError(text) {
	resetMessage();
	$("#result").addClass("alert alert-danger").text(text);
}
addImageDimensionScript = function (dimension) {
	var head = document.getElementsByTagName("head")[0],
		script = document.createElement('script');

	script.type = 'text/javascript'
	script.src = 'js/' + dimension + '.js'
	head.appendChild(script);
};

$(window).on('unload', function () {
	// executed if the user clicks "Reload this Page"
	$("#imageSize").val('default');
	// $("script[src='js/square.js']").remove();
	// $("script[src='js/wide.js']").remove();
	// $("script[src='js/square.js']").remove();

});
$(function () {
	$("#imageSize").change(function () {
		var selectedOption = $('option:selected', this).val();
		// alert(selectedOption);
		// alert( $('option:selected', this).text() );

		if (selectedOption === "square") {
			$("script[src='js/wide.js']").remove();
			$("script[src='js/tall.js']").remove();
		}
		if (selectedOption === "wide") {
			$("script[src='js/square.js']").remove();
			$("script[src='js/tall.js']").remove();
		}
		if (selectedOption === "tall") {
			$("script[src='js/square.js']").remove();
			$("script[src='js/wide.js']").remove();
		}
		
		addImageDimensionScript(selectedOption);
	});
});

$('#chart_generator').click(function (event) {
	event.preventDefault();
	resetMessage();
	var imageArraySquare = [];
	var imageArrayWide = [];
	var imageArrayTall = [];
	var imageSize;
	var image_dimension = $("#imageSize option:selected")[0].getAttribute("value");
	if (image_dimension === "default") {
		showError("Please select hypnogram dimensions from the Drop-Down");
		return;
	}
	if (image_dimension === "square") {
		// $("script[src='js/wide.js']").remove();
		// $("script[src='js/tall.js']").remove();
		var canvas = document.getElementsByTagName('canvas')[0];
		canvas.width = 320;
		canvas.height = 320;
		// canvas.style.width = 160 + 'px';
		// canvas.style.height = 160 + 'px';
		 squareChartGenerator(image_dimension,imageArraySquare);
	}
	if (image_dimension === "wide") {
		// $("script[src='js/square.js']").remove();
		// $("script[src='js/tall.js']").remove();
		var canvas = document.getElementsByTagName('canvas')[0];
		canvas.width = 320;
		canvas.height = 160;

		wideChartGenerator(image_dimension,imageArrayWide);
	}
	if (image_dimension === "tall") {
		// $("script[src='js/square.js']").remove();
		// $("script[src='js/wide.js']").remove();
		var canvas = document.getElementsByTagName('canvas')[0];
		canvas.width = 160;
		canvas.height = 320;

		tallChartGenerator(image_dimension, imageArrayTall);
	}

	$('#btn_download_main_div').removeClass('invisible').addClass('visible');
	var count = $("#photoCount_card").val();
	$('#card_main').removeClass('invisible').addClass('visible');
	$("#card_generation").empty();
	cardGeneration(image_dimension, count);
});

$('#btn_download_main, #btn_download_card').click(function (event) {
	event.preventDefault();
	downloadAsZip();
});
// var link = document.createElement('link');
// 		link.rel = 'stylesheet';
// 		link.type = 'text/css';
// 		link.href = 'http://fonts.googleapis.com/css?family=Vast+Shadow';
// 		document.getElementsByTagName('head')[0].appendChild(link);