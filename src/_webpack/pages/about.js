// Scripts for /about.html

// Copyright 2024 Qi Tianshi. All rights reserved.


document.addEventListener("DOMContentLoaded", function () {

    // Timeline for landing banner entrance animations.
    let landingBannerEntranceTimeline = gsap.timeline({defaults: {
        duration: 1,
        ease: "power4.out",
    }});

    // Enters the heading and its legibility gradient.
    landingBannerEntranceTimeline
        .from(
            ["#landing-banner .c-stacked-banner__content",
                "#landing-banner .c-legibility-gradient:nth-of-type(1)"],
            {
                x: "-1.5em",
                y: "1.5em",
                opacity: 0,
                delay: 0.5,
            }
    );

    // Slightly zooms the background image.
    landingBannerEntranceTimeline
        .to(
            "#landing-banner .c-stacked-banner__background",
            { scale: 1.025, },
            "<"
        );

});
