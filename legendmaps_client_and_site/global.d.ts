// A top-level global.d.ts file to add global type declarations.

import { CSSProp } from "styled-components";

// A react namespace augmentation to add support for the css prop in JSX
declare module "react" {
    interface Attributes {
        css?: CSSProp<AppTheme> | CSSObject;
    }
}

// *Note: Once the app's theme is defined; we can use the theme's type for autocompletion & support additional themes (light, dark, playoffs-light, playoffs-dark, etc, etc.)
// import { theme } from "...";
// type AppTheme = typeof theme;
// declare module "styled-components" {
//   interface DefaultTheme extends AppTheme {}
// }
