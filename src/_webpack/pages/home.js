// Scripts for /index.html

// Copyright 2024 Qi Tianshi. All rights reserved.


// The background images in the landing banner.
const landingBannerImages = document
    .querySelectorAll("#landing-banner .c-stacked-banner__background");

/// Animates the landing banner.
function animateLandingBanner() {

    // The total duration of the entrance animation of the banner background
    // images.
    let bannerEntranceAnimationDuration = 3.5;

    // The additional delay after the animation begins to show the first image.
    let bannerCrossfadeInitialDelay = 0.75;

    // Timeline for controlling landing banner background image animations.
    let landingBannerBackgroundTimeline = gsap.timeline();

    // The timing function for the background image entrance zoom.
    CustomEase.create("bannerZoomTimingFunction", ".4, 0, 0, .9");

    // Scales and moves the landing banner background images.
    landingBannerBackgroundTimeline.to(landingBannerImages, {
        scale: 1.1,
        yPercent: 4,
        duration: bannerEntranceAnimationDuration,
        delay: 0.5,
        ease: "bannerZoomTimingFunction",
    });

    // Fades out successive landing banner background images, except the first.
    landingBannerBackgroundTimeline.to(
        Array.from(landingBannerImages).slice(1).reverse(),
        {
            opacity: 0,
            duration: 0.2,
            delay: bannerCrossfadeInitialDelay,
            stagger: (
                (bannerEntranceAnimationDuration - bannerCrossfadeInitialDelay)
                / (landingBannerImages.length - 1)
            ),
            onStart: function () {
                // Starts the entrance animation for the heading.
                landingBannerHeadingTimeline.resume();
            },
        },
        "<"
    );

    // Continuously zooms and scales the background images.
    landingBannerBackgroundTimeline.to(landingBannerImages, {
        scale: 1,
        yPercent: 0,
        duration: 23,
        delay: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onStart: function () {

            // The index of the image that is currently at the top and visible.
            // Initially set to the topmost image.
            let currentTop = 0;

            // Runs the animation once, then at a regular interval.
            currentTop = loopLandingBannerImages(currentTop);
            setInterval(function () {
                currentTop = loopLandingBannerImages(currentTop);
            }, 5000);

        },
    });

    gsap.to("#landing-banner .c-stacked-banner__content", {
        yPercent: 50,
        scrollTrigger: {
            trigger: "#landing-banner",
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });

    // Selects the next image to be shown and fades out the topmost image.
    // Returns the index of the next image.
    let loopLandingBannerImages = function (currentTop) {

        // Selects an image from the list, excluding the current one.
        let nextTop = Math.floor(
            Math.random() * (landingBannerImages.length - 1));
        nextTop = (nextTop >= currentTop ? nextTop + 1 : nextTop);

        // Resets image positions and z-indexes.
        landingBannerImages.forEach(function (image, index) {

            image.style.opacity = 1;

            if (index === nextTop) {
                image.style.zIndex = 0;
            } else if (index === currentTop) {
                image.style.zIndex = 1;
            } else {
                image.style.zIndex = -1;
            }

        });

        // Fades out the topmost image.
        gsap.to(
            landingBannerImages[currentTop],
            {
                opacity: 0,
                duration: 2,
                ease: "power1.inOut",
            }
        );

        return nextTop;

    };

    // The timeline for controlling the landing banner heading. These tweens
    // are separated from the background timeline because they need to be
    // triggered independently if a scroll event occurs.
    let landingBannerHeadingTimeline = gsap.timeline({ paused: true });

    // Moves up and fades in the landing banner heading.
    landingBannerHeadingTimeline.from(
        "#landing-banner .c-stacked-banner__heading",
        {
            y: "1rem",
            opacity: 0,
            duration: 3,
            delay: 0.2,
            ease: "power4.out",
            onStart: function () {
                // Triggers the animation for drawing the big name.
                document
                    .querySelector(
                        "#landing-banner .c-stacked-banner__content")
                    .classList
                    .add(
                        "c-stacked-banner__content--animate-heading-entrance");
            },
            onComplete: function () {
                // Triggers the animation for the paragraphs.
                landingBannerParagraphsTween.resume();
            }
        }
    );

    // Fades in the background filter with the text.
    landingBannerHeadingTimeline.from(
        "#landing-banner .c-stacked-banner__background-filter",
        {
            opacity: 0,
            duration: 0.5,
        },
        "<"
    );

    // Moves up and fades in the landing banner paragraphs. This tween is
    // separated from the rest of the timeline because it needs to be triggered
    // independently if a scroll event occurs.
    let landingBannerParagraphsTween = gsap.from(
        "#landing-banner .c-stacked-banner__content p",
        {
            y: "1rem",
            opacity: 0,
            duration: 2,
            ease: "power4.out",
            stagger: 0.15,
            paused: true,
        }
    );

    // Resumes both the heading and paragraph entrance animations immediately.
    let enterContentImmediately = function () {
        landingBannerHeadingTimeline.resume();
        landingBannerParagraphsTween.resume();
    };

    // If the user begins scrolling, or some previous scroll position has been
    // restored from history, the content animations are run immediately so
    // they won't be missed.
    if (window.scrollY > 0) {
        enterContentImmediately();
    } else {
        window.addEventListener(
            "scroll", enterContentImmediately, { once: true }
        );
    }

}

function calculateLandingBannerBigNameAnimations() {

    // The paths that act as masks for writing the big name.
    const bigNameMaskingPaths = document
        .querySelectorAll("#landing-banner__big-name #mask path");

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
        const drawDuration = pathLength / (2500 - i * 80);
        bigNameMaskingPaths[i].style.animationDuration = `${drawDuration}s`;

        // Waits to start each animation until the previous strokes have been
        // drawn.
        bigNameMaskingPaths[i].style.animationDelay
            = `${writingElapsedDuration}s`;

        writingElapsedDuration += drawDuration * 1.1;

    }

}

// Waits for all landing banner background images to load.
async function allLandingBannerImagesLoaded() {

    //TODO: Add error handling. If an image is not loadable, continue the
    //      animation without it.

    const promises = Array.from(landingBannerImages).map(function (image) {
        return new Promise(function (resolve) {
            if (image.complete) {
                resolve();
            } else {
                image.onload = resolve;
            }
        });
    });

    await Promise.all(promises);

}

window.addEventListener("DOMContentLoaded", function () {

    gsap.registerPlugin(CustomEase);

    calculateLandingBannerBigNameAnimations();

    // Starts the landing banner animations when the images have all loaded.
    allLandingBannerImagesLoaded().then(function () {
        animateLandingBanner();
    });

});
