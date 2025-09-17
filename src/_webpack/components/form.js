// Manages forms.

// Copyright 2025 Qi Tianshi. All rights reserved.


import throttle from "lodash.throttle";

/**
 * @typedef {"default" | "waiting" | "success" | "failure"} SubmitButtonState
 *      States that may be displayed by the submit button of a form.
 */

var failedSubmitCount = 0;

/** reCAPTCHA site key. */
const reCaptchaSiteKey = "6LdKP8ErAAAAAO3NaAQ5q_-BpY_Jc6t-pubXOfGv";

var captchaLoaded = false;

/** The threshold for using the narrower layout of reCAPTCHA, in px. */
const captchaNarrowLayoutThreshold = 380;

/** The Sass mobile-padding variable, in px. */
const mobilePadding = 16;

/** The class assigned to active (visible) captcha containers. */
const captchaContainerActiveClass = "c-captcha--active";

/** The GSAP params for the entrance and exit of the captcha popup. */
const captchaPopupAnimationParams = {
    autoAlpha: 0,
    scale: 0,
    translateY: "-100%",
    duration: 0.3,
};

/**
 * Updates the submit button of a form to reflect the form submission state.
 *
 * @param {Element} targetButton - The submit button element that is being
 *     submitted.
 * @param {SubmitButtonState} state - The state to which the submit button
 *     will be updated.
 */
function updateSubmitButtonState(targetButton, state) {

    // Applies the class that corresponds to the state being applied.
    targetButton.classList.remove(
        "c-form__submit--default",
        "c-form__submit--waiting",
        "c-form__submit--success",
        "c-form__submit--failure"
    );
    targetButton.classList.add(`c-form__submit--${state}`);

    // Disables the button for waiting and success states.
    targetButton.disabled = (["waiting", "success"].includes(state));

}

/**
 * Updates the submit button status and activates the captcha challenge.
 *
 * @param {Event} event
 */
async function onFormSubmitted(event) {

    event.preventDefault();

    // The form that is being submitted, its submit button, and its data.
    const targetForm = event.target;
    const submitButton = targetForm.querySelector("button[type='submit']");
    const captchaContainer = document.querySelector(
        `div.c-captcha[data-form-id='${targetForm.id}'`);

    updateSubmitButtonState(submitButton, "waiting");
    activateCaptcha(captchaContainer, submitButton);

}

/**
 * Makes an AJAX request to submit the form's data to the `action` attribute of
 * the form, and updates the submit button of the form with the status. Appends
 * the captcha token to the form data. Dismisses the captcha popup.
 *
 * @param {Element} targetForm - The form being submitted.
 * @param {*} captchaToken - The captcha token.
 * @param {Element} captchaContainer - The captcha popup container.
 */
function submitFormData(targetForm, captchaToken, captchaContainer) {

    const submitButton = targetForm.querySelector("button[type='submit']");
    const submittedData = new FormData(targetForm);
    submittedData.append("g-recaptcha-response", captchaToken);

    // Animates the dismissal of the popup.
    gsap.to(captchaContainer, {
        ...captchaPopupAnimationParams,
        delay: 0.5,
        ease: "back.in",
        onComplete: function () {
            captchaContainer.classList.remove(captchaContainerActiveClass);
        },
    });

    fetch(targetForm.action, {

        method: targetForm.method,
        body: submittedData,
        headers: {
            "Accept": "application/json"
        }

    }).then(function (response) {

        // Interprets the response.

        if (response.ok) {

            // Submitted successfully.
            updateSubmitButtonState(submitButton, "success");
            failedSubmitCount = 0;

        } else {

            // Received a response with a failure status.

            //TODO: If the submission limit is hit, Formspree responds with
            //      code 429.

            failedSubmission(submitButton);

            // Tries to parse the result and logs the error to the console.
            response.json().then(data => {

                if (Object.hasOwn(data, 'errors')) {

                    console.error(
                        data["errors"]
                            .map((error) => error["message"])
                            .join(", ")
                    );

                } else {
                    console.error(
                        "An unknown error response was received while trying "
                        + "to submit a form."
                    );
                }

            });

        }

    }).catch(function (error) {

        // Handles errors that occur before the response is received.

        failedSubmission(submitButton);

        console.error(
            "An error occurred while making an AJAX request to submit a form.",
            error
        );

    }).finally(function () {

        // Controls the multiple failed submits warning if submission has
        // been repeatedly failing.

        targetForm
            .getElementsByClassName(
                "c-form__multiple-failed-submits-warning")[0]
            .style
            .display
            = failedSubmitCount >= 2 ? "block" : "none";

    });

}

