import styled, { createGlobalStyle } from "styled-components";
import { maxPageWidth, palette, pageBodyPadding, breakpoints } from "../../../styles/styleUtils";

import Header from "./Header";
import settings from "../../../settings";
import DevAuthForm from "./DevAuthForm";
import Footer, { footerHeight } from "./Footer";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../stores/with-root-store";
import ClientOnly from "../../../util/ClientOnly";
import { useRootStore } from "../../../store";
import { css } from "@emotion/react";
import { observer } from "mobx-react-lite";
import { ErrorPopup } from "../ui/ErrorPopup";

export const headerHeight = 115;

const LayoutContainer = styled.div`
    padding-top: ${headerHeight + 25}px;
    transition: 0.4s all ease;
`;

const PageContainer = styled.div`
    margin: 0px auto;
    max-width: ${maxPageWidth};
    padding: 0 ${pageBodyPadding};
`;

const GlobalStyles = createGlobalStyle`

@font-face {
  font-family: "alagard";
  src: url("/fonts/alagard/alagard-regular.ttf");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

html, body {
  margin: 0;
  padding: 0;
  height: auto !important;
  font-size: 100;
}
html {
  font-family: Roboto, Arial, sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen,
  Ubuntu, Cantarell, 'Open Sans';
}
.web3modal-modal-card{
  border: 2px solid #fff;
}
body {
  font-family: inherit;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: ${palette.primary.black};
  top: 0;
  background-color: rgb(0, 0, 0);
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: scroll;
  color: ${palette.primary.black};
  line-height: 1.5;
  font-size: inherit;
  min-height: 100vh;
  min-width: 100%;
  font-smooth: antialiased;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  overflow: hidden;
  max-width: 100%;
  will-change: scroll-position;
  padding-bottom: ${footerHeight}px;
}

h1 {
  font-size: 4rem;
  letter-spacing: 5px;
}

h2{
  font-size: 3rem;
  letter-spacing: 5px;
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2rem;
  }
}


#root {
  font-family: "Roboto", sans-serif;
}
#root *, #root *:after, #root *:before {
  box-sizing: border-box;
}
#root *:after, #root *:before {
  pointer-events: none;
}
* {
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
p, h1, h2, h3, h4, h5, pre, code, .u-selectable {
  user-select: text;
  -webkit-user-select: text;
  -webkit-touch-callout: default;
  white-space: normal;
}
input,
textarea,
select {
  user-select: text;
  -webkit-touch-callout: default;
}
input::selection,
textarea::selection {
  background-color: rgba(0, 0, 0, 0.4);
}
body p {
  margin-bottom: 0;
  padding: 0;
  line-height: 1.5em;
  font-size: inherit;
  text-rendering: optimizeLegibility;
}

body button, body a {
  cursor: pointer;
  text-transform: none;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 0;
  border-radius: 0;
  background: transparent;
  line-height: 1;
  font: inherit;
  outline: none;
  /* :-webkit-any-link {
  }

  :-moz-any-link {
  }

  :any-link {
  }  */
}
button:active, a:active {
  outline: none;
  overflow: hidden;
}
body button, body input, body optgroup, body select, body textarea {
  color: inherit;
  font: inherit;
  margin: 0;
}
button > *, a > * {
  pointer-events: none;
}
*:disabled {
  pointer-events: none;
  cursor: default;
}

@font-face {
  font-family: 'DINPro-CondBold';
  src: local('DINProCondBoldWOFF2') format('woff2'), local('DINProCondBoldWOFF') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: block;
}

html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  font: 112.5%/1.45em courier, monospace, sans-serif;
  box-sizing: border-box;
  overflow-y: scroll;
}
body {
  background-color: black;

  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  font-family: courier, monospace;
  font-weight: normal;
  word-wrap: break-word;
  font-kerning: normal;
  -moz-font-feature-settings: "kern", "liga", "clig", "calt";
  -ms-font-feature-settings: "kern", "liga", "clig", "calt";
  -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
  font-feature-settings: "kern", "liga", "clig", "calt";
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
main,
menu,
nav,
section,
summary {
  display: block;
}
audio,
canvas,
progress,
video {
  display: inline-block;
}
audio:not([controls]) {
  display: none;
  height: 0;
}
progress {
  vertical-align: baseline;
}
[hidden],
template {
  display: none;
}
a {
  background-color: transparent;
  color: #cccccc;
  -webkit-text-decoration-skip: objects;
}
a:active,
a:hover {
  outline-width: 0;
}
abbr[title] {
  border-bottom: 1px dotted hsla(0, 0%, 0%, 0.5);
  cursor: help;
  text-decoration: none;
}
b,
strong {
  font-weight: inherit;
  font-weight: bolder;
}
dfn {
  font-style: italic;
}
h1 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: alagard, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 2.25rem;
  line-height: 1.1;
}
h2 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: alagard, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 2.25rem;
  line-height: 1.1;
}
mark {
  background-color: #ff0;
  color: #000;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
img {
  border-style: none;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
svg:not(:root) {
  overflow: hidden;
}
code,
kbd,
pre,
samp {
  font-family: monospace;
  font-size: 1em;
}
figure {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
hr {
  box-sizing: content-box;
  overflow: visible;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: calc(1.45rem - 1px);
  background: hsla(0, 0%, 0%, 0.2);
  border: none;
  height: 1px;
}
button,
input,
optgroup,
select,
textarea {
  font: inherit;
  margin: 0;
}
optgroup {
  font-weight: 700;
}
button,
input {
  overflow: visible;
}
button,
select {
  text-transform: none;
}

button {
  background: #000;
  border-radius: 0;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #fff;
  border-color: #fff;
  color: #000;
}

[type="reset"],
[type="submit"],
button,
html [type="button"] {
  -webkit-appearance: button;
}
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner,
button::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring,
button:-moz-focusring {
  outline: 1px dotted ButtonText;
}
fieldset {
  border: 1px solid silver;
  padding: 0.35em 0.625em 0.75em;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
legend {
  box-sizing: border-box;
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}

textarea {
  overflow: auto;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box;
  padding: 0;
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.54;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
* {
  box-sizing: inherit;
}
*:before {
  box-sizing: inherit;
}
*:after {
  box-sizing: inherit;
}
h2 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: .5rem;
  color: inherit;
  font-family: alagard, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 2rem;
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.5rem;
  }
}
h3 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: .4rem;
  color: inherit;
  font-family: courier, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 1.38316rem;
  line-height: 1.1;
}
h4 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: courier, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 1rem;
  line-height: 1.1;
}
h5 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: courier, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 0.85028rem;
  line-height: 1.1;
}
h6 {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  color: inherit;
  font-family: courier, monospace;
  font-weight: bold;
  text-rendering: optimizeLegibility;
  font-size: 0.78405rem;
  line-height: 1.1;
}
hgroup {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}

ul {
  margin-left: 2.1rem;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  list-style-position: outside;
  list-style-image: none;
}
li {
    padding-top: 0;
    padding-bottom: .5rem;
    margin-top: calc(.8rem / 2);
    margin-bottom: calc(.8rem / 2);
    
  }

ol {
  margin-left: 1.45rem;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
  list-style-position: outside;
  list-style-image: none;
}
dl {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
dd {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
p {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
pre {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0rem;
  font-size: 1rem;
  line-height: 1rem;
  border-radius: 0px;
  overflow: auto;
  word-wrap: normal;
}
table {
  padding: 0;
  margin: 0;
  font-size: 1rem;
  line-height: 1.45rem;
  border: 1px solid #555;
  width: 100%;
}
tr, th {
    border: 1px solid #555;
    padding: .5rem;
    margin: 0;
}
td {
    border: 1px solid #555;
    padding: .5rem !important;
    margin: 0;
}
blockquote {
  margin-left: 1.45rem;
  margin-right: 1.45rem;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
form {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
noscript {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
iframe {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
address {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  margin-bottom: 1.45rem;
}
b {
  font-weight: bold;
}
strong {
  font-weight: bold;
}
dt {
  font-weight: bold;
}
th {
  font-weight: bold;
}


blockquote *:last-child {
  margin-bottom: 0;
}
li *:last-child {
  margin-bottom: 0;
}
p *:last-child {
  margin-bottom: 0;
}
li > p {
  margin-bottom: calc(1.45rem / 2);
}
code {
  font-size: 0.85rem;
  line-height: 1.45rem;
}
kbd {
  font-size: 0.85rem;
  line-height: 1.45rem;
}
samp {
  font-size: 0.85rem;
  line-height: 1.45rem;
}
abbr {
  border-bottom: 1px dotted hsla(0, 0%, 0%, 0.5);
  cursor: help;
}
acronym {
  border-bottom: 1px dotted hsla(0, 0%, 0%, 0.5);
  cursor: help;
}
thead {
  text-align: left;
}
td,
th {
  text-align: left;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.12);
  font-feature-settings: "tnum";
  -moz-font-feature-settings: "tnum";
  -ms-font-feature-settings: "tnum";
  -webkit-font-feature-settings: "tnum";
  padding-left: 0.96667rem;
  padding-right: 0.96667rem;
  padding-top: 0.725rem;
  padding-bottom: calc(0.725rem - 1px);
}
th:first-child,
td:first-child {
  padding-left: 0;
}
th:last-child,
td:last-child {
  padding-right: 0;
}
tt,
code {
  background-color: hsla(0, 0%, 0%, 0.04);
  border-radius: 3px;
  font-family: "SFMono-Regular", Consolas, "Roboto Mono", "Droid Sans Mono", "Liberation Mono", Menlo, Courier,
    monospace;
  padding: 0;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
}
pre code {
  background: none;
  line-height: 1.42;
}
code:before,
code:after,
tt:before,
tt:after {
  letter-spacing: -0.2em;
  content: " ";
}
pre code:before,
pre code:after,
pre tt:before,
pre tt:after {
  content: "";
}

.slick-slider {
  width: 100%;
  padding: 0rem;
  margin: 0rem auto 0.5rem;
  height: auto;
  border: 0px solid #333;
}

.slick-initialized {
  line-height: 0rem;
  margin: 0rem;
  padding: 0rem;
  height: auto;
}

.slick-dots{
  margin: 0;
    padding: 0;
  .slick-active{
    button{
      &:before{
        
      }
    }
  }
  li{
    margin: 0;
    padding: 0;
     button{
       

       &:before{
         color: #cccccc !important;
       }

    }
  }
}

.flex-container {
  width: 90%;
  margin: 0rem auto 1rem;
}

.flex-container {
  display: flex;
}

.flex-container-wrap {
  display: flex;
  flex-wrap: wrap;
}

.two-thirds {
  width: 66.66666667%;
}

.third {
  width: 33.3333333%;
}

.slidetop {
  margin: 0rem;
  padding: .5rem 0rem 0rem 1.5rem;
  width: 100%;
  white-space: nowrap;
}

.slidebot {
  margin: 0rem;
  border-top: 1px #999999 solid;
  padding: 1rem 0.5rem 0.1rem 0.5rem;
  width: 100%;
  overflow: hidden;
}

.slidebotcol {
  padding-right: 0rem;
  margin: 0rem;
}

.slidebotcol:not(:first-child) {
  padding-left: 0.4rem;
}

@media only screen and (max-width: 480px) {
  html {
    font-size: 100%;
  }
}


@media only screen and (max-width: 700px) {
  .info_twocol {
    display: block;
  }

  .info_twocol_left {
    width: 100%;
    margin: auto;
    padding: 0rem;
  }
  .info_twocol_right {
    width: 100%;
    padding: 0rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0rem;
    text-align: center;
  }
  .info_twocol_wide_left {
    width: 100%;
    margin: auto;
    padding: 0rem;
  }
  .info_twocol_wide_right {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0rem;
    text-align: center;
  }
}

@media only screen and (min-width: 700px) {
  .info_twocol {
    display: flex;
  }
  .info_twocol_left {
    width: 78%;
  }
  .info_twocol_right {
    width: 22%;
    margin-top: auto;
    margin-bottom: auto;
  }
  .info_twocol_wide_left {
    width: 70%;
  }
  .info_twocol_wide_right {
    width: 30%;
    margin-top: auto;
    margin-bottom: auto;
  }
}

.rarityData {
  font-size: 0.9em;
  line-height: 1.1rem;
  margin-bottom: 1rem;
  display: block;
}


header{
  position:fixed;
  width: 100%;
  top: 0;
  z-index: 4;
  overflow: visible;


  &.sticky {
    border-bottom: 1px solid ${palette.primary.gray};
  }


  .header-left{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .header-wrapper{
    margin: 0 auto;
    width: 100%;
    display: flex;
    max-width: 1180px;
    margin: 5px auto 0px auto;
    
    .nav-items{
      @media (max-width: ${breakpoints.tablet}) {
        display: none;
      }
      display: flex;
      align-items: center;
      margin-right: 20px;
      white-space: pre-wrap;


      div.nav-link:not(:last-of-type){
        margin-right: 35px;
      }
      .nav-link {
        text-align: center;
        a {
          text-decoration: none;
        }
      }
      .active-link{
        cursor: pointer;
        padding: 5px 8px 5px 8px;
      }
    }
    .logo-wrapper{
      cursor: pointer;
      align-self: center;
      margin: 1rem auto 0;
      margin-right: 60px;
      max-width: 150px;
      &.sticky {
        margin: 8px 50px 0 0;
        width: 150px;
      }
    }

    .header-desk{
      display: flex;
      align-items: center;
      padding: 0 10px;
      width: 100%;
    }

    .header-connect{
      margin-left: auto
    }

    .header-social{
      margin-left: 10px;
      display: flex;
      max-height: ${headerHeight}px;
      a{
        width: 60px;
        display: flex;
        justify-content: center;
      }
    }
  }
}

.dg.main{
  margin-top: 120px;
}

.dg .c select{
  background : #000;
}

.rarityCommon, .common {
  color: ${palette.secondary.common};
  font-weight: 650;
}

.rarityUncommon, .uncommon {
  color: ${palette.secondary.uncommon};
  font-weight: 650;
}

.rarityRare, .rare {
  color: ${palette.secondary.rare};
  font-weight: 650;
}

.rarityEpic, .epic {
  color: ${palette.secondary.epic};
  font-weight: 650;
}

.rarityLegendary, .legendary {
  color: ${palette.secondary.legendary};
  font-weight: 750;
}

.section-title{
  width: 100%;
  text-align: center;
  margin-top: 30px;
}

input.search{
  background: #000;
  border: 1px solid ${palette.secondary.white};
  color: ${palette.secondary.white};
  padding: 0 10px;
  min-height: 38px;
  margin-top: 1px ;
}

`;

