import { Button, Flex } from "@chakra-ui/react";
import React from "react";

const SortBy = ({ sortBy, setSortBy }) => {
  return (
    <Flex {...styles.wrapper}>
      <Button
        variant={sortBy === "ALL" ? "solid" : "link"}
        onClick={() => setSortBy("ALL")}
        minWidth="2em"
        width="3em"
        {...styles.button}
      >
        All
      </Button>
      <Button
        variant={sortBy === "PROTEIN" ? "solid" : "link"}
        onClick={() => setSortBy("PROTEIN")}
        minWidth={{ base: "4em", md: "5em" }}
        width={{ base: "4em", md: "5em" }}
        {...styles.button}
      >
        Protein
      </Button>
      <Button
        variant={sortBy === "CARBS" ? "solid" : "link"}
        onClick={() => setSortBy("CARBS")}
        minWidth="4em"
        width="4em"
        {...styles.button}
      >
        Carbs
      </Button>
      <Button
        variant={sortBy === "FAT" ? "solid" : "link"}
        onClick={() => setSortBy("FAT")}
        minWidth="2em"
        width="3em"
        {...styles.button}
      >
        Fat
      </Button>
    </Flex>
  );
};

export { SortBy };

// Styles

const styles = {
  wrapper: {
    direction: "row",
    justify: "center",
    width: "100%",
  },
  button: {
    color: "black",
  },
};
