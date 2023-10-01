// Manages forms.

// Copyright 2023 Qi Tianshi. All rights reserved.


/**
 * Dynamically changes the height of a textarea to always accommodate its
 * value.
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

    }
};

export default Form;