/**
 * Handles a failure during submission.
 *
 * @param {Element} submitButton The submit button of the form.
 */
function failedSubmission(submitButton) {
    updateSubmitButtonState(submitButton, "failure");
    failedSubmitCount++;
}

/**
 * Dynamically changes the height of a textarea to always accommodate its
 * value.
 *
 * @param {Event} event
 */
function resizeTextarea(event) {

    // Each textarea is followed by a sizing element which is styled to exactly
    // match the text of the textarea; thus, by mirroring the text from the
    // textarea to the sizing element, the height of the textarea expands to
    // fit its contents.

    const targetTextarea = event.target;

    // Copies the value of the textarea to the sizing element.
    targetTextarea
        .parentElement
        .querySelector(
            `pre[id='${targetTextarea.id}__textarea-sizing'] > span`
        )
        .textContent
        = targetTextarea.value;

}

/**
 * Activates the captcha popup container.
 *
 * @param {Element} container - The captcha popup container element.
 * @param {Element} submitButton - The submit button element.
 */
function activateCaptcha(container, submitButton) {

    if (!captchaLoaded) {
        failedSubmission(submitButton);
        return;
    }

    container.classList.add(captchaContainerActiveClass);

    var positionContainer = function () {

        const submitRect = submitButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculates the x, y, and arrow of the popup.
        var targetTop = window.scrollY + submitRect.top + submitRect.height + 20;
        var targetCenter = window.scrollX + submitRect.left + submitRect.width / 2;
        var targetLeft = targetCenter - containerRect.width / 2;
        targetLeft = targetLeft < mobilePadding ? mobilePadding : targetLeft;
        var targetArrow = (targetCenter - targetLeft) / containerRect.width;

        container.style.top = `${targetTop}px`;
        container.style.left = `${targetLeft}px`;

        container.style.setProperty("--arrow-left", `${100 * targetArrow}%`);

    };

    // Positions it initially and adds an event listener.
    positionContainer();
    window.addEventListener(
        "resize",
        throttle(positionContainer, 50),
        { passive: true }
    );

    // Scrolls the window downward if the captcha popup is not fully visible.
    const containerRenderedRect = container.getBoundingClientRect();
    const containerRenderedBottom = (
        containerRenderedRect.top + containerRenderedRect.height + mobilePadding);
    if (containerRenderedBottom > window.innerHeight) {
        window.scrollBy({
            top: containerRenderedBottom - window.innerHeight,
            behavior: "smooth"
        });
    }

    // Animates the activation of the popup.
    gsap.from(container, {
        ...captchaPopupAnimationParams,
        ease: "back.out"
    });

}

// Callback when all reCAPTCHA dependencies have loaded.
window.onCaptchaLoaded = function () {

    captchaLoaded = true;

    // Compact size for narrower windows.
    const captchaSize = (
        window.innerWidth < captchaNarrowLayoutThreshold ? "compact" : "normal"
    );

    // Renders the captcha container for each element.
    document.querySelectorAll(".c-captcha").forEach(function (container) {

        document.body.appendChild(container);

        const formId = container.dataset.formId;
        const form = document.getElementById(formId);

        grecaptcha.render(
            container,
            {
                "sitekey": reCaptchaSiteKey,
                "callback": function (token) {
                    submitFormData(form, token, container);
                },
                "size": captchaSize,
            }
        );

    });
};

/**
 * Module for managing forms, including submission, state updating, and error
 * handling.
 */
const Form = {
    init: function () {

        // Adds an event listener to each textarea to resize it to fit its
        // contents.
        document
            .querySelectorAll(".c-form__text-field textarea")
            .forEach(function (textarea) {
                textarea.addEventListener("input", resizeTextarea);
            });

        // Adds an event listener to each form to handle submissions.
        document
            .querySelectorAll("form.c-form")
            .forEach(function (form) {
                form.addEventListener("submit", onFormSubmitted);
            });

    }
};

export default Form;
