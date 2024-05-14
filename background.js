// Parent context menu
chrome.contextMenus.create({
    id: "menu-elecord",
    title: "Elecord",
    contexts: ["selection"]
});

// Child context menus
chrome.contextMenus.create({
    id: "menu-ggdeals",
    title: "🔎 Search gg.deals for '%s'",
    contexts: ["selection"],
    parentId: "menu-elecord"
});

chrome.contextMenus.create({
    id: "menu-steam",
    title: "🔎 Search Steam for '%s'",
    contexts: ["selection"],
    parentId: "menu-elecord"
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
