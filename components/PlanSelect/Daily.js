import { Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DndDraggableContext } from "../DndDraggableContext";
import { DndSortableContext } from "../DndSortableContext";
import { Droppable } from "../Droppable";
import { ItemListSelection } from "../ItemListSelection";
import { Sortable } from "../Sortable";

const Daily = ({ plates, setSchedule }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [lists, setLists] = useState({ "daily-droppable-id": [] });
  const [listEmpty, setListEmpty] = useState(true);

  // Listen to list changes
  useEffect(() => {
    const listNotEmpty = lists["daily-droppable-id"].length > 0;
    if (listNotEmpty) setListEmpty(false);
    else setListEmpty(true);
  }, [lists]);

  // Update active item
  useEffect(() => {
    // Strip "sortable-" or "copy-" prefix from id
    const rawId = activeId?.replace(/copy-|sortable-/g, "");
    const item = plates?.find((plate) => plate["_id"] === rawId);
    setActiveItem(item);
  }, [activeId]);

  // Keep lists and schedule values synced
  useEffect(() => {
    const listWithPlates = lists["daily-droppable-id"].map((plate) => {
      // Remove "sortable" or "copy" prefixes
      const plateId = plate.replace(/copy-|sortable-/g, "");
      // Find and return plate object
      const plateData = plates.find(({ _id }) => plateId === _id);
      return plateData;
    });

    const schedule = [listWithPlates];
    setSchedule(schedule);
  }, [lists]);

  const dndDraggableContextProps = {
    items: plates,
    setActiveId,
    lists,
    setLists,
  };

  const droppableFieldProps = {
    lists,
    setLists,
    setActiveId,
    plates,
    activeId,
    activeItem,
  };

  const itemListSelectionProps = { plates, activeId, activeItem };

  return (
    <DndDraggableContext {...dndDraggableContextProps}>
      {/* Droppable fields */}
      <Flex {...styles.daysContainer}>
        <DroppableField
          id="daily-droppable-id"
          styleProps={styles.day}
          {...droppableFieldProps}
        />

        {/* Drop instructions */}
        {listEmpty && (
          <Text {...styles.instructions}>
            Drag & drop your items to schedule your daily meals.
          </Text>
        )}
      </Flex>

      {/* Draggable selection items */}
      <ItemListSelection {...itemListSelectionProps} />
    </DndDraggableContext>
  );
};

const DroppableField = ({
  id,
  lists,
  setLists,
  setActiveId,
  styleProps,
  plates,
  activeId,
  activeItem,
}) => {
  const droppableProps = { id, lists, styleProps };

  const dndSortableContextProps = {
    droppableId: id,
    items: plates,
    setActiveId,
    lists,
    setLists,
    activeId,
    activeItem,
  };

  return (
    <Droppable {...droppableProps}>
      {/* Items in list */}
      <DndSortableContext {...dndSortableContextProps}>
        <Flex {...styles.droppableContent}>
          {lists[id].map((itemId) => {
            // Strip "sortable-" or "copy-" prefix from id
            const rawId = itemId.replace(/copy-|sortable-/g, "");
            const plate = plates?.filter((plate) => plate["_id"] === rawId);
            return (
              <Sortable key={itemId} id={itemId}>
                <Flex {...styles.item}>
                  <Image src={plate[0]["picture"]} {...styles.image} />
                </Flex>
              </Sortable>
            );
          })}
        </Flex>
      </DndSortableContext>
    </Droppable>
  );
};

export { Daily };

// Styles
const styles = {
  daysContainer: {
    justify: "center",
    align: "center",
    height: { base: "25vh", md: "30vh" },
    paddingTop: { base: "0", md: "1em" },
    marginTop: "1em",
  },
  day: {
    display: "flex",
    border: "1px solid rgba(150,150,150,0.1)",
    height: "100%",
    width: "100%",
    padding: "1em",
    justifyContent: "center",
    alignItems: "center",
  },
  instructions: {
    position: "absolute",
    color: "gray.300",
    textAlign: "center",
    maxWidth: "55vw",
  },
  item: {
    minWidth: { base: "4em", md: "6em" },
    marginRight: { base: "3", md: "5" },
    justify: "center",
  },
  image: {
    borderRadius: "full",
    boxSize: { base: "4em", md: "6em" },
    objectFit: "cover",
    draggable: "false", // Prevents image src from being dragged rather than image component
    _hover: {
      boxShadow: "0px 0px 15px -6px rgba(0,0,0,0.62)",
      transition: "boxShadow 2s ease-in-out",
    },
  },
  droppableContent: {
    direction: "row",
    align: "center",
    justify: "center",
    bg: "transparent",
  },
};
