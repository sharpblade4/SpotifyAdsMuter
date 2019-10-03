// ==UserScript==
// @name         SpotifyAdsMuter
// @version      0.2
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
const ENABLED_VOL_BAR_CLASS = "volume-bar";

var g_artificialMute = false;
var g_muteLastClassName = "";

function isAdBeingPlayed() {
    const nextButtons = jQuery('[title='+NEXT_TITLE+']');
    for (var i = 0; i < nextButtons.length; i++) {
        if (nextButtons[i].disabled) { // advertisement (if end of queue, it jumps to beginning)
            return true;
        }
    }
    return false;
}


function isMuteOn() {
    const unmuteButtons = jQuery('[aria-label='+UNMUTE_ARIA_LABEL+']');
    return (unmuteButtons.length == 0); // if unmute buttons are shown then mute is on
}


function applyArtificialMute() {
    const muteButtons = jQuery('[aria-label='+MUTE_ARIA_LABEL+']');
    for (var j = 0; j < muteButtons.length; j++) {
        muteButtons[j].click();
        g_artificialMute = true;
        g_muteLastClassName = muteButtons[j].className;
        return;
    }
}

function applyArtificialUnmute() {
    if (!isMuteOn()) { // already unmuted
        g_artificialMute = false;
    } else {
        const unmuteButtons = jQuery('[aria-label='+UNMUTE_ARIA_LABEL+']');
        for (var i = 0; i < unmuteButtons.length; i++) {
            unmuteButtons[i].parentElement.className = ENABLED_VOL_BAR_CLASS;
            unmuteButtons[i].click();
            unmuteButtons[i].setAttribute('aria-label', MUTE_ARIA_LABEL);
            unmuteButtons[i].className = g_muteLastClassName;
            return;
        }
    }
}

function executeAdsTestAndVolControl() {
    if (isAdBeingPlayed() && !isMuteOn()) {
        applyArtificialMute();
    } else if (g_artificialMute) { // no ad but artificially muted
        applyArtificialUnmute();
    }
}

setInterval(executeAdsTestAndVolControl, 500);
