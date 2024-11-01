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

// utilities script

// extension options array
const optionKeys = [
    //
    // worker.js
    'opt-search-ggdeals',
    'opt-search-steam',
    'opt-redeem-steam',
    'opt-redeem-gog',
    'opt-redeem-epic',
    //
    // steam-app.js
    'opt-steam-details',
    //
    // pcgamer.js
    'opt-pcgamer-steamicon',
    'opt-pcgamer-videos',
    //
    // development
    'opt-dev-mode'
];

// console logging
/**
 * Logs a message to the console with a formatted prefix.
 * @param {...*} message The content to be logged to the console.
 */
function writeLine() {
    console.log(
        `%c🔹elecord-extension `,
        'background: #000; color: #47c7ff',
        ...arguments
    );
};

// options retrieval
/**
 * Retrieves stored option values from browser storage using predefined `optionKeys`.
 * @param {function(Object): void} callback The retrieved options are passed as an object to the callback.
 */
function getOptions(callback) {
    chrome.storage.sync.get(optionKeys, (result) => {
        // create object to store option values dynamically
        const options = {};

        // iterate over keys and store values inside options object
        for (const key of optionKeys) {
            options[key] = result[key] || false;
        }

        // pass options object to callback
        callback(options);
    });
}
