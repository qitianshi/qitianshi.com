// Manages forms.

// Copyright 2023 Qi Tianshi. All rights reserved.


/**
 * @typedef {"default" | "waiting" | "success" | "failure"} SubmitButtonState
 *      States that may be displayed by the submit button of a form.
 */

var failedSubmitCount = 0;

/**
 * Updates the submit button of a form to reflect the form submission state.
 *
 * @param {Element} targetButton The submit button element that is being
 *      submitted.
 * @param {SubmitButtonState} state The state to which the submit button
 *      will be updated.
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
 * Makes an AJAX request to submit the form's data to the `action` attribute of
 * the form, and updates the submit button of the form with the status.
 *
 * @param {Event} event
 */
async function onFormSubmitted(event) {

    event.preventDefault();

    // The form that is being submitted, its submit button, and its data.
    const targetForm = event.target;
    const submitButton = targetForm.querySelector("button[type='submit']");
    const submittedData = new FormData(targetForm);

    updateSubmitButtonState(submitButton, "waiting");

    // Sends an AJAX request to submit the form.
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

            updateSubmitButtonState(submitButton, "failure");
            failedSubmitCount++;

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

        updateSubmitButtonState(submitButton, "failure");
        failedSubmitCount++;

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
