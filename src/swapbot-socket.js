
var DELAY_CAP = 250;


var SwapbotSocket = {};

SwapbotSocket.client = null;

SwapbotSocket.init = function () {
    console.log('SwapbotSocket.init');
    SwapbotSocket.client = SwapbotSocket.open();
};

SwapbotSocket.open = function () {

    var onSubscribedFn = function () {
        StatusBox.connected("swapbot");
    };

    var dataCallbackFn = function (data) {
        var event = data.event;
        console.log('heard data: ', data);
         setTimeout(function() {
             new SwapbotEvent(data);
         }, Math.random() * DELAY_CAP);
    };

    var client = SwapbotSocket.subscribeToPusherChanel('all_swapbot_events', dataCallbackFn, onSubscribedFn);
    return client;
};

SwapbotSocket.close = function (client) {
    StatusBox.closed("swapbot");

    if (SwapbotSocket.client !== null) {
        SwapbotSocket.client.disconnect();
        SwapbotSocket.client = null;
    }
    return;
};


// pusherURL, onSubscribedFn are optional
SwapbotSocket.subscribeToPusherChanel = function (channelName, dataCallbackFn, onSubscribedFn, pusherURL) {
    if (typeof pusherURL == 'undefined') { pusherURL = window.PUSHER_URL; }

    var client = new window.Faye.Client(pusherURL+"/public");
    var subscription = client.subscribe("/"+channelName, dataCallbackFn);


    if (typeof onSubscribedFn != 'undefined') {
        subscription.then(onSubscribedFn);
    }

    return client;
};
