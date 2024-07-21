// Scripts for /index.html

// Copyright 2024 Qi Tianshi. All rights reserved.


// The background images in the landing banner.
const landingBannerImages = document
    .querySelectorAll(".landing-banner__background-image");

/** Animates the landing banner. */
function animateLandingBanner() {

    // The total duration of the entrance animation of the banner background
    // images.
    const bannerEntranceAnimationDuration = 3.5;

    // The additional delay after the animation begins to show the first image.
    const bannerCrossfadeInitialDelay = 0.75;

    // The wrappers containing the background images, which act as masks for
    // the background scroll animation.
    const backgroundMasks = document
        .querySelectorAll(".landing-banner__background-mask");

    // Resumes both the heading and paragraph entrance animations
    // immediately.
    let enterContentImmediately = function () {
        landingBannerHeadingTimeline.resume();
        landingBannerParagraphsTween.resume();
    };

    // Timeline for controlling landing banner background image animations.
    let landingBannerBackgroundTimeline = gsap.timeline({
        onStart: function () {

            // Resets masks widths during the entrance animation to disable the
            // scrolling animation.
            Array.from(backgroundMasks).slice(1)
                .forEach(function (mask) { mask.style.width = "100vw"; });
            backgroundSwipeTween.invalidate();

            if (
                ScrollTrigger
                    .positionInViewport(".landing-banner", "top") === 0
            ) {
                setGlobalHeaderForcedTransparency(true);
            } else {
                enterContentImmediately();
            }

        },
    });

    // The timing function for the background image entrance zoom.
    CustomEase.create("bannerZoomTimingFunction", ".4, 0, 0, .9");

    // Resets initially hidden elements.
    gsap.set(".landing-banner .c-stacked-banner__content", { autoAlpha: 1 });
    gsap.set(".landing-banner__background-filter", {
        visibility: "inherit",
    });

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
            onComplete: function () {

                // Resets the scroll back to the top if the landing banner is
                // still pinned to prevent a jump in the scrolling animation.
                if (
                    ScrollTrigger
                        .positionInViewport(".landing-banner", "top") === 0
                ) {

                    // The scrub delay must be temporarily set to 0 to prevent
                    // the animation from showing during the scroll reset.
                    const originalScrubValue
                        = backgroundSwipeTween.scrollTrigger.vars.scrub;
                    backgroundSwipeTween.scrollTrigger.vars.scrub = 0;
                    ScrollTrigger.refresh();

                    window.scrollTo({ top: 0, behavior: "instant" });

                    // Restores original.
                    backgroundSwipeTween.scrollTrigger.vars.scrub
                        = originalScrubValue;
                    ScrollTrigger.refresh();

                } else {

                    const swipedMasks = backgroundSwipeTween.targets();
                    const finalVisibleMask
                        = swipedMasks[swipedMasks.length - 1];

                    // Animates to the final state of the scroll animation.
                    gsap.to(finalVisibleMask, {

                        width: "100vw",
                        duration: 0.5,
                        ease: "power3.out",

                        // Sets the width back to zero before refreshing the
                        // scrollTrigger. Otherwise, the end state of this
                        // tween would end up being the start state of the
                        // scrolling tween. This technically causes a brief
                        // flash between the resets, but it's not noticeable.
                        onComplete: function () {
                            gsap.set(finalVisibleMask, { width: "0vw" });
                            backgroundSwipeTween.scrollTrigger.refresh();
                        }

                    });

                }

                // Sets up the other background images for the scrolling
                // animation.
                gsap.set(
                    Array.from(backgroundMasks).slice(1), { width: "0vw" });
                gsap.set(landingBannerImages, { opacity: 1 });

                // Refreshes the tween with the current states of the
                // background images.
                backgroundSwipeTween.invalidate();

            },
        },
        "<"
    );

    // Horizontally swipes between the background images as the user scrolls.
    // During the entrance animation, all the mask widths are set to 100vw,
    // so this tween will still animate the pinning but not the width change.
    // After the entrance animation, the widths are set to 0 and the tween is
    // invalidated to reset the origin and enable the horizontal swiping
    // animation.
    let backgroundSwipeTween = gsap.to(
        Array.from(backgroundMasks).slice(1, -1),
        {
            width: "100vw",
            stagger: 0.3,
            scrollTrigger: {

                trigger: ".landing-banner",
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
                pin: true,

                // Overrides the default behavior of the global header
                // transparency controller because the landing banner is
                // pinned. onToggle is not used because it causes a flash
                // onLeaveBack due to the throttling of the global header
                // scroll listener.
                onLeave: function () {
                    setGlobalHeaderForcedTransparency(false);
                    enterContentImmediately();
                },
                onEnterBack: function () {
                    setGlobalHeaderForcedTransparency(true);
                },

            },
        }
    );

    // Creates a parallax scrolling effect by translating the content downward.
    gsap.to(".landing-banner .c-stacked-banner__content", {
        y: function () {
            // Moves the content to the bottom of the banner.
            return ((document.querySelector(".landing-banner").offsetHeight
                - document.querySelector(
                    ".landing-banner .c-stacked-banner__content").offsetHeight)
                / 2);
        },
        scrollTrigger: {
            trigger: ".landing-banner",
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
        }
    });

    // The timeline for controlling the landing banner heading. These tweens
    // are separated from the background timeline because they need to be
    // triggered independently if a scroll event occurs.
    let landingBannerHeadingTimeline = gsap.timeline({ paused: true });

    // Moves up and fades in the landing banner heading.
    landingBannerHeadingTimeline.from(
        ".landing-banner .c-stacked-banner__heading",
        {
            y: "1rem",
            opacity: 0,
            duration: 3,
            delay: 0.2,
            ease: "power4.out",
            onStart: function () {
                // Triggers the animation for drawing the big name.
                landingBannerBigNameAnimationTimeline().resume();
            },
            onComplete: function () {
                // Triggers the animation for the paragraphs.
                landingBannerParagraphsTween.resume();
            }
        }
    );

    // Fades in the background filter with the text.
    landingBannerHeadingTimeline.from(".landing-banner__background-filter", {
        opacity: 0,
        duration: 0.5,
    }, "<");

    // Moves up and fades in the landing banner paragraphs. This tween is
    // separated from the rest of the timeline because it needs to be triggered
    // independently if a scroll event occurs.
    let landingBannerParagraphsTween = gsap.from(
        ".landing-banner .c-stacked-banner__content p",
        {
            y: "1rem",
            opacity: 0,
            duration: 2,
            ease: "power4.out",
            stagger: 0.15,
            paused: true,
        }
    );

}

