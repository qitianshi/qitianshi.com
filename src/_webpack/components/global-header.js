// Manages the global header.

// Copyright 2024 Qi Tianshi. All rights reserved.


import throttle from "lodash.throttle";

const globalHeaderNavClasses = document
    .querySelector("#global-header nav").classList;
const hamburgerCheckboxElement = document
    .getElementById("global-header__hamburger-checkbox");
const globalHeaderBackgroundFilter = document
    .getElementById("global-header__background-filter");

/** Toggles the transparent mode of the horizontal when scrolled to the top. */
function toggleNavbarTransparency() {
    globalHeaderNavClasses
        .toggle("global-header--transparent", window.scrollY <= 0);
}

/** Animates the mobile navbar state between expanded and collapsed. */
function toggleExpandedMobileNavbar() {

    const mobileExpandedClass = "global-header--mobile-expanded";

    // Reads the value of the hamburger button checkbox.
    if (hamburgerCheckboxElement.checked) {

        // Overwrite is required to kill the current animation if the state is
        // toggled before animation finishes.
        let navbarExpansionTimeline = gsap.timeline({
            defaults: { overwrite: true, },
            onStart: function () {
                globalHeaderNavClasses.add(mobileExpandedClass);
            },
        });

        // Animates the height change of the navbar.
        navbarExpansionTimeline.to("#global-header__navigation-links", {
            height: "auto",
            duration: 0.3,
            ease: "power1.in",
        });

        // Animates the entrance of the navlinks.
        navbarExpansionTimeline.from("#global-header__navigation-links li", {
            y: "-1rem",
            opacity: 0,
            duration: 1,
            delay: 0.09,
            stagger: 0.07,
            ease: "power4.out",
        }, "<");

        // Animates the entrance of the background filter.
        navbarExpansionTimeline.to(globalHeaderBackgroundFilter, {
            display: "block",
            opacity: 1,
            duration: 0.3,
            onComplete: function () {

                // Prevents scrolling the body if the browser supports
                // backdrop filters. Otherwise, there is no reason to prevent
                // scrolling.
                if (CSS.supports("backdrop-filter", "blur()")) {
                    document.body.style.overflow = "hidden";
                }

            },
        }, "<");

    } else {

        let navbarCollapseTimeline = gsap.timeline();

        // Animates the collapse of the navbar.
        navbarCollapseTimeline.to("#global-header__navigation-links", {
            height: 0,
            duration: 0.3,
            ease: "power1.in",
            overwrite: true,
            onComplete: function () {

                globalHeaderNavClasses.remove(mobileExpandedClass);

                // Unsets the style attribute height created by GSAP so it does
                // not override the CSS styles if the navbar subsequently
                // changes back to the wide layout.
                document.querySelector("#global-header__navigation-links")
                    .style.height = null;

            },
        });

        // Animates the exit of the background filter.
        navbarCollapseTimeline.to(globalHeaderBackgroundFilter, {
            display: "none",
            opacity: 0,
            duration: 0.3,
            onStart: function () {
                document.body.style.overflow = null;     // Restores scrolling.
            },
        });

    }

}

/**
 * Module for managing the global header, including style changes and
 * animations.
 */
const GlobalHeader = {
    init: function () {

        // Applies navbar transparency if the page has opted in.
        if (globalHeaderNavClasses.value.includes(
            "global-header--transparency-theme-"
        )) {

            // Applies the transparency on page load.
            toggleNavbarTransparency();

            // Adds event listeners for scroll and resize.
            for (const type of ["scroll", "resize"]) {

                // The callback is throttled and the event listener is passive
                // to reduce compute load.
                window.addEventListener(
                    type,
                    throttle(toggleNavbarTransparency, 250),
                    { passive: true }
                );

            }

        }

        // Handles the clicking of the hamburger button.
        hamburgerCheckboxElement
            .addEventListener("change", toggleExpandedMobileNavbar);

        // Collapses the navbar if there is a click outside of the menu.
        globalHeaderBackgroundFilter.addEventListener("click", function () {
            hamburgerCheckboxElement.checked = false;
            toggleExpandedMobileNavbar();
        });

    },
};

export default GlobalHeader;
