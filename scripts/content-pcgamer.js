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

// pcgamer.com content script


// (Highlight Steam links inside articles)

// Select all <a> elements on the page
const links = document.querySelectorAll('a');

// Iterate through each <a> element
links.forEach(link => {
    // Check if the href attribute contains the specified URL
    if (link.href.includes('https://store.steampowered.com/app/')) {
        // Add this class to highlight the link
        link.classList.add('highlight-steam-link');

        // Create an image element for the Steam logo
        const steamLogo = document.createElement('img');
        steamLogo.src = chrome.runtime.getURL('media/steam/logo.png'); // Path to the Steam logo
        steamLogo.alt = 'Steam Logo';
        steamLogo.classList.add('steam-logo');

        // Insert the image inside the link
        link.insertBefore(steamLogo, link.firstChild);
    }
});

// (Replace article videos with images)

function replaceElementWithOgImage() {
    // Select pcgamer custom videos (doesn't include youtube videos)
    const targetElement = document.querySelector('#article-body > div.jwplayer__widthsetter');

    // If the target element exists
    if (targetElement) {
        console.log('Target element found:', targetElement);

        // Select the article og:image meta tag
        const ogImageMetaTag = document.querySelector('meta[property="og:image"]');

        // If the og:image meta tag exists
        if (ogImageMetaTag) {
            const ogImageUrl = ogImageMetaTag.getAttribute('content');
            console.log('og:image URL:', ogImageUrl);

            // Create a new div element
            const heroDiv = document.createElement('div');
            heroDiv.classList.add('box', 'less-space', 'hero-image-wrapper'); // Add classes

            // Create a new image element
            const articleImg = document.createElement('img');
            articleImg.src = ogImageUrl;
            articleImg.alt = 'Article Image';
            articleImg.style.width = '100%'; // Set appropriate styles
            articleImg.style.height = 'auto';

            // Create a figcaption element
            const figCaption = document.createElement('figcaption');
            figCaption.setAttribute('itemprop', 'caption description');

            // Create a span element for image credit
            const spanCredit = document.createElement('span');
            spanCredit.classList.add('credit');
            spanCredit.setAttribute('itemprop', 'copyrightHolder');
            spanCredit.textContent = '(Image credit: Future)';

            // Append the span to the figcaption
            figCaption.appendChild(spanCredit);

            // Append the image and figcaption to the new div
            heroDiv.appendChild(articleImg);
            heroDiv.appendChild(figCaption);

            // Replace the target video element with the new elements
            targetElement.parentNode.replaceChild(heroDiv, targetElement);
        } else {
            console.error('og:image meta tag not found');
        }
    } else {
        console.log('Target element not found');
    }
}

// Replace videos with images
replaceElementWithOgImage();
