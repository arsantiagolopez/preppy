import { extendTheme, theme as chakraTheme } from "@chakra-ui/react";
// Only show Chakra focus outlines when user is keyboard navigating
import "focus-visible/dist/focus-visible";

// Custom themes
const colors = {
  ...chakraTheme.colors,
  link: chakraTheme.colors.red["500"],
  brand: chakraTheme.colors.gray["800"],
};

const fonts = {
  ...chakraTheme.fonts,
  heading: "Helvetica",
  text: "Arial",
};

// Custom components
const components = {
  ...chakraTheme.components,
  Button: {
    baseStyle: {
      color: "white",
    },
    variants: {
      brand: {
        background:
          "linear-gradient(140deg, rgba(251,255,119,1) 0%, rgba(252,208,39,1) 100%)",
        boxShadow: "lg",
        borderRadius: "5em",
        _hover: {
          background:
            "linear-gradient(160deg, rgba(247,252,92,1) 0%, rgba(252,191,39,1) 100%)",
        },
        _focus: {
          background:
            "linear-gradient(160deg, rgba(247,252,92,1) 0%, rgba(252,191,39,1) 100%)",
        },
      },
    },
    defaultProps: {
      size: "lg",
    },
  },
  Heading: {
    baseStyle: {
      color: "gray.800",
      letterSpacing: "tighter",
    },
  },
  Text: {
    baseStyle: {
      color: "gray.800",
      letterSpacing: "tight",
    },
  },
  Input: {
    defaultProps: {
      color: "gray.800",
      variant: "flushed",
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  components,
});

export default theme;
