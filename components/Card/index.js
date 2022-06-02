import { Flex } from "@chakra-ui/react";
import React from "react";

/**
 * Card wrapper that applies default card styles to children.
 * @param {children} children - Card content.
 * @param {boolean} props - Style props to be spread on the card.
 */

const Card = ({ children, ...props }) => {
  return (
    <Flex {...styles.wrapper} {...props}>
      {children}
    </Flex>
  );
};

export { Card };

// Styles

const styles = {
  wrapper: {
    borderRadius: { base: "1em", md: "1.5em" },
    boxShadow: "xl",
    width: "100%",
    marginBottom: "1em",
    marginRight: "1em",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};
