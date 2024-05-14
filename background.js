chrome.contextMenus.create({
    id: "elecord",
    title: "Elecord",
    contexts: ["selection"]
});

chrome.contextMenus.create({
    id: "search-ggdeals",
    title: "🔎 Search gg.deals for '%s'",
    contexts: ["selection"], 
    parentId: "elecord"
});

chrome.contextMenus.create({
    id: "search-steam",
    title: "🔎 Search Steam for '%s'",
    contexts: ["selection"],
    parentId: "elecord"
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "search-ggdeals") {
        let url = `https://gg.deals/games/?view=list&title=${encodeURIComponent(info.selectionText)}`;
        chrome.tabs.create({ url: url });
    };
    if (info.menuItemId === "search-steam") {
        let url = `https://store.steampowered.com/search/?term=${encodeURIComponent(info.selectionText)}`;
        chrome.tabs.create({ url: url });
    };
});
