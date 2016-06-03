/** 
 *  @constructor
 *  @extends Floatable
 */
function SwapbotEvent(eventData) {
    if (!isValidSwapbotEvent(eventData)) { return; }

    var swapData = extractDetailsFromSwapbotEvent(eventData.event);
    // console.log('swapData', swapData);

    if (document.visibilityState === "visible") {
        Floatable.call(this);

        this.area = Math.min(swapData.normalizedQuantity, 50) * 500 + 9000;
        this.width = this.height = Math.sqrt(this.area / Math.PI) * 2;

        this.addImage(bubbleImage, this.width, this.height);
    
        var msgString;
        msgString = swapData.name+'<br />'+swapData.line1;

        if (typeof swapData.line2 != 'undefined' && swapData.line2.length > 0) {
            msgString += '<br />'+swapData.line2;
        }

        this.addText(msgString);

        this.initPosition();
    }

    // Sound
    var maxPitch = 100.0;
    var maxBitcoins = 1000;
    var minVolume = 0.3;
    var maxVolume = 0.7;
    var volume = (swapData.pitch / maxPitch) * (maxVolume - minVolume) + minVolume;
    if (volume > maxVolume)
        volume = maxVolume;
    
    // We need to use a log that makes it so that maxBitcoins reaches the maximum pitch.
    // Well, the opposite of the maximum pitch. Anyway. So we solve:
    // maxPitch = log(maxBitcoins + logUsed) / log(logUsed)
    // For maxPitch = 100 (for 100%) and maxBitcoins = 1000, that gives us...
    var logUsed = 1.0715307808111486871978099;
    // So we find the smallest value between log(swapData.pitch + logUsed) / log(logUsed) and our max pitch...
    var pitch = Math.min(maxPitch, Math.log(swapData.pitch + logUsed) / Math.log(logUsed));
    // ...we invert it so that a bigger transaction = a deeper noise...
    pitch = maxPitch - pitch;
    // ...and we play the sound!
    if(globalScalePitch) {
        // console.log('swapData.pitch: '+swapData.pitch+' playPitchAtVolume(v:'+volume+', p:'+pitch+')');
        Sound.playPitchAtVolume(volume, pitch);
    } else {
        Sound.playRandomAtVolume(volume);
    }
}

function isValidSwapbotEvent(eventData) {
    return true;
}

function extractDetailsFromSwapbotEvent(event) {
    var MAX = 1000;
    var NEW_SPREAD = 800;

    if (event.name == "swap.stateChange" && event.state == 'complete') {
        return {
            name: "Swap Complete",
            normalizedQuantity: event.quantityOut,
            pitch: 10 - Math.round((Math.min(event.quantityOut, 100) / 100) * 10),
            line1: '' + roundSwapQuantity(event.quantityIn) + ' ' + swapbotTruncate(event.assetIn),
            line2: '' + roundSwapQuantity(event.quantityOut) + ' ' + swapbotTruncate(event.assetOut),
        };
    }

    if (event.name == 'swap.new') {
        return {
            name: "New Swap",
            normalizedQuantity: event.quantityOut,
            pitch: (MAX-NEW_SPREAD) + Math.round( (Math.min(event.quantityOut, 100) / 100) * NEW_SPREAD),
            line1: '' + roundSwapQuantity(event.quantityIn) + ' ' + swapbotTruncate(event.assetIn),
            line2: '' + roundSwapQuantity(event.quantityOut) + ' ' + swapbotTruncate(event.assetOut),
        };
    }
}

function roundSwapQuantity(qIn) {
    var isInt = Math.round(qIn * 1000) == (Math.round(qIn) * 1000);
    if (isInt) { return Math.round(qIn); }
    
    return qIn.toFixed(3);
}

function swapbotTruncate(tIn, len) {
    if (typeof len == 'undefined') { len =  12; }
    if (tIn.length > len + 1) {
        return tIn.substr(0, len-1)+'&hellip;';
    }
    return tIn;
}

extend(Floatable, SwapbotEvent);
