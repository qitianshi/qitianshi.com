// Scripts for /index.html

// Copyright 2024 Qi Tianshi. All rights reserved.


// The background images in the landing banner.
const landingBannerImages = document
    .querySelectorAll(".landing-banner__background-image");

/** Animates the landing banner. */
function animateLandingBanner() {

    // The total duration of the background entrance animation.
    const backgroundEntranceDuration = 3.5;

    // The delay before the first image is faded out in the entrance animation.
    const backgroundCrossfadeDelay = 0.75;

    // The stagger between fading out successive backgrounds.
    const backgroundCrossfadeStagger = (
        (backgroundEntranceDuration - backgroundCrossfadeDelay)
        / (landingBannerImages.length - 1)
    );

    // The wrappers containing the background images, which act as masks for
    // the background scroll animation.
    const backgroundMasks = document
        .querySelectorAll(".landing-banner__background-mask");

    // Resumes both the heading and paragraph entrance animations
    // immediately.
    let enterContentImmediately = function () {
        headingEntranceTimeline.resume();
        paragraphEntranceTween.resume();
    };

    // The timing function for the background image entrance zoom.
    CustomEase.create("bannerZoomTimingFunction", ".4, 0, 0, .9");

    // Resets initially hidden elements.
    gsap.set(".landing-banner .c-stacked-banner__content", { autoAlpha: 1 });
    gsap.set(".landing-banner__background-filter", {
        visibility: "inherit",
    });

    // Timeline for controlling landing banner background image animations.
    let backgroundEntranceTimeline = gsap.timeline({
        onStart: function () {

            // Resets masks widths during the entrance animation to disable the
            // scrolling animation.
            Array.from(backgroundMasks).slice(1)
                .forEach(function (mask) { mask.style.width = "100vw"; });
            backgroundScrollTween.invalidate();

            if (
                ScrollTrigger
                    .positionInViewport(".landing-banner", "top") === 0
            ) {
                setGlobalHeaderForcedTransparency(true);
            } else {
                enterContentImmediately();
            }

        },
        onComplete: function () {

            // Resets the scroll back to the top if the landing banner is still
            // pinned to prevent a jump in the scrolling animation.
            if (
                ScrollTrigger
                    .positionInViewport(".landing-banner", "top") === 0
            ) {

                // The scrub delay must be temporarily set to 0 to prevent the
                // animation from showing during the scroll reset.
                const originalScrubValue
                    = backgroundScrollTween.scrollTrigger.vars.scrub;
                backgroundScrollTween.scrollTrigger.vars.scrub = 0;
                ScrollTrigger.refresh();

                window.scrollTo({ top: 0, behavior: "instant" });

                // Restores original.
                backgroundScrollTween.scrollTrigger.vars.scrub
                    = originalScrubValue;
                ScrollTrigger.refresh();

            } else {

                const swipedMasks = backgroundScrollTween.targets();
                const finalVisibleMask = swipedMasks[swipedMasks.length - 1];

                // Animates to the final state of the scroll animation.
                gsap.to(finalVisibleMask, {

                    width: "100vw",
                    duration: 0.5,
                    ease: "power3.out",
                    delay: backgroundCrossfadeStagger,

                    // Sets the width back to zero before refreshing the
                    // scrollTrigger. Otherwise, the end state of this tween
                    // would end up being the start state of the scrolling
                    // tween. This technically causes a brief flash between the
                    // resets, but it's not noticeable.
                    onComplete: function () {
                        gsap.set(finalVisibleMask, { width: "0vw" });
                        ScrollTrigger.refresh();
                    }

                });

            }

            // Sets up the other background images for the scrolling animation.
            gsap.set(Array.from(backgroundMasks).slice(1), { width: "0vw" });
            gsap.set(landingBannerImages, { opacity: 1 });

            // Refreshes the tween with the current states of the backgrounds.
            backgroundScrollTween.invalidate();

        },
    });

    // Scales and moves the landing banner background images.
    backgroundEntranceTimeline.to(landingBannerImages, {
        scale: 1.1,
        yPercent: 4,
        duration: backgroundEntranceDuration,
        delay: 0.5,
        ease: "bannerZoomTimingFunction",
    });

    // Fades out successive landing banner background images, except the first.
    backgroundEntranceTimeline.to(
        Array.from(landingBannerImages).slice(1).reverse(),
        {
            opacity: 0,
            duration: 0.2,
            delay: backgroundCrossfadeDelay,
            stagger: backgroundCrossfadeStagger,
            onStart: function () {
                // Starts the entrance animation for the heading.
                headingEntranceTimeline.resume();
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
    let backgroundScrollTween = gsap.to(
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
    let headingEntranceTimeline = gsap.timeline({ paused: true });

    // Moves up and fades in the landing banner heading.
    headingEntranceTimeline.from(
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
                paragraphEntranceTween.resume();
            }
        }
    );

    // Fades in the background filter with the text.
    headingEntranceTimeline.from(".landing-banner__background-filter", {
        opacity: 0,
        duration: 0.5,
    }, "<");

    // Moves up and fades in the landing banner paragraphs. This tween is
    // separated from the rest of the timeline because it needs to be triggered
    // independently if a scroll event occurs.
    let paragraphEntranceTween = gsap.from(
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

/** Animates the Night and Day banner. */
function animateNightDayBanner() {

    let imageTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: ".night-day-banner",
            scrub: 0.5,
            pin: true,
            start: "top-=48 top",
            once: true,
            onLeave: function (self) {
                self.scroll(self.start);
                self.disable();
                self.animation.progress(1);
                ScrollTrigger.refresh();
            },
        }
    });

    imageTimeline.set(".night-day-banner__image img", { rotate: 180 });

    imageTimeline.fromTo(".night-day-banner__image img", { yPercent: 5 }, {
        yPercent: -65,
        ease: "none",
        duration: 1,
    });

    imageTimeline.to(".night-day-banner__image img", {
        rotate: 90,
        scale: 2.5,
        duration: 0.5,
        ease: "sine.in",
        force3D: false,     // Prevents blurry scaling on WebKit browsers.
    }, ">-=0.5").add("imageHorizontalPoint", ">");

    imageTimeline.to(".night-day-banner__text-day span", {
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out",
    }, "<-=50%");

    imageTimeline.from(".night-day-banner__text-day span", {
        xPercent: 10,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out",
    }, "<");

    imageTimeline.to(".night-day-banner__image img", {
        scale: 1,
        rotate: 0,
        yPercent: 0,
        duration: 1,
        ease: "sine.out",
    }, "imageHorizontalPoint").add("imageEndPoint", ">");

    imageTimeline.add(function () {

        gsap.to(".night-day-banner__image-pen", {
            autoAlpha: 0,
        });

        gsap.to(".night-day-banner__image-iron", {
            autoAlpha: 1,
        });

        document.querySelector(".night-day-banner").classList
            .remove("t-light");
        document.querySelector(".night-day-banner").classList
            .add("t-dark");

    }, "<");

    imageTimeline.to(".night-day-banner__text-night span", {
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out",
    }, "imageEndPoint");

    imageTimeline.from(".night-day-banner__text-night span", {
        xPercent: -10,
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out",
    }, "<");

}

window.addEventListener("DOMContentLoaded", function () {

    gsap.registerPlugin(CustomEase);

    // Starts the landing banner animations when the images have all loaded.
    allLandingBannerImagesLoaded().then(function () {
        animateLandingBanner();
        animateNightDayBanner();
    });

});
