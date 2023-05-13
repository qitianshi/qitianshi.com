// Toggles the color theme and saves the preference in storage.

// Copyright 2023 Qi Tianshi. All rights reserved.


const themePreferenceStorageKey = "user-theme-preference";

/**
 * Determines the color theme (light or dark) that should be applied based on
 * the user's preference, or the system default.
 * @returns {String} Either "light" or "dark".
 */
function getPreferredTheme() {

    if (preference = localStorage.getItem(themePreferenceStorageKey)) {

        // If a preference has already been set.
        return preference;

    } else {

        // Fallback
        return "auto";

    }

}

function savePreferredTheme(theme) {
    localStorage.setItem(themePreferenceStorageKey, theme);
}

function updateToggleWithSavedPreference(theme) {
    document.querySelector(`#sitewide-footer__color-theme-toggle [value=${theme}]`).checked = true;
}

function applyPreferredTheme(theme) {

    const bodyElementClasses = document.body.classList;

    // First remove all existing theme classes.
    bodyElementClasses.remove("t-light", "t-dark", "t-preference");

    switch (theme) {

        case "light":
            bodyElementClasses.add("t-light");
            break;

        case "dark":
            bodyElementClasses.add("t-dark");
            break;

        // By default, elements will already follow the browser default theme,
        // thus it's unnecessary to add the .t-preference class.
        default:
            break;

    }

}

function onUserChangeThemeToggle() {

    // Get the selected value from the input.
    const chosenTheme = document.querySelector("input[name='color-theme-toggle']:checked").value;

    applyPreferredTheme(chosenTheme);
    savePreferredTheme(chosenTheme);

}

window.onload = () => {

    const preferredTheme = getPreferredTheme();
    applyPreferredTheme(preferredTheme);
    updateToggleWithSavedPreference(preferredTheme);

    document
        .getElementById("sitewide-footer__color-theme-toggle")
        .addEventListener("change", onUserChangeThemeToggle);

}
