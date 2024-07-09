// Manages the global header.

// Copyright 2024 Qi Tianshi. All rights reserved.


import throttle from "lodash.throttle";

const globalHeaderClasses = document
    .getElementById("global-header")
    .classList;
const hamburgerCheckboxElement = document
    .getElementById("global-header__hamburger-checkbox");
const mobileExpandedClass = "global-header--mobile-expanded";
const mobileClosingClass = "global-header--mobile-closing";
const transparencyEnabledPrefix = "global-header--transparency-theme-";
const transparencyClass = "global-header--transparent";

/** Toggles the transparent mode of the horizontal navbar. */
function toggleNavbarTransparency() {

    // Navbar is made transparent if the document is scrolled to the top.
    globalHeaderClasses.toggle(transparencyClass, window.scrollY <= 0);

}

/**
 * Handles the event of the user clicking the hamburger button by toggling the
 * navigation links on mobile.
 */
function toggleExpandedMobileNavbar() {

    // Reads the value of the hamburger button checkbox, and applies a class to
    // the navigation links. CSS will cause the links to appear.
    if (hamburgerCheckboxElement.checked) {
        globalHeaderClasses.add(mobileExpandedClass);
    } else {

        globalHeaderClasses.remove(mobileExpandedClass);

        // Adds a closing class, then removes it after 0.3s. Used in CSS to
        // delay the transparency transitions until after the navbar is closed.
        // 0.3s is the duration of the closing animation.
        globalHeaderClasses.add(mobileClosingClass);
        setTimeout(function () {
            globalHeaderClasses.remove(mobileClosingClass);
        }, 300);

    }

}

/**
 * Module for managing the global header, including style changes and
 * animations.
 */
const GlobalHeader = {
    init: function () {

        // If the page has opted in, navbar transparency is applied.
        if (
            globalHeaderClasses
                .value
                .includes(transparencyEnabledPrefix)
        ) {

            // Applies the transparency on page load.
            toggleNavbarTransparency();

            // Adds event listeners for scroll and resize.
            for (const type of ["scroll", "resize"]) {

                window
                    .addEventListener(

                        type,

                        // Throttles the function call to reduce the rate it's
                        // triggered at.
                        throttle(toggleNavbarTransparency, 250),

                        // Makes the event listener passive for performance
                        // optimizations.
                        { passive: true }

                    );

            }

        }

        // Handles the clicking of the hamburger button.
        hamburgerCheckboxElement
            .addEventListener("change", toggleExpandedMobileNavbar);

    },
};

export default GlobalHeader;
