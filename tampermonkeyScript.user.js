// ==UserScript==
// @name         SpotifyAdsMuter
// @version      0.6
// @description  mute sound during played ads in spotify
// @author       RonU
// @match        https://open.spotify.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-end
// ==/UserScript==

/* globals jQuery*/
'use strict';

const NEXT_TITLE = "Next";
const MUTE_ARIA_LABEL = "Mute";
const UNMUTE_ARIA_LABEL = "Unmute";
const UNIQUE_MUTE_BUTTON_ID = "SpotifyAdsMuter314159265358979323846264338";

var g_artificialMute = false;
var g_muteUnmuteParentBackup = null;

function isAdBeingPlayed() {
    const nextButtons = jQuery('[title='+NEXT_TITLE+']');
    for (var i = 0; i < nextButtons.length; i++) {
        if (nextButtons[i].disabled) { // advertisement (if end of queue, it jumps to beginning)
            console.log('ad identified'); // TODO delete
            return true;
        }
    }
    return false;
}

function injectMuteButtonID() {
    var muteUnmuteButtons = jQuery('[aria-label='+MUTE_ARIA_LABEL+']');
    if (muteUnmuteButtons.length == 0) {
        muteUnmuteButtons = jQuery('[aria-label='+UNMUTE_ARIA_LABEL+']');
    }
    muteUnmuteButtons[0].id = UNIQUE_MUTE_BUTTON_ID; // the first one is enough
    g_muteUnmuteParentBackup = muteUnmuteButtons[0].parentNode.cloneNode()
}


function isMuteOn() {
    const unmuteButtons = jQuery('[aria-label='+UNMUTE_ARIA_LABEL+']');
    return (unmuteButtons.length > 0); // if unmute buttons are shown then mute is on
}


function artificialButtonClick() {
    var muteUnmuteButton = jQuery('#'+UNIQUE_MUTE_BUTTON_ID);
    if (muteUnmuteButton.length == 0) {
        injectMuteButtonID();
        console.log('muteBtn injected'); // TODO delete
        muteUnmuteButton = jQuery('#'+UNIQUE_MUTE_BUTTON_ID);
    }
    muteUnmuteButton[0].click();
    muteUnmuteButton[0].parentNode = g_muteUnmuteParentBackup.cloneNode();
    g_artificialMute = !g_artificialMute;
}


function executeAdsTestAndVolControl() {
    if ((!isMuteOn() && isAdBeingPlayed()) || (g_artificialMute)) {
        // if ad is being played and unmuted, or no ad is being played but
        // spotify is artificially muted because of previous ad.
        artificialButtonClick();
        console.log('artificially clicked.'); // TODO delete
        jQuery('#'+UNIQUE_MUTE_BUTTON_ID)[0].disabled = false
        jQuery('#'+UNIQUE_MUTE_BUTTON_ID)[0].parentNode.className = "volume-bar"
    }
}


(function() {
    setTimeout(function(){
        injectMuteButtonID();
        console.log('muteBtn injected on load'); // TODO delete
    }, 10000);
})();

setInterval(executeAdsTestAndVolControl, 500);
