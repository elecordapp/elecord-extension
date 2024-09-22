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

// steam250 app content script

function main() {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/https:\/\/club\.steam250\.com\/app\/(\d+)/);

    if (match) {
        // use app ID from match capture group
        const appId = match[1];
        const newUrl = `https://store.steampowered.com/app/${appId}`;
        // redirect to the new URL
        window.location.replace(newUrl);
    }
}

// run script
{
    // check options
    getOptions((options) => {
        if (!options['opt-steam250-redirect']) {
            writeLine('Stop: Script disabled');
        } else {
            // run
            writeLine('Start: Content script');
            main();
        }
    });
}
