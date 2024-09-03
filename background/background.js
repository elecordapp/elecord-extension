// background script

// context menu
{
    // remove all existing context menus
    chrome.contextMenus.removeAll();

    // create new context menu items

    // elecord
    chrome.contextMenus.create({
        id: "menu-elecord",
        title: "Elecord",
        contexts: ["all"]
    });

    {
        // search
        chrome.contextMenus.create({
            id: "menu-search",
            title: "🔎 Search '%s'",
            contexts: ["selection"],
            parentId: "menu-elecord"
        });

        {
            // gg.deals
            chrome.contextMenus.create({
                id: "menu-search-ggdeals",
                title: "🔥 gg.deals",
                contexts: ["selection"],
                parentId: "menu-search"
            });

            // steam
            chrome.contextMenus.create({
                id: "menu-search-steam",
                title: "🔵 Steam",
                contexts: ["selection"],
                parentId: "menu-search"
            });
        };

        // redeem
        chrome.contextMenus.create({
            id: "menu-redeem",
            title: "🔑 Redeem",
            contexts: ["all"],
            parentId: "menu-elecord"
        });

        {
            // steam
            chrome.contextMenus.create({
                id: "menu-redeem-steam",
                title: "🔵 Steam",
                contexts: ["all"],
                parentId: "menu-redeem"
            });

            // gog
            chrome.contextMenus.create({
                id: "menu-redeem-gog",
                title: "🟣 GOG",
                contexts: ["all"],
                parentId: "menu-redeem"
            });

            // epic
            chrome.contextMenus.create({
                id: "menu-redeem-epic",
                title: "⚪️ Epic",
                contexts: ["all"],
                parentId: "menu-redeem"
            });

            // // xbox
            // chrome.contextMenus.create({
            //     id: "menu-redeem-xbox",
            //     title: "🟢 Xbox",
            //     contexts: ["all"],
            //     parentId: "menu-redeem"
            // });

            // // ea
            // chrome.contextMenus.create({
            //     id: "menu-redeem-ea",
            //     title: "🔴 EA",
            //     contexts: ["all"],
            //     parentId: "menu-redeem"
            // });

            // // ubisoft
            // chrome.contextMenus.create({
            //     id: "menu-redeem-ubisoft",
            //     title: "🟡 Ubi",
            //     contexts: ["all"],
            //     parentId: "menu-redeem"
            // });
        };

    };
};


// event listeners
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
