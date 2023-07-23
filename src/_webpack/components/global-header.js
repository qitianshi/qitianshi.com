// Manages the global header.

// Copyright 2023 Qi Tianshi. All rights reserved.


import throttle from "lodash.throttle";

const globalHeaderClasses = document
    .getElementById("global-header")
    .classList;
const hamburgerCheckboxElement = document
    .getElementById("global-header__hamburger-checkbox");
const mobileExpandedClass = "global-header--mobile-expanded";
const transparencyClass = "global-header--transparent";

/**
 * Toggles the transparent mode of the horizontal navbar.
 */
function toggleNavbarTransparency() {

    // Navbar is made transparent if the document is scrolled to the top and,
    // on mobile, it has not been expanded. The 750px value is from the CSS
    // media selector for changing to the mobile layout in _global-header.scss.
    if (
        (window.scrollY <= 0)
        && (
            !(globalHeaderClasses.contains(mobileExpandedClass))
            || window.innerWidth > 750
        )
    ) {
        globalHeaderClasses.add(transparencyClass);
    } else {
        globalHeaderClasses.remove(transparencyClass);
    }

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
    }

    // Applies the transparency style if appropriate.
    toggleNavbarTransparency();

}

const GlobalHeader = {
    init: function () {

        // If the page has opted in, navbar transparency is applied.
        if (
            globalHeaderClasses
                .contains("global-header--transparency-enabled")
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
