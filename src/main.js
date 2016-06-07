// Set debugmode to true and transactions/trades will be
// randomly generated, and no outside connections will be made.
var DEBUG_MODE = false;
if (window.location.search.indexOf('debug') >= 0) {
  DEBUG_MODE = true;
}

var DONATION_ADDRESS;
var SOUND_DONATION_ADDRESS;

var globalMute = false;

var instanceId = 0;
var pageDivId = "pageDiv";

var last_update = 0;

var updateTargets = [];

// Preload images
var bubbleImage = new Image();
bubbleImage.src = "images/bubble.png";
var blockImage = new Image();
blockImage.src = "images/block.png";

var debugSpawner;

var AUTOHIDE_TIMEOUT = 15000;
var autoHide = true;

var updateLayoutWidth = function() {
	$(".chartMask").css("visibility", "visible");
};

var updateLayoutHeight = function() {
	var newHeight = window.innerHeight;
	if ($("#header").css("display") != "none") newHeight -= $("#header").outerHeight();
	$("#pageSplitter").height(newHeight);
};

$(document).ready(function() {

	prevChartWidth = $("#pageSplitter").width() / 2;
	
	$("#chartCell").hide();
	
	DONATION_ADDRESS = $("#donationAddress").html();
	// Because the user has javascript running:
	$("#noJavascript").css("display", "none");

	// Initialize draggable vertical page splitter
	updateLayoutHeight();
	
	StatusBox.init(DEBUG_MODE);

	$(".clickSuppress").click(function() {
		$(".clickSuppress").parent().slideUp(300);
	});

	// Create a bubble spawner for testing
	debugSpawner = function() {
		// Generate some test bubbles
		if (Math.random() <= 0.1) {
			var r = Math.random();
			switch (true) {
				case r < 0.15:
					new SwapbotEvent({
						id: 1,
						event: {
							name: "swap.complete",
						    botName: "The official TOKENLY bot",
							state: "complete",
							assetIn: 'BTC',
							quantityIn: 0.002,
							assetOut: 'TOKENLY',
							quantityOut: Math.round(Math.random() * 100)
						}
					});
				break;
				case r < 0.30:
					new SwapbotEvent({
						id: 2,
						event: {
							name: "swap.new",
						    botName: "Public MERCHANT",
							state: "brandnew",
							assetIn: 'BITCRYSTALS',
							quantityIn: 48,
							assetOut: 'CYCLOPSCARDTNG',
							quantityOut: Math.round(Math.random() * 100)
						}
					});
				break;
			}
		}
	};
});

// Function for handling interface show/hide
var toggleInterface = function() {
	autoHide = false;

	if ($(".interface:hidden").length === 0) {
		$(".interface").fadeOut(500, updateLayoutHeight);
		$("#hideInterface").html("[ Show Interface ]");
		$("#hideInterface").css("opacity", "0.5");
	} else {
		$(".interface").fadeIn(500);
		$("#hideInterface").html("[ Hide Interface ]");
		$("#hideInterface").css("opacity", "1");
		updateLayoutHeight();
	}
};

var globalUpdate = function(time) {
	window.requestAnimationFrame(globalUpdate);
	var delta = time - last_update;
	last_update = time;
	for (var i = 0; i < updateTargets.length; i++) {
		updateTargets[i].update(delta);
	}
};

$(window).bind("load", function() {
	if (DEBUG_MODE) {
		setInterval(debugSpawner, 100);
	} else {
		if ($("#swapbotCheckBox").prop("checked"))
			SwapbotSocket.init();
	}

	window.requestAnimationFrame(globalUpdate);
	
	Sound.loadup();
	Sound.init();
});

var endResize = function() {
    $(".chartMask").css("visibility", "hidden");
	for (var i = 0; i < updateTargets.length; i++) {
		updateTargets[i].updateContainerSize();
	}
};

var hideChart = function() {
	$("#chartElement").hide();
	$("#showChart").show();
	prevChartWidth = $("#chartCell").width();
	$("#chartCell").width(0);
	$("#chartCell").hide();
	$("#pageSplitter").colResizable({
		disable: true
	});
};

var showChart = function() {
	$("#chartElement").show();
	$("#showChart").hide();
	$("#chartCell").width(prevChartWidth);
	$("#chartCell").show();
	$(window).trigger("resize");
	if ($("#bitcoinChart").length === 0) {
		// Load the iframe
		$("#chartHolder").html('<iframe id="bitcoinChart" scrolling="no" frameBorder="0" src="http://bitcoin.clarkmoody.com/widget/chart/zeroblock/"></iframe>');
	}
	$("#pageSplitter").colResizable({
		liveDrag: true,
		onDrag: updateLayoutWidth,
		onResize: endResize
	});
};

$(window).resize(function() {
    updateLayoutHeight();
});

window.onbeforeunload = function(e) {
	clearInterval(globalUpdate);
	SwapbotSocket.close();
};

setTimeout(function() {
	if (autoHide) {
		toggleInterface();
	}
}, AUTOHIDE_TIMEOUT);