/**
 * Sets the forced transparency state of the global header.
 *
 * @param {Boolean} to - The state to which the forced transparency is set.
 */
function setGlobalHeaderForcedTransparency(to) {
    document
        .querySelector("#global-header nav")
        .classList
        .toggle("global-header--transparent-forced", to);
}

/**
 * Creates a GSAP timeline for animating the drawing animation for the landing
 * banner big name.
 *
 * @returns {GSAP.Timeline} A GSAP timeline which, when resumed, will play the
 * animation.
 */
function landingBannerBigNameAnimationTimeline() {

    let drawTimeline = gsap.timeline({ paused: true });

    // The paths that act as masks for writing the big name.
    const bigNameMaskingPaths = document.querySelectorAll(
        ".landing-banner__big-name .c-drawable-graphic__mask path");

    // Calculates the animations to write the big name.
    for (let i = 0; i < bigNameMaskingPaths.length; i++) {

        // Sets the initial stroke-dasharray and stroke-dashoffset CSS
        // properties to simulate the writing effect.
        const pathLength = bigNameMaskingPaths[i].getTotalLength();
        bigNameMaskingPaths[i].style.strokeDasharray = pathLength;
        bigNameMaskingPaths[i].style.strokeDashoffset = pathLength;

        // The duration is calculated from the length of the stroke to achieve
        // a consistent drawing speed. The speed progressively decreases for an
        // easing out effect. A small pause is left between each stroke.
        drawTimeline.to(bigNameMaskingPaths[i], {
            strokeDashoffset: 0,
            duration: pathLength / (2500 - i * 80),
        }, "+=10%");

    }

    return drawTimeline;

}

/** Waits for all landing banner background images to load. */
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

    // Starts the landing banner animations when the images have all loaded.
    allLandingBannerImagesLoaded().then(function () {
        animateLandingBanner();
    });

});