export const StyledPageContainer = styled.div<{ width?: number }>`
    max-width: ${({ width }) => (width ? width : 960)}px;
    margin: 0 auto;
`;

export const Paragraph = styled.div`
    margin-bottom: 2rem;
`;

export const RightSideBar = styled.div`
    @media (min-width: ${breakpoints.mobile}) {
        float: right;
        width: 40%;
    }
    @media (max-width: ${breakpoints.mobile}) {
        width: 100%;
    }
    display: block;
    position: relative;
    border: 1px solid #444;
    padding: 1rem;
    margin-left: 0.5rem;
    @media (max-width: ${breakpoints.mobile}) {
        margin: 0.5rem 0;
    }
`;

const Layout = observer(({ children }): JSX.Element => {
    if (typeof window !== "undefined") {
        const devLoggedIn = localStorage.getItem("devauth") === settings.DEV_AUTH_PASSWORD;

        if (settings.APP_ENV === "development" && !devLoggedIn) {
            return <DevAuthForm />;
        }
    }
    const [showGameHeader, setShowGameHeader] = useState(false);

    const router = useRouter();
    const { gameStore } = useRootStore();
    useEffect(() => {
        setShowGameHeader(
            router.pathname === "/game" &&
                gameStore.activeGameScreen !== "landing" &&
                gameStore.activeGameScreen !== "splash",
        );
    }, [gameStore.activeGameScreen, router.pathname]);
    return (
        <>
            <GlobalStyles />

            <LayoutContainer
                css={css`
                    padding-top: ${showGameHeader ? 0 : 140}px;
                `}
            >
                <ClientOnly>
                    <Header />
                    <ErrorPopup />
                </ClientOnly>
                <PageContainer>{children}</PageContainer>
                <Footer />
                <div id="modal-root" />
            </LayoutContainer>
        </>
    );
});

export default Layout;
