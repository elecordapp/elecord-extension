// Function to save the options to storage
function saveOptions() {
    // Get the values of the toggle boxes
    var optionGGDeals = document.getElementById("option-ggdeals").checked;
    var optionSteam = document.getElementById("option-steam").checked;

    // Save the options to storage
    chrome.storage.sync.set({
        optionGGDeals: optionGGDeals,
        optionSteam: optionSteam
    }, function () {
        // Update the context menus based on the options
        updateContextMenus({
            optionGGDeals: optionGGDeals,
            optionSteam: optionSteam
        });
    });
}

// Function to restore the options from storage
function restoreOptions() {
    // Set the values of the toggle boxes based on the options, applies defaults if not set
    chrome.storage.sync.get(["optionGGDeals", "optionSteam"], function (options) {
        document.getElementById("option-ggdeals").checked = options.optionGGDeals || true;
        document.getElementById("option-steam").checked = options.optionSteam || true;
    });
}

// Function to update the context menus based on the options
function updateContextMenus(options) {
    // Hide or show "menu-search-ggdeals" context menu
    chrome.contextMenus.update("menu-search-ggdeals", {
        visible: options.optionGGDeals
    });

    // Hide or show "menu-search-steam" context menu
    chrome.contextMenus.update("menu-search-steam", {
        visible: options.optionSteam
    });

    // Hide or show "menu-elecord" parent context menu
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

// Add event listener for when the options are changed
document.getElementById("option-ggdeals").addEventListener("change", saveOptions);
document.getElementById("option-steam").addEventListener("change", saveOptions);

// Restore the options when the page is loaded
document.addEventListener("DOMContentLoaded", restoreOptions);
