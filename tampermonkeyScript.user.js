// ==UserScript==
// @name         SpotifyAdsMuter
// @version      0.1
// @description  mute sound during played ads in spotify
// @author       RonU
// @match        https://open.spotify.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

/* globals jQuery*/
'use strict';

const NEXT_TITLE = "Next";
const MUTE_ARIA_LABEL = "Mute";
const UNMUTE_ARIA_LABEL = "Unmute";

var g_artificialMute = false;


function isAdBeingPlayed() {
    const nextButtons = jQuery('[title='+NEXT_TITLE+']');
    for (var i = 0; i < nextButtons.length; i++) {
        if (nextButtons[i].disabled) { // advertisement (if end of queue, it jumps to beginning)
            return true;
        }
    }
    return false;
}


function applyArtificialMute() {
    const muteButtons = jQuery('[aria-label='+MUTE_ARIA_LABEL+']');
    for (var j = 0; j < muteButtons.length; j++) {
        muteButtons[j].click();
        g_artificialMute = true;
        return;
    }
}

function applyArtificialUnmute() {
    const unmuteButtons = jQuery('[aria-label='+UNMUTE_ARIA_LABEL+']');
    for (var i = 0; i < unmuteButtons.length; i++) {
        unmuteButtons[i].click();
        g_artificialMute = false;
        return;
    }
}

function executeAdsTestAndVolControl() {
    if (isAdBeingPlayed()) {
        applyArtificialMute();
    } else if (g_artificialMute) { // no ad but artificially muted
        applyArtificialUnmute();
    }
}

setInterval(executeAdsTestAndVolControl, 500);
