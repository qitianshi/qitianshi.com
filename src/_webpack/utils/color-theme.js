// Manages the color theme toggle in the global footer.

// Copyright 2024 Qi Tianshi. All rights reserved.



/**
 * @typedef {"auto" | "light" | "dark"} ColorTheme Represents a user's
 *      preferred color theme.
 */

const themePreferenceStorageKey = "user-theme-preference";

/**
 * Checks localStorage if a color theme has previously been specified,
 * otherwise uses the default.
 *
 * @returns {ColorTheme} The preferred color theme.
 */
function getPreferredTheme() {

    const preference = localStorage.getItem(themePreferenceStorageKey);

    // Returns preference if it has already been set; if not, "auto".
    return preference ? preference : "auto";

}

/**
 * Saves the preferred color theme to localStorage.
 *
 * @param {ColorTheme} theme - The theme to be saved.
 */
function savePreferredTheme(theme) {
    localStorage.setItem(themePreferenceStorageKey, theme);
}

/**
 * Updates the color theme toggle in the global footer to reflect the
 * currently applied color theme. Only necessary when the page is being loaded,
 * or when some script other than the toggle causes the color theme to be
 * changed.
 *
 * @param {ColorTheme} theme - The theme to be applied.
 */
function updateToggleWithSavedPreference(theme) {

    // Selects the option whose value corresponds to the selected theme.
    document
        .querySelector(`.global-footer__color-theme-toggle [value=${theme}]`)
        .checked
        = true;

}

/**
 * Applies the preferred color theme to the webpage.
 *
 * @param {ColorTheme} theme - The theme to be applied.
 */
function applyPreferredTheme(theme) {

    // When this function is called through initPreload(), the <body> tag has
    // not yet been parsed. To prevent the page from flashing due to the
    // default theme rendering first then being replaced by the preferred
    // theme, the class is applied to the <html> tag.
    const htmlElementClasses = document.firstElementChild.classList;

    // Removes all existing theme classes first.
    htmlElementClasses.remove("t-light", "t-dark", "t-auto");

    switch (theme) {

        case "light":
            htmlElementClasses.add("t-light");
            break;

        case "dark":
            htmlElementClasses.add("t-dark");
            break;

        // By default, elements will already follow the browser default theme,
        // so it's unnecessary to add the .t-auto class.
        default:
            break;

    }

}

/**
 * Handles the event of the user choosing a color theme. Applies the theme and
 * saves the preference.
 */
function onUserChangeThemeToggle() {

    // Get the selected value from the input.
    const chosenTheme = document
        .querySelector("input[name='color-theme-toggle']:checked")
        .value;

    applyPreferredTheme(chosenTheme);
    savePreferredTheme(chosenTheme);

}

/**
 * Module for managing the website's color theme, including retrieving
 * previously saved preferences and managing theme toggles.
 */
const ColorTheme = {

    init: function () {

        // If a theme has already been set, the selected toggle option is
        // updated.
        updateToggleWithSavedPreference(getPreferredTheme());

        // Adds the event listener for the user choosing a color theme.
        document
            .querySelector(".global-footer__color-theme-toggle")
            .addEventListener("change", onUserChangeThemeToggle);

    },

    initPreload: function () {

        // Applies the preferred theme if it has previously been set.
        applyPreferredTheme(getPreferredTheme());

    },

};

export default ColorTheme;
