import {
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { DragOverlay } from "@dnd-kit/core";
import React, { useState } from "react";
import { Draggable } from "../Draggable";

const ItemListSelection = ({ plates, activeId, activeItem }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (value) => setTabIndex(value);

  const handleChangeIndex = (index) => setTabIndex(index);

  // Unique category values
  let categories;
  if (plates) {
    categories = [...new Set([...plates?.map(({ category }) => category)])];

    // Move "all" to front of array if exists
    if (categories.includes("all")) {
      categories = categories.filter((category) => category !== "all");
      categories.unshift("all");
    }
  }

  if (!plates) {
    return null;
  }

  return (
    <Tabs onChange={(value) => handleChange(value)} {...styles.tabs}>
      {/* Tab names */}
      <TabList {...styles.list}>
        {categories?.map((category, index) => (
          <Tab key={category} {...styles.tab}>
            <Heading
              color={tabIndex === index ? "brand" : "gray.300"}
              {...styles.category}
            >
              {category}
            </Heading>
          </Tab>
        ))}
      </TabList>

      {/* List of plates */}
      <TabPanels {...styles.panels}>
        {categories?.map((category) => {
          const categoryPlates = plates?.filter(
            (plate) => plate.category === category
          );
          return (
            <TabPanel
              key={category}
              index={tabIndex}
              onChange={handleChangeIndex}
              {...styles.panel}
            >
              <Flex {...styles.block} />

              {categoryPlates.map(({ _id, picture }) => (
                <Draggable key={_id} id={_id}>
                  <Flex {...styles.item}>
                    <Image src={picture} {...styles.image} />
                  </Flex>
                </Draggable>
              ))}
            </TabPanel>
          );
        })}
      </TabPanels>

      {/* Drag overlay of selected draggable item */}
      <DragOverlay>
        {activeId && activeItem && (
          <Flex {...styles.item}>
            <Image src={activeItem["picture"]} {...styles.image} />
          </Flex>
        )}
      </DragOverlay>
    </Tabs>
  );
};

export { ItemListSelection };

// Styles
const styles = {
  tabs: {
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    variant: "unstyled",
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100vw",
    background: "rgba(240,240,240,0.5)",
    paddingTop: "0",
    height: { base: "15vh", md: "19vh" },
    userSelect: "none",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: { base: "1em", md: "2em" },
    paddingTop: { base: "-2", md: "0" },
    paddingTop: "0",
    width: "100%",
    height: "100%",
    overflowX: "auto",
    overflowY: "hidden",
  },
  tab: {
    padding: "0",
    marginRight: "2",
    marginBottom: "-2",
  },
  category: {
    isTruncated: true,
    textTransform: "capitalize",
    paddingRight: "1",
    fontSize: { base: "3xl", md: "4xl" },
  },
  panels: {
    height: "100%",
  },
  panel: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "row",
    padding: "0",
    paddingBottom: "3",
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
  },
  block: {
    width: { base: "1em", md: "2em" },
    height: "100%",
    children: "padding",
    visibility: "hidden",
  },
  item: {
    minWidth: { base: "4em", md: "6em" },
    marginRight: { base: "1", md: "2" },
  },
  image: {
    borderRadius: "full",
    boxSize: { base: "4em", md: "6em" },
    objectFit: "cover",
    draggable: "false", // Prevents image src from being dragged rather than image component
    boxShadow: "2xl",
    _active: {
      boxShadow: "dark-lg",
    },
  },
};
