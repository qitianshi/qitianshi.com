// Manages the global header.

// Copyright 2023 Qi Tianshi. All rights reserved.


/**
 * Handles the event of the user clicking the hamburger button, by revealing
 * hidden navigation links.
 */
function onUserClickHamburgerButton() {

    // Reads the value of the hamburger button checkbox, and applies a class to
    // the navigation links. CSS will cause the links to appear.

    const navLinksClasses = document
        .getElementById("global-header__navigation-links")
        .classList;

    const hamburgerIsChecked = document
        .getElementById("global-header__hamburger-checkbox")
        .checked;

    const classToToggle = "global-header__navigation-links--mobile-visible";

    if (hamburgerIsChecked) {
        navLinksClasses.add(classToToggle);
    } else {
        navLinksClasses.remove(classToToggle);
    }

}

const GlobalHeader = {
    init: function () {
        document
            .getElementById("global-header__hamburger-checkbox")
            .addEventListener("change", onUserClickHamburgerButton);
    },
}

export default GlobalHeader;
