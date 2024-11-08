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

// pcgamer.com content script

function replaceVideos() {
    // select pcgamer custom videos (does not include youtube videos)
    const heroVideo = document.querySelectorAll('.hero-video-wrapper > div.jwplayer__widthsetter');
    const articleVideos = document.querySelectorAll('#article-body > div.jwplayer__widthsetter');

    function replace(targetVideo) {
        // check target video exists
        if (targetVideo.length > 0) {
            targetVideo.forEach((video) => {
                writeLine(`replaceVideos() Target video found: ${video}`);

                // select the article og:image meta tag
                const ogImageMetaTag = document.querySelector('meta[property="og:image"]');

                // check the og:image meta tag exists
                if (ogImageMetaTag) {
                    const ogImageUrl = ogImageMetaTag.getAttribute('content');

                    // create new div element
                    const heroDiv = document.createElement('div');
                    heroDiv.classList.add('box', 'less-space', 'hero-image-wrapper'); // Add classes

                    // create new image element
                    const articleImg = document.createElement('img');
                    articleImg.src = ogImageUrl;
                    articleImg.alt = 'Article Image';
                    articleImg.style.width = '100%'; // Set appropriate styles
                    articleImg.style.height = 'auto';

                    // create figcaption element
                    const figCaption = document.createElement('figcaption');
                    figCaption.setAttribute('itemprop', 'caption description');

                    // create span element for image credit
                    const spanCredit = document.createElement('span');
                    spanCredit.classList.add('credit');
                    spanCredit.setAttribute('itemprop', 'copyrightHolder');
                    spanCredit.textContent = '(Image credit: Future)';

                    // append span to figcaption
                    figCaption.appendChild(spanCredit);

                    // append image and figcaption to new div
                    heroDiv.appendChild(articleImg);
                    heroDiv.appendChild(figCaption);

                    // replace target video element with new elements
                    video.parentNode.replaceChild(heroDiv, video);
                } else {
                    writeLine('replaceVideos() og:image meta tag not found');
                }
            })
        } else {
            writeLine('replaceVideos() Target video not found');
        }
    };

    // replace videos
    writeLine('replaceVideos() Replacing hero video...');
    replace(heroVideo);
    writeLine('replaceVideos() Replacing article videos...');
    replace(articleVideos);

};

function highlightSteamLinks() {
    // select all <a> elements
    const links = document.querySelectorAll('a');

    // iterate all <a> elements
    links.forEach(link => {
        // check href attribute contains specified URL and underlined text
        if (link.href.includes('https://store.steampowered.com/app/') && link.querySelector('u')) {
            // add class to highlight steam link
            link.classList.add('highlight-steam-link');

            // create image element for Steam logo
            const steamLogo = document.createElement('img');
            steamLogo.src = chrome.runtime.getURL('media/steam/logo.png');
            steamLogo.alt = 'Steam Logo';
            steamLogo.classList.add('steam-logo');

            // insert image inside link
            link.insertBefore(steamLogo, link.firstChild);
            writeLine(`highlightSteamLinks() Steam link highlighted: ${link}`);
        }
    });
};

// run script
{
    // check options
    getOptions((options) => {
        if (options['opt-pcgamer-videos']) {
            // replace pcgamer videos
            replaceVideos();
        }

        if (options['opt-pcgamer-steamicon']) {
            // highlight steam links
            highlightSteamLinks();
        }
    });
};
