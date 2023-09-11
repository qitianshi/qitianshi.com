// Manages forms.

// Copyright 2023 Qi Tianshi. All rights reserved.


/**
 * Dynamically changes the height of a textarea to always accommodate its
 * value. Each textarea is followed by a sizing element which is styled to
 * exactly match the text of the textarea; thus, by mirroring the text from the
 * textarea to the sizing element, the height of the textarea expands to fit
 * its contents.
 */
function resizeTextarea() {

    // Gets all textarea elements that are part of a .c-form__text-field.
    const textareaNodes
        = document.querySelectorAll(".c-form__text-field textarea");

    // Adds an event listener to each textarea to listen for changes to its
    // value, and copies the value to the sizing element.
    textareaNodes.forEach(function (textarea) {
        textarea.addEventListener("input", function (event) {

            const targetTextarea = event.target;

            targetTextarea
                .parentElement
                .querySelector(
                    `pre[id='${targetTextarea.id}__textarea-sizing'] > span`
                )
                .textContent
                = targetTextarea.value;

        });
    });

}

const Form = {
    init: function () {

        resizeTextarea();

    }
};

export default Form;
