// webpack entry point for main JavaScript, loaded with the `defer` attribute.

// Copyright 2023 Qi Tianshi. All rights reserved.


// Utils
import ColorTheme from "./utils/color-theme.js";

// Components
import Form from "./components/form.js";
import GlobalHeader from "./components/global-header.js";

// Arranged in order of importance.
ColorTheme.init();
GlobalHeader.init();
Form.init();
