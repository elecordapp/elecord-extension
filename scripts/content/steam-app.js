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

// steam app content script

function main() {

    const viewsDir = '/views/steam/app/';
    const steamMediaDir = chrome.runtime.getURL('media/steam/');
    const tablerIconsDir = chrome.runtime.getURL('media/tabler/');

    let rightcol = {
        location: "div.rightcol.game_meta_data",
    };
    let feature = {
        element: document.querySelectorAll('div.label')
    };
    let unreleased = {
        element: document.querySelector('div.game_area_comingsoon'),
        state: false
    };
    let review = {
        score: {
            element: document.querySelectorAll('#userReviews div.user_reviews_summary_row'),
            value: "0%"
        },
        summary: {
            element: document.querySelectorAll('#userReviews span.game_review_summary'),
            value: "Unknown",
            icon: tablerIconsDir + 'poo.svg'
        }
    };
    let hours = {
        element: document.querySelector('div.hours_played'),
        value: "0 hrs",
        icon: tablerIconsDir + 'clock-hour-8.svg'
    };
    let date = {
        element: document.querySelector('div.release_date div.date'),
        value: "1970",
        icon: tablerIconsDir + 'calendar.svg'
    };

    /**
     * Fetches an HTML component from the extension's views folder.
     * @param {string} fileName The name of the HTML view to fetch.
     * @returns {Promise<string>} A promise that resolves with the HTML files content.
     */
    function fetchHTML(fileName) {
        // viewsDir is defined at the top of this file
        return fetch(chrome.runtime.getURL(viewsDir + fileName))
            .then(response => response.text())
            .catch(err => console.error("Error fetching HTML:", err));
    };

    /**
     * Creates a child element and inserts it into the page.
     * @param {string} fileName The name of the HTML view to use.
     * @param {string} targetSelector The CSS selector for the parent element.
     * @param {Array<string>} content An array of strings, each item is a value to replace placeholders (e.g. {0}, {1}...) in the HTML contents.
     */
    function addElement(fileName, targetSelector, content) {
        // fetch the HTML contents of the view
        fetchHTML(fileName).then(htmlContent => {

            // replace placeholders (e.g. {0}, {1}) with corresponding values from content[]
            let newHTML = htmlContent;
            content.forEach((value, index) => {
                // use RegExp constructor to replace all instances of placeholders
                const placeholder = new RegExp(`{\\s*${index}\\s*}`, 'g');
                newHTML = newHTML.replace(placeholder, value);
            });

            // insert new HTML into page at target selector
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                // sanitize HTML
                const cleanHTML = DOMPurify.sanitize(newHTML, {
                    ALLOWED_URI_REGEXP: new RegExp(`^(${tablerIconsDir}|${steamMediaDir})`)
                });
                // insert HTML
                targetElement.insertAdjacentHTML('beforeend', cleanHTML);
            } else {
                console.error(`"${targetSelector}" not found!`);
            }
        });
    };

    /**
     * Sets the icon for a component.
     * @param {string} component The component to set the icon for (e.g. "review", "hours", etc.).
     * @param {string} icon The name of the icon to use (e.g. "square-rounded-chevron-up.svg", etc.).
     */
    function setIcon(component, icon) {
        if (component == "review") {
            review.summary.icon = tablerIconsDir + icon
        }
    };

    // key details box
    {
        // modify existing rightcol with flex
        rightcol.element = document.querySelector(rightcol.location)
        rightcol.element.classList.add('e-rightcol');
        // add key details to rightcol
        addElement('ele-details.html', rightcol.location, []);
        writeLine('Info: Created key details box');
    };

    // custom detail: ⏳unreleased
    {
        // unreleased
        if (unreleased.element) {
            unreleased.state = true;
            addElement('ele-unreleased.html', '.e-details div div.block_content_inner', ['Unreleased']);
        } else
            // newly released
            if (!review.summary.element[0]) {
                unreleased.state = true;
                addElement('ele-unreleased.html', '.e-details div div.block_content_inner', ['New Release']);
            };
    };

    // continue if fully released
    if (unreleased.state === false) {

        // custom detail: ✅review
        {
            // check if recent reviews are present
            let recentReview = 1;
            if (!review.score.element[1]) {
                recentReview = 0;
            }
            // set review score
            review.score.value = review.score.element[recentReview].getAttribute('data-tooltip-html').split(' ')[0];
            // set review summary title
            review.summary.value = review.summary.element[recentReview].textContent.trim();

            // set review icon
            switch (review.summary.value) {
                // (icon displayed, review score, review count)
                case "Overwhelmingly Positive":
                    // ✔ 95-100%, 500+
                    setIcon('review', 'rosette-discount-check.svg');
                    break;
                case "Very Positive":
                    // » 80-94%, 500+ | 80-100% 50-499
                    setIcon('review', 'square-rounded-chevrons-up.svg');
                    break;
                case "Positive":
                    // > 80-100%, 10-49
                    setIcon('review', 'square-rounded-chevron-up.svg');
                    break;
                case "Mostly Positive":
                    // > 70-79%, any
                    setIcon('review', 'square-rounded-chevron-up.svg');
                    break;
                case "Mixed":
                    // - 40-69%, any
                    setIcon('review', 'square-rounded-minus.svg');
                    break;
                case "Mostly Negative":
                    // < 20-39%, any
                    setIcon('review', 'square-rounded-chevron-down.svg');
                    break;
                case "Negative":
                    // « 0-19%, 10-49
                    setIcon('review', 'square-rounded-chevrons-down.svg');
                    break;
                default:
                // Very Negative
                // poo 0-19%, 50-499
                // Overwhelmingly Negative
                // poo 0-19%, 500+
            }

            // handle no review score
            if (review.score.value === "Need"/* more reviews... */) {
                setIcon('review', 'message.svg');
                review.score.value = "";
            }

            // add to key details
            addElement(
                'ele-review.html',
                '.e-details div div.block_content_inner',
                [review.summary.icon, review.score.value, review.summary.value]
            );
        };


        // basic labels

        // detail: 👥online
        {
            let online = false;
            feature.element.forEach(label => {
                if (label.textContent.trim() === "Online Co-op" || label.textContent.trim() === "Online PvP") {
                    online = true;
                }
            });

            // add to key details
            if (online) {
                const coopIcon = steamMediaDir + 'coop.png'
                addElement('ele-label.html',
                    '.e-details div div.block_content_inner',
                    [coopIcon, 'Online']
                );
            }
        };

        // detail: 🕗hours
        {
            if (hours.element) {
                // set hours played
                const rawValue = hours.element.textContent.trim();
                // use regex to extract the hours including commas and decimal parts
                const match = rawValue.match(/(\d{1,3}(?:,\d{3})*\.\d+)/);
                if (match) {
                    hours.value = `${match[1]} hrs`;
                };
                // add to key details
                addElement(
                    'ele-label.html',
                    '.e-details div div.block_content_inner',
                    [hours.icon, hours.value]
                );
            };
        };

        // detail: 🗓️date
        {
            // set release date
            const rawValue = date.element.textContent.trim();
            // use regex to extract the year
            const match = rawValue.match(/(\d{4})/);
            date.value = `${match[1]}`;

            // add to key details
            addElement(
                'ele-label.html',
                '.e-details div div.block_content_inner',
                [date.icon, date.value]
            );
        };

    } else {
        writeLine('End: Unreleased or newly released app, limited details');
    }

};

// run script
{
    // check options
    getOptions((options) => {
        if (!options['opt-steam-details']) {
            writeLine('Stop: Script disabled');
        }
        // check if hardware app
        else if (document.querySelector('div.breadcrumbs div.blockbg a').textContent === "All Hardware") {
            writeLine('Stop: Hardware app');
        } else {
            // run
            writeLine('Start: Content script');
            main();
        }
    });
}
