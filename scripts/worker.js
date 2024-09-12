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

// background script

// load utilities script directly
importScripts('utils.js');
writeLine('Running service worker');

// extension logic
{
    chrome.runtime.onInstalled.addListener(() => {
        // chrome.runtime.setUninstallURL('https://example.com/uninstall-survey');

        // set default options on first install
        chrome.storage.sync.get(null, (items) => {
            // check number of items in returned object is zero
            if (Object.keys(items).length === 0) {
                // set default options
                optionKeys.forEach((key) => {
                    chrome.storage.sync.set({ [key]: true });
                    chrome.storage.sync.set({ 'opt-dev-mode': false });
                });
            }
        });
    });
};

// commands logic
{
    // extension commands
    chrome.commands.onCommand.addListener((shortcut) => {
        // check options
        getOptions((options) => {
            if (options['opt-dev-mode']) {
                // 'reload' command
                if (shortcut === 'reload') {
                    writeLine('Reloading extension');
                    // reload extension
                    chrome.runtime.reload();
                }
            }
        });
    });
};

// context menu
{
    // create context menu
    {
        // remove all existing context menus
        chrome.contextMenus.removeAll();

        // create new context menu items
        getOptions((options) => {

            // elecord
            chrome.contextMenus.create({
                id: "menu-elecord",
                title: "Elecord",
                contexts: ["all"]
            });

            // submenus
            {
                // search
                if (options['opt-search-ggdeals'] || options['opt-search-steam']) {
                    chrome.contextMenus.create({
                        id: "menu-search",
                        title: "🔎 Search '%s'",
                        contexts: ["selection"],
                        parentId: "menu-elecord"
                    });
                    // gg.deals
                    if (options['opt-search-ggdeals']) {
                        chrome.contextMenus.create({
                            id: "menu-search-ggdeals",
                            title: "🔥 gg.deals",
                            contexts: ["selection"],
                            parentId: "menu-search"
                        });
                    }
                    // steam
                    if (options['opt-search-steam']) {
                        chrome.contextMenus.create({
                            id: "menu-search-steam",
                            title: "🔵 Steam",
                            contexts: ["selection"],
                            parentId: "menu-search"
                        });
                    }
                }

                // redeem
                if (options['opt-redeem-steam'] || options['opt-redeem-gog'] || options['opt-redeem-epic']) {
                    chrome.contextMenus.create({
                        id: "menu-redeem",
                        title: "🔑 Redeem",
                        contexts: ["all"],
                        parentId: "menu-elecord"
                    });
                    // steam
                    if (options['opt-redeem-steam']) {
                        chrome.contextMenus.create({
                            id: "menu-redeem-steam",
                            title: "🔵 Steam",
                            contexts: ["all"],
                            parentId: "menu-redeem"
                        });
                    }
                    // gog
                    if (options['opt-redeem-gog']) {
                        chrome.contextMenus.create({
                            id: "menu-redeem-gog",
                            title: "🟣 GOG",
                            contexts: ["all"],
                            parentId: "menu-redeem"
                        });
                    }
                    // epic
                    if (options['opt-redeem-epic']) {
                        chrome.contextMenus.create({
                            id: "menu-redeem-epic",
                            title: "⚪️ Epic",
                            contexts: ["all"],
                            parentId: "menu-redeem"
                        });
                    }
                    // // xbox
                    // if (options['opt-redeem-xbox']) {
                    // chrome.contextMenus.create({
                    //     id: "menu-redeem-xbox",
                    //     title: "🟢 Xbox",
                    //     contexts: ["all"],
                    //     parentId: "menu-redeem"
                    // });
                    // }

                    // // ea
                    // if (options['opt-redeem-ea']) {
                    // chrome.contextMenus.create({
                    //     id: "menu-redeem-ea",
                    //     title: "🔴 EA",
                    //     contexts: ["all"],
                    //     parentId: "menu-redeem"
                    // });
                    // }

                    // // ubisoft
                    // if (options['opt-redeem-ubisoft']) {
                    // chrome.contextMenus.create({
                    //     id: "menu-redeem-ubisoft",
                    //     title: "🟡 Ubi",
                    //     contexts: ["all"],
                    //     parentId: "menu-redeem"
                    // });
                    // }
                }
            };
        });
    };

    // context menu event listeners
    chrome.contextMenus.onClicked.addListener((info, tab) => {

        switch (info.menuItemId) {
            // search
            case "menu-search-ggdeals":
                encodeURL('https://gg.deals/games/?view=list&title=', info.selectionText);
                break;
            case "menu-search-steam":
                encodeURL('https://store.steampowered.com/search/?term=', info.selectionText);
                break;

            // redeem
            case "menu-redeem-steam":
                encodeURL('https://store.steampowered.com/account/registerkey?key=', info.selectionText);
                break;
            case "menu-redeem-gog":
                encodeURL('https://www.gog.com/en/redeem/', info.selectionText);
                break;
            case "menu-redeem-epic":
                encodeURL('https://store.epicgames.com/en-US/redeem?code=', info.selectionText);
                break;
        }

        /**
         * Encodes a given URL with an optional selection text and
         * creates a new tab with the resulting URL.
         *
         * @param {string} url The base URL to use.
         * @param {string} [selection] Optional selection text to encode and append.
         */
        function encodeURL(url, selection) {

            // encode url with or without selection
            let urlEncoded = url;
            if (selection) {
                urlEncoded = url + encodeURIComponent(selection);
            }

            // create new tab
            chrome.tabs.create({ url: urlEncoded });

        };

    });
};
