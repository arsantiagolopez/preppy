import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import axios from "../../axios";
import { showToast } from "../../utils/showToast";
import { SortBy } from "./SortBy";

const SearchBar = ({
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
}) => {
  const [originalResults, setOriginalResults] = useState(InitialResults);

  const searchRef = useRef(null);

  // Update search value on change
  const handleChange = (event) => setSearchValue(event.target.value);

  // Fetch results by query
  const getPlatesBySearch = async () => {
    const params = { query: searchValue };
    const { data, status } = await axios.get("/api/spoontacular", { params });

    // Handle success & update results
    if (status === 200) {
      // Handle Spoontacular API's exceeded error
      const { success, plates } = data;

      if (!success) {
        const { message } = data;

        // Display backend error
        setApiError(message);
        return showToast({ status: "error", title: message });
      }

      // Store orinal results in unmodified array
      setOriginalResults(plates);

      return setSearchResults(plates);
    } else {
      // Handle error by showing error toast
      return showToast({
        status: "error",
        title: "You search could not be completed. Please try again later.",
      });
    }
  };

  // Trigger search and make API calls
  const handleSearch = async () => {
    setIsSearchLoading(true);

    // Reset sort to "all"
    setSortBy("ALL");

    // Fetch results
    await getPlatesBySearch();

    setIsSearchLoading(false);
  };

  // Listen & trigger search when the enter key is pressed
  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !isSearchLoading) {
      await handleSearch();
    }
  };

  // Sort results base on sortBy
  useEffect(() => {
    // Reset search to original results
    if (sortBy === "ALL") {
      setSearchResults([...originalResults]);
    }
    // Sort by protein
    if (sortBy === "PROTEIN") {
      return setSearchResults([
        ...searchResults.sort((a, b) => b?.protein - a?.protein),
      ]);
    }
    // Sort by carbohydrates
    if (sortBy === "CARBS") {
      return setSearchResults([
        ...searchResults.sort((a, b) => b?.carbs - a?.carbs),
      ]);
    }
    // Sort by fat
    if (sortBy === "FAT") {
      return setSearchResults([
        ...searchResults.sort((a, b) => b?.fat - a?.fat),
      ]);
    }
  }, [sortBy]);

  const sortByProps = { sortBy, setSortBy };

  return (
    <>
      <InputGroup ref={searchRef} {...styles.wrapper}>
        <InputLeftElement {...styles.icon}>
          <IoSearchSharp color="lightgray" />
        </InputLeftElement>
        <Input
          placeholder="Search anything..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          paddingRight={searchValue !== "" ? "5em" : "5.25em"}
          {...styles.input}
        />
        {searchValue !== "" && (
          <InputRightElement
            pointerEvents={isSearchLoading ? "none" : "auto"}
            width={isSearchLoading ? { base: "3em", md: "4em" } : "5.75em"}
            marginY="1"
          >
            {isSearchLoading ? (
              <Spinner {...styles.spinner} />
            ) : (
              <Button onClick={handleSearch} {...styles.button}>
                Search
              </Button>
            )}
          </InputRightElement>
        )}
      </InputGroup>

      {/* Search term */}
      <Heading {...styles.searchValue}>
        {searchValue && !searchResults ? searchValue : "Our Favorites"}
      </Heading>

      {/* Sort by */}
      <SortBy {...sortByProps} />
    </>
  );
};

export { SearchBar };

// Styles

const styles = {
  wrapper: {
    zIndex: 5,
    position: "sticky",
    top: { base: "4em", md: "7.4em" },
    direction: "column",
    width: "100%",
    marginTop: "0.5em",
  },
  icon: {
    pointerEvents: "none",
    marginTop: "1",
  },
  input: {
    isTruncated: true,
    spellCheck: "false",
    borderRadius: "0.5em",
    border: "1px solid rgba(200,200,200,0.3)",
    size: "lg",
    focusBorderColor: "brand",
    background: "white",
  },
  spinner: {
    color: "brand",
    size: "md",
    thickness: "2px",
  },
  button: {
    height: "2.5em",
    size: "md",
    background: "brand",
  },
  searchValue: {
    size: "2xl",
    alignSelf: "center",
    paddingY: "0.5em",
  },
};
