import { Flex } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Flex {...styles.wrapper}>
      <a
        href={process.env.NEXT_PUBLIC_PORTFOLIO}
        rel="noreferrer"
        target="_blank"
      >
        Designed with ❤️ by <span style={styles.text}>Alex.</span>
      </a>
    </Flex>
  );
};

export { Footer };

// Styles

const styles = {
  wrapper: {
    display: "flex",
    justify: "center",
    align: "center",
    fontFamily: "Times New Roman",
    fontStyle: "italic",
    paddingTop: "2rem",
    paddingBottom: "3rem",
    textColor: "gray.400",
  },
  text: {
    marginLeft: "0.25rem",
    textDecoration: "underline",
  },
};
