// webpack entry point for main JavaScript, loaded with the `defer` attribute.

// Copyright 2023 Qi Tianshi. All rights reserved.


// Utils
import ColorTheme from "./utils/color-theme";

// Components
import Form from "./components/form";
import GlobalHeader from "./components/global-header";

// Arranged in order of importance.
ColorTheme.init();
GlobalHeader.init();
Form.init();
