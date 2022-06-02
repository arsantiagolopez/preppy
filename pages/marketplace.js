import { AspectRatio, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import { Card } from "../components/Card";
import { DetailedPlate } from "../components/DetailedPlate";
import { Layout } from "../components/Layout";
import { SearchBar } from "../components/SearchBar";
import InitialResults from "../data/spoontacularInitialResults.json";

const Marketplace = () => {
  const [searchResults, setSearchResults] = useState(InitialResults);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("ALL");
  const [active, setActive] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { data: plates } = useSWR("/api/plates");
  const { data: categories } = useSWR("/api/categories");

  const detailedPlateProps = { active, setActive, plates, categories };
  const searchProps = {
    searchValue,
    setSearchValue,
    searchResults,
    setSearchResults,
    sortBy,
    setSortBy,
    InitialResults,
    isSearchLoading,
    setIsSearchLoading,
    setApiError,
  };

  return (
    <Layout
      hideMobileMainNav
      pageTitle="Marketplace"
      pageImage={process.env.NEXT_PUBLIC_MARKETPLACE_PAGE_IMAGE}
      pageDescription={process.env.NEXT_PUBLIC_MARKETPLACE_PAGE_DESCRIPTION}
    >
      <Flex {...styles.wrapper}>
        <SearchBar {...searchProps} />

        <Flex {...styles.plates}>
          {searchResults?.length
            ? searchResults?.map((plate, index) => {
                const { id, name, picture, calories } = plate;
                return (
                  <AspectRatio
                    key={id || index}
                    onClick={() => setActive(id)}
                    {...styles.aspect}
                  >
                    <Card
                      backgroundImage={`url(${picture})`}
                      opacity={isSearchLoading && "0.1"}
                      {...styles.card}
                    >
                      <Flex {...styles.meta}>
                        <Heading {...styles.name}>{name}</Heading>
                        <Text {...styles.calories}>{calories} cal</Text>
                      </Flex>
                      <DetailedPlate plate={plate} {...detailedPlateProps} />
                    </Card>
                  </AspectRatio>
                );
              })
            : !isSearchLoading && (
                <Flex {...styles.noResultsMessage}>
                  There aren&apos;t any plates related to your search. Try a
                  different search! 🔎
                </Flex>
              )}
          {
            // Search loading spinner
            isSearchLoading && <Spinner {...styles.spinner} />
          }
          {apiError && <Flex {...styles.noResultsMessage}>{apiError}</Flex>}
        </Flex>
      </Flex>
    </Layout>
  );
};

Marketplace.isProtected = true;

export default Marketplace;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingTop: "0.5em",
  },
  plates: {
    position: "relative",
    direction: "row",
    justify: "space-between",
    wrap: "wrap",
    paddingY: { base: "1.5em", md: "2em" },
  },
  aspect: {
    ratio: 1,
    flex: { base: "1 1 48.5%", md: "1 1 32%" },
    maxWidth: { base: "48.5%", md: "32%" },
    marginBottom: { base: "3%", md: "2%" },
    marginX: "0",
    width: "100%",
    boxShadow: "lg",
    borderRadius: { base: "1em", md: "1.5em" },
  },
  card: {
    cursor: "pointer",
    direction: "column",
    boxShadow: {
      base: "inset 0 -15vh 20vh -7vh rgba(0,0,0,0.8)",
      md: "inset 0 -30vh 30vh -15vh rgba(0,0,0,0.8)",
    },
    marginX: 0,
  },
  meta: {
    direction: "column",
    justify: "space-between",
    marginTop: "auto",
    width: "100%",
    paddingX: { base: "0.5em", md: "1.5em" },
    paddingY: { base: "0.5em", md: "1.5em" },
  },
  name: {
    size: "xl",
    lineHeight: "1.2em",
    color: "white",
    noOfLines: 2,
    textTransform: "capitalize",
  },
  calories: {
    color: "white",
  },
  noResultsMessage: {
    justify: "center",
    align: "center",
    marginX: "auto",
    width: { base: "90%", md: "100%" },
    height: "20vh",
    marginBottom: "2em",
    textAlign: "center",
  },
  spinner: {
    position: "absolute",
    top: { base: "3em", md: "7em" },
    left: "0",
    right: "0",
    marginX: "auto",
    size: "xl",
    color: "brand",
  },
};
