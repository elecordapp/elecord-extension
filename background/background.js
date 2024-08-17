// Parent context menu
chrome.contextMenus.create({
    id: "menu-elecord",
    title: "Elecord",
    contexts: ["selection"]
});

// Submenus 1
chrome.contextMenus.create({
    id: "menu-search",
    title: "🔎 Search '%s'",
    contexts: ["selection"],
    parentId: "menu-elecord"
});

// Submenus 2
chrome.contextMenus.create({
    id: "menu-ggdeals",
    title: "🟣 gg.deals",
    contexts: ["selection"],
    parentId: "menu-search"
});

chrome.contextMenus.create({
    id: "menu-steam",
    title: "🔵 Steam",
    contexts: ["selection"],
    parentId: "menu-search"
});

// Event listeners
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "menu-ggdeals") {
        let url = `https://gg.deals/games/?view=list&title=${encodeURIComponent(info.selectionText)}`;
        chrome.tabs.create({ url: url });
    };
    if (info.menuItemId === "menu-steam") {
        let url = `https://store.steampowered.com/search/?term=${encodeURIComponent(info.selectionText)}`;
        chrome.tabs.create({ url: url });
    };
});
