import { Flex, Image, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DndDraggableContext } from "../DndDraggableContext";
import { DndSortableContext } from "../DndSortableContext";
import { Droppable } from "../Droppable";
import { ItemListSelection } from "../ItemListSelection";
import { Sortable } from "../Sortable";

const Weekly = ({ plates, setSchedule }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [lists, setLists] = useState({});

  const days = [...moment.weekdaysShort().slice(1), moment.weekdaysShort()[0]];

  // Make array of week days & set state
  useEffect(() => {
    const droppableIdsArr = days.map(
      (_, index) => `weekly-droppable-id-day-${index}`
    );

    let droppablesObj = {};

    droppableIdsArr.forEach((droppableId) => {
      droppablesObj[droppableId] = [];
    });

    setLists(droppablesObj);
  }, []);

  // Update active item
  useEffect(() => {
    // Strip "sortable-" or "copy-" prefix from id
    const rawId = activeId?.replace(/copy-|sortable-/g, "");
    const item = plates.find((plate) => plate["_id"] === rawId);
    setActiveItem(item);
  }, [activeId]);

  // Keep lists and schedule values synced
  useEffect(() => {
    const listsWithPlates = Object.keys(lists).map((key) =>
      lists[key].map((plate) => {
        // Remove "sortable" or "copy" prefixes
        const plateId = plate.replace(/copy-|sortable-/g, "");
        // Find and return plate object
        const plateData = plates.find(({ _id }) => plateId === _id);
        return plateData;
      })
    );
    setSchedule(listsWithPlates);
  }, [lists]);

  const dndDraggableContextProps = {
    setActiveId,
    lists,
    setLists,
    items: plates,
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
        {days.map((_, index) => (
          <DroppableField
            key={`weekly-droppable-id-day-${index}`}
            id={index}
            styleProps={{
              ...styles.day,
              ...{ borderRightWidth: index === 6 ? "1px" : "0" },
            }}
            {...droppableFieldProps}
          >
            <Text paddingX="1">{days[index]}</Text>
          </DroppableField>
        ))}
      </Flex>

      {/* Draggable selection items */}
      <ItemListSelection {...itemListSelectionProps} />
    </DndDraggableContext>
  );
};

const DroppableField = ({
  children,
  id,
  lists,
  setLists,
  setActiveId,
  styleProps,
  plates,
  activeId,
  activeItem,
}) => {
  const droppableProps = { lists, styleProps };

  const dndSortableContextProps = {
    setActiveId,
    lists,
    setLists,
    items: plates,
    activeId,
    activeItem,
  };

  return (
    <Droppable id={`weekly-droppable-id-day-${id}`} {...droppableProps}>
      {/* Children contains day of week header */}
      <Flex {...styles.dayHeader}>{children}</Flex>

      {/* Items in list */}
      <DndSortableContext
        droppableId={`weekly-droppable-id-day-${id}`}
        {...dndSortableContextProps}
      >
        <Flex {...styles.droppableContent}>
          {lists[`weekly-droppable-id-day-${id}`]?.map((itemId) => {
            // Strip "sortable-" or "copy-" prefix from id
            const rawId = itemId.replace(/copy-|sortable-/g, "");
            const plate = plates.filter((plate) => plate["_id"] === rawId);
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

export { Weekly };

// Styles
const styles = {
  daysContainer: {
    height: { base: "25vh", md: "35vh" },
    paddingX: { base: "0", md: "2em" },
    // Overflowing position
    marginTop: "1em",
    // Make list overflowX on Mobile to guarantee minWidth
    position: { base: "static", md: "relative" },
    left: { base: "none", md: "50%" },
    right: { base: "none", md: "50%" },
    marginLeft: { base: "auto", md: "-50vw" },
    marginRight: { base: "auto", md: "-50vw" },
    width: { base: "200vw", md: "100vw" },
    maxWidth: { base: "100%", md: "100vw" },
    overflowX: "auto",
    overflowY: "hidden",
  },
  day: {
    display: "flex",
    justifyContent: "center",
    border: "1px solid rgba(150,150,150,0.1)",
    height: "100%",
    width: "100%",
    minWidth: "100px",
  },
  dayHeader: {
    direction: "column",
    width: "100%",
    alignSelf: "flex-start",
  },
  item: {
    minWidth: { base: "4em", md: "6em" },
    marginRight: { base: "1", md: "2" },
    justify: "center",
  },
  image: {
    borderRadius: "full",
    objectFit: "cover",
    draggable: "false", // Prevents image src from being dragged rather than image component
    boxSize: { base: "3em", md: "5em" },
    _hover: {
      boxShadow: "0px 0px 15px -6px rgba(0,0,0,0.62)",
      transition: "boxShadow 2s ease-in-out",
    },
  },
  droppableContent: {
    direction: "column",
    align: "center",
    justify: "center",
    bg: "transparent",
    marginTop: "1",
  },
};
