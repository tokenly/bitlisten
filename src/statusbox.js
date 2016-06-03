var CONNECTED = "Connected.";
var CONNECTING = "Connecting...";
var NO_SUPPORT = "No browser support.";
var CLOSED = "Click to connect.";

function StatusBox() {

}

StatusBox.init = function(debugmode) {
	StatusBox.swapbot = $("#swapbotStatus");

	if (debugmode) {
		StatusBox.swapbot.html("");
	}

	if ($("#swapbotCheckBox").is(":checked"))
		StatusBox.reconnecting("swapbot");
	else
		StatusBox.closed("swapbot");
};
StatusBox.connected = function(type) {
	if (type == "swapbot")
		StatusBox.swapbot.html('Events (Swapbot): <span style="color: green;">' + CONNECTED + '</span>');
};

StatusBox.reconnecting = function(type) {
	if (type == "swapbot")
		StatusBox.swapbot.html('Events (Swapbot): <span style="color: yellow;">' + CONNECTING + '</span>');
};

StatusBox.nosupport = function(type) {
	if (type == "swapbot")
		StatusBox.swapbot.html('Events (Swapbot): <span style="color: red;">' + NO_SUPPORT + '</span>');
};

StatusBox.closed = function(type) {
	if (type == "swapbot")
		StatusBox.swapbot.html('Events (Swapbot): <span style="color: gray;">' + CLOSED + '</span>');
};
