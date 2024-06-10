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

// Function to replace the specified element with an image from the og:image meta property
function replaceElementWithOgImage() {
    // Select the target element
    const targetElement = document.querySelector('#article-body > div.jwplayer__widthsetter');

    // If the target element exists
    if (targetElement) {
        console.log('Target element found:', targetElement);

        // Select the og:image meta tag
        const ogImageMetaTag = document.querySelector('meta[property="og:image"]');

        // If the og:image meta tag exists
        if (ogImageMetaTag) {
            const ogImageUrl = ogImageMetaTag.getAttribute('content');
            console.log('og:image URL:', ogImageUrl);

            // Create a new div element
            const newDiv = document.createElement('div');
            newDiv.classList.add('box', 'less-space', 'hero-image-wrapper'); // Add classes

            // Create a new image element
            const newImg = document.createElement('img');
            newImg.src = ogImageUrl;
            newImg.alt = 'Article Image';
            newImg.style.width = '100%'; // Set appropriate styles
            newImg.style.height = 'auto';

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
            newDiv.appendChild(newImg);
            newDiv.appendChild(figCaption);

            // Replace the target element with the new image element
            targetElement.parentNode.replaceChild(newDiv, targetElement);
        } else {
            console.error('og:image meta tag not found');
        }
    } else {
        console.log('Target element not found');
    }
}

// Replace video with image
replaceElementWithOgImage();
