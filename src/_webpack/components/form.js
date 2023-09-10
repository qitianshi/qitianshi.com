// Manages forms.

// Copyright 2023 Qi Tianshi. All rights reserved.


/**
 * Dynamically changes the height of a textarea to always accommodate its
 * value.
 */
function resizeTextarea() {

    // Gets all textarea elements that are part of a .c-form__text-field.
    const textareaNodes
        = document.querySelectorAll(".c-form__text-field textarea");

    // Adds the sizing element and an event listener to mirror its contents.
    textareaNodes.forEach(function (textarea) {

        // Adds HTML for the sizing element to the end of every textarea field:
        // <pre id="${textarea.id}__textarea-sizing"><span></span><br></pre>
        // The span will contain the mirrored text from the textarea. br
        // ensures trailing newlines are rendered correctly.
        const sizingElement = document.createElement("pre");
        sizingElement.id = `${textarea.id}__textarea-sizing`;
        sizingElement.innerHTML = "<span></span><br>";
        textarea.parentElement.appendChild(sizingElement);

        // Adds an event listener for changes to the input, which copies the
        // value of the textarea to the sizing element.
        textarea.addEventListener("input", function (event) {

            const targetTextarea = event.target;

            targetTextarea
                .parentElement
                .querySelector("pre[id$='__textarea-sizing'] > span")
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
