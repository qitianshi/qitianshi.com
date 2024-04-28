// Scripts for /index.html

// Copyright 2024 Qi Tianshi. All rights reserved.


// The background images in the landing banner.
const landingBannerImages = document
    .querySelectorAll("#landing-banner .c-stacked-banner__background");

// The landing banner content element.
const landingBannerContent = document
    .querySelector("#landing-banner .c-stacked-banner__content");

// The paths that act as masks for writing the big name.
const bigNameMaskingPaths = document
    .querySelectorAll("#landing-banner__big-name #mask path");

/// Checks if all of the landing banner background images have loaded.
function allLandingBannerImagesLoaded() {

    for (let i = 0; i < landingBannerImages.length; i++) {
        if (!landingBannerImages[i].complete) { return false; }
    }

    return true;

}

/// Triggers the entrance animation for the landing banner background images.
function enterLandingBannerImages() {
    landingBannerImages.forEach(function (image) {
        image.classList.add("c-stacked-banner__background--animate-entrance");
    });
}

/// Triggers the entrance animation for the landing banner content heading.
function enterLandingBannerContentHeading(event) {

    // The total duration that has so far elapsed in the animation that writes
    // the big name.
    let writingElapsedDuration = 0;

    // Calculates the animations to write the big name.
    for (let i = 0; i < bigNameMaskingPaths.length; i++) {

        // Sets the initial stroke-dasharray and stroke-dashoffset CSS
        // properties to simulate the writing effect.
        const pathLength = bigNameMaskingPaths[i].getTotalLength();
        bigNameMaskingPaths[i].style.strokeDasharray = pathLength;
        bigNameMaskingPaths[i].style.strokeDashoffset = pathLength;

        // Calculates the duration the animation should last based on the
        // length of the stroke. The writing speed also progressively
        // decreases.
        const drawDuration = pathLength / (3000 - i * 75);
        bigNameMaskingPaths[i].style.animationDuration = `${drawDuration}s`;

        // Waits to start each animation until the previous strokes have been
        // drawn.
        bigNameMaskingPaths[i].style.animationDelay
            = `${writingElapsedDuration}s`;

        writingElapsedDuration += drawDuration * 1.1;

    }

    // Darkens the background images.
    document
        .querySelector("#landing-banner .c-stacked-banner__background-filter")
        .classList
        .add("c-stacked-banner__background-filter--enabled");

    // Triggers the animation.
    landingBannerContent
        .classList
        .add("c-stacked-banner__content--animate-heading-entrance");

    // If triggered by a scroll event, triggers the body entrance animation
    // without waiting for the text to finish writing.
    if (event.type == "scroll") {
        enterLandingBannerContentBody();
    }

    window.removeEventListener(event.type, enterLandingBannerContentHeading);

}

/// Triggers the entrance animation for the body of the landing banner content.
function enterLandingBannerContentBody() {
    landingBannerContent
        .classList
        .add("c-stacked-banner__content--animate-body-entrance");
}

/// Selects the next image to be shown and fades out the topmost image. Returns
/// the index of the next image.
function loopLandingBannerImages(currentTop) {

    // Selects an image from the list, excluding the current one.
    let nextTop = Math.floor(Math.random() * (landingBannerImages.length - 1));
    nextTop = (nextTop >= currentTop ? nextTop + 1 : nextTop);

    // Resets all other images.
    landingBannerImages.forEach(function (image) {
        image.style.zIndex = -1;
        image.style.opacity = 1;
    });

    // Rearranges the images in order and fades out the topmost image.
    landingBannerImages[nextTop].style.zIndex = 0;
    landingBannerImages[currentTop].style.zIndex = 1;
    landingBannerImages[currentTop].style.opacity = 0;

    return nextTop;

}

// Triggers the background image loading animation when all images have loaded.
if (allLandingBannerImagesLoaded()) {
    enterLandingBannerImages();
} else {
    landingBannerImages.forEach(function (image) {
        image.addEventListener("load", function () {
            if (allLandingBannerImagesLoaded()) {
                enterLandingBannerImages();
            }
        });
    });
}

// Triggers the banner content entrance animation when the topmost image has
// finished its entrance animation, or when the user begins scrolling.
landingBannerImages[landingBannerImages.length - 1]
    .addEventListener( "animationend", enterLandingBannerContentHeading);
window.addEventListener("scroll", enterLandingBannerContentHeading);

// Triggers the paragraphs to enter after the big name has finished writing.
bigNameMaskingPaths[bigNameMaskingPaths.length - 1]
    .addEventListener("animationend", enterLandingBannerContentBody);

// Triggers the continuous loop of background images.
landingBannerContent
    .lastElementChild
    .addEventListener("animationend", function() {

        landingBannerImages.forEach(function (image) {
            image.classList.remove(
                "c-stacked-banner__background--animate-entrance");
            image.classList.add("c-stacked-banner__background--animate-loop");
        });

        // The index of the image that is currently at the top and visible.
        // Initially set to the topmost image.
        let currentTop = 0;

        // Runs the animation once, then at a regular interval.
        currentTop = loopLandingBannerImages(currentTop);
        setInterval(function () {
            currentTop = loopLandingBannerImages(currentTop);
        }, 5000);

    });
