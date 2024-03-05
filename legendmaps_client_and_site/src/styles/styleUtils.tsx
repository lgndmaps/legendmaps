import { useMediaQuery } from "react-responsive";
export const rootFontSize = 16;
export const pxToRem = (px: number) => `${(px / rootFontSize).toFixed(2)}rem`;

// Primary Colors
const black = "#000";
const gray = "#636363";
const yellow = "#D0B05C";
// Secondary Colors
const white = "#fff";
const textGray = "#707070";
const legendary = " rgb(224, 153, 0)";
const epic = "rgb(168, 0, 219)";
const rare = "rgb(4, 83, 253)";
const uncommon = "rgb(0, 179, 39)";
const common = "rgb(160, 160, 160)";
const error = "rgb(253, 148, 148)";

export const palette = {
    primary: {
        black,
        gray,
        yellow,
    },
    secondary: { white, textGray, legendary, epic, rare, uncommon, common, error },
};

export const maxWidth = "1440px";
export const maxPageWidth = "1440px";
export const pageBodyPadding = "20px";

export const breakpoints = {
    small: "0px,",
    mobileMid: "480px",
    mobile: "640px",
    tabletSmall: "850px",
    tablet: "1000px",
    laptop: "1200px",
    xxlarge: "1440px",
};

export const useBreakpoints = () => {
    const isMobileSmall = useMediaQuery({ query: "(max-width: 325px)" });
    const isMobileMid = useMediaQuery({
        query: `(max-width: ${breakpoints.mobileMid})`,
    });
    const isMobileFloor = useMediaQuery({
        query: `(max-width: ${breakpoints.mobile})`,
    });

    const isTabletFloor = useMediaQuery({
        query: `(max-width: ${breakpoints.mobile + 1})`,
    });
    const isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
    const isTabletCeil = useMediaQuery({
        query: `(max-width: ${breakpoints.tablet})`,
    });

    const isLaptopFloor = useMediaQuery({
        query: `(max-width: ${breakpoints.tablet + 1})`,
    });
    const isLaptopCeil = useMediaQuery({ query: "(max-width: 1440px)" });

    const isXHDFloor = useMediaQuery({ query: "(max-width: 1441px)" });
    const isXHDCeil = useMediaQuery({ query: "(max-width: 4096px)" });

    return {
        isMobileSmall,
        isMobileMid,
        isMobileFloor,
        isTabletFloor,
        isTabletMid,
        isTabletCeil,
        isLaptopFloor,
        isLaptopCeil,
        isXHDFloor,
        isXHDCeil,
    };
};

export const niceScrollbars = `
scrollbar-width: thin !important; /* Firefox */
scrollbar-color: #ffffff #ffffff !important;
visibility: visible !important;

&::-webkit-scrollbar-track {
  background: transparent !important;
  transition: 0.2s background ;
  visibility: visible !important;

}

&::-webkit-scrollbar {
  width: 7px !important;
  height: 7px !important;
  background: transparent !important;
  transition: 0.2s background ;
}

&::-webkit-scrollbar-thumb {
background: transparent !important;
visibility: visible !important;
transition: 0.2s background ;
}

&:hover {
  &::-webkit-scrollbar-track {
    background: linear-gradient(90deg, transparent 0%, transparent 40%, #fff3 40%, #fff3 60%, transparent 60%, transparent 100%) !important;
  }
  
  &::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
    background: transparent !important;
  }
  
  &::-webkit-scrollbar-thumb {
  background: #ffffff !important;
  visibility: visible !important;
  }
}
`;
