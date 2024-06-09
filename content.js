// Select all <a> elements on the page
const links = document.querySelectorAll('a');

// Iterate through each <a> element
links.forEach(link => {
    // Check if the href attribute contains the specified URL
    if (link.href.includes('https://store.steampowered.com/app/')) {
        // Add a class to highlight the link
        link.classList.add('highlight-steam-link');

        // Create an image element
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('steam-logo.png'); // Path to the Steam logo
        img.alt = 'Steam Logo';
        img.classList.add('steam-logo');

        // Insert the image before the link
        link.parentNode.insertBefore(img, link);
    }
});
