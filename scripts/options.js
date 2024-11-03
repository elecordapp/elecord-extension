/*
 * This file is licensed under the Affero General Public License (AGPL) version 3.
 *
 * Copyright (c) 2024 hazzuk
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * See the GNU Affero General Public License for more details:
 * <https://www.gnu.org/licenses/agpl-3.0.html>.
 */

// options script

// page content
{
    // display extension version
    document.getElementById("version").textContent = chrome.runtime.getManifest().version;
    // display extension description
    document.getElementById("description").textContent = chrome.runtime.getManifest().description;
}

// page logic
{
    document.addEventListener('DOMContentLoaded', () => {

        // display state of previously saved options
        chrome.storage.sync.get(optionKeys, (result) => {
            optionKeys.forEach(id => {
                const toggle = document.getElementById(id);
                if (toggle) {
                    // set toggle state based on stored preference
                    writeLine(`${id} loaded as ${result[id] ? 'enabled' : 'disabled'}`);
                    toggle.checked = result[id] || false;
                    // set dev-mode class when opt-dev-mode enabled
                    if (id === 'opt-dev-mode' && result[id]) {
                        const parent = toggle.parentElement.parentElement;
                        parent.classList.add('e-dev-mode--active');
                    }
                }
            });
        });

        // save changes made to options toggles
        optionKeys.forEach(id => {
            const toggle = document.getElementById(id);
            if (toggle) {
                // add change event listeners for each toggle
                toggle.addEventListener('change', () => {
                    // save updated toggle preference in chrome.storage
                    const update = {};
                    update[id] = toggle.checked;
                    chrome.storage.sync.set(update, () => {
                        writeLine(`${id} is now ${toggle.checked ? 'enabled' : 'disabled'}`);
                    });
                    // check dev-mode toggle
                    if (id === 'opt-dev-mode') {
                        const parent = toggle.parentElement.parentElement;
                        if (toggle.checked) {
                            parent.classList.add('e-dev-mode--active');
                        } else {
                            parent.classList.remove('e-dev-mode--active');
                        }
                    }
                });
            }
        });

        // on reload clicked, reload extension
        document.getElementById('reload').addEventListener('click', () => {
            chrome.runtime.reload();
        });

    });
}
