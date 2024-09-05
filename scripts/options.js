/*
 * This file is licensed under the Affero General Public License (AGPL) version 3.
 *
 * Copyright (c) 2024 hazzuk. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * See the GNU Affero General Public License for more details:
 * <https://www.gnu.org/licenses/agpl-3.0.html>.
 */


// display extension version
document.getElementById("version").textContent = chrome.runtime.getManifest().version;
// display extension description
document.getElementById("description").textContent = chrome.runtime.getManifest().description;


// function to save the options to storage
function saveOptions() {
    // Get the values of the toggle boxes
    var optionGGDeals = document.getElementById("option-ggdeals").checked;
    var optionSteam = document.getElementById("option-steam").checked;

    // save the options to storage
    chrome.storage.sync.set({
        optionGGDeals: optionGGDeals,
        optionSteam: optionSteam
    }, function () {
        // update the context menus based on the options
        updateContextMenus({
            optionGGDeals: optionGGDeals,
            optionSteam: optionSteam
        });
    });
}

// function to restore the options from storage
function restoreOptions() {
    // set the values of the toggle boxes based on the options, applies defaults if not set
    chrome.storage.sync.get(["optionGGDeals", "optionSteam"], function (options) {
        document.getElementById("option-ggdeals").checked = options.optionGGDeals || true;
        document.getElementById("option-steam").checked = options.optionSteam || true;
    });
}

// function to update the context menus based on the options
function updateContextMenus(options) {
    // hide or show "menu-search-ggdeals" context menu
    chrome.contextMenus.update("menu-search-ggdeals", {
        visible: options.optionGGDeals
    });

    // hide or show "menu-search-steam" context menu
    chrome.contextMenus.update("menu-search-steam", {
        visible: options.optionSteam
    });

    // hide or show "menu-elecord" parent context menu
    if (!options.optionGGDeals && !options.optionSteam) {
        chrome.contextMenus.update("menu-elecord", {
            visible: false
        });
    } else {
        chrome.contextMenus.update("menu-elecord", {
            visible: true
        });
    }
}

// add event listener for when the options are changed
document.getElementById("option-ggdeals").addEventListener("change", saveOptions);
document.getElementById("option-steam").addEventListener("change", saveOptions);

// restore the options when the page is loaded
document.addEventListener("DOMContentLoaded", restoreOptions);

