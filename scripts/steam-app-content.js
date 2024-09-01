// steampowered.com content script

const componentsLocation = '/components/steam/app/';

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
        icon: chrome.runtime.getURL('assets/poo.svg')
    }
};
let hours = {
    element: document.querySelector('div.hours_played'),
    value: "0 hrs",
    icon: chrome.runtime.getURL('assets/clock-hour-8.svg')
};
let date = {
    element: document.querySelector('div.release_date div.date'),
    value: "1970",
    icon: chrome.runtime.getURL('assets/calendar.svg')
}

// check if hardware app
if (document.querySelector('div.breadcrumbs div.blockbg a').textContent === "All Hardware") {
    WriteLine('Skipping hardware app');
} else {

    // key details box
    {
        addElement('ele-details.html', 'div.rightcol.game_meta_data', []);
        WriteLine('Created key details box');
    };

    // custom detail: ⏳unreleased
    {
        if (unreleased.element) {
            unreleased.state = true;
            // add to key details
            addElement('ele-unreleased.html', '.e-details div div.block_content_inner', []);
        }
    };

    // continue if released
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

            switch (review.summary.value) {
                case "Overwhelmingly Positive":
                    setIcon('review', 'rosette-discount-check.svg'); // ✔
                    break;
                case "Very Positive":
                    setIcon('review', 'square-rounded-chevrons-up.svg'); // »
                    break;
                case "Positive":
                    setIcon('review', 'square-rounded-chevron-up.svg'); // >
                    break;
                case "Mostly Positive":
                    setIcon('review', 'square-rounded-chevron-up.svg'); // >
                    break;
                case "Mixed":
                    setIcon('review', 'square-rounded-minus.svg'); // -
                    break;
                case "Mostly Negative":
                    setIcon('review', 'square-rounded-chevron-down.svg'); // <
                    break;
                case "Negative":
                    setIcon('review', 'square-rounded-chevrons-down.svg'); // «
                    break;
                default:
                // Very Negative, Overwhelmingly Negative
                // poo.svg
            }

            // add to key details
            addElement(
                'ele-review.html',
                '.e-details div div.block_content_inner',
                [review.summary.icon, review.score.value, review.summary.value]
            );
        };


        // basic labels
        //

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
                addElement('ele-label.html',
                    '.e-details div div.block_content_inner',
                    ['https://store.akamai.steamstatic.com/public/images/v6/ico/ico_coop.png', 'Online']
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

    };

};

/**
 * Fetches an HTML component from the extension's components folder.
 * @param {string} fileName The name of the HTML file to fetch.
 * @returns {Promise<string>} A promise that resolves with the HTML content of the file.
 */
function fetchHTML(fileName) {
    // componentsLocation is defined at the top of this file
    return fetch(chrome.runtime.getURL(componentsLocation + fileName))
        .then(response => response.text())
        .catch(err => console.error("Error fetching HTML:", err));
};

/**
 * Creates a child element and inserts it into the page.
 * @param {string} fileName The name of the HTML component file to use.
 * @param {string} targetSelector The CSS selector for the parent element.
 * @param {Array<string>} content An array of strings, each item is a value to replace placeholders (e.g. {0}, {1}...) in the HTML content.
 */
function addElement(fileName, targetSelector, content) {
    // fetch the HTML content of the component file
    fetchHTML(fileName).then(htmlContent => {
        // replace placeholders like {0}, {1}, etc., with corresponding values from content array
        let newHtml = htmlContent;
        content.forEach((value, index) => {
            // use RegExp constructor to replace all instances of placeholders like {0}, {1}, etc...
            const placeholder = new RegExp(`{\\s*${index}\\s*}`, 'g');
            newHtml = newHtml.replace(placeholder, value);
        });

        // insert the new HTML content into the page at the target selector
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.insertAdjacentHTML('beforeend', newHtml);
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
        review.summary.icon = chrome.runtime.getURL(`assets/${icon}`);
    }
};

/**
 * Logs a message to the console with a formatted prefix.
 * @param {...*} message The content to be logged to the console.
 */
function WriteLine() {
    console.log('%c[elecord]%c', 'color:#fff; font-weight:bold;', '', ...arguments);
};
