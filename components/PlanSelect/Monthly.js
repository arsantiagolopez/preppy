import { CheckIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DndDraggableContext } from "../DndDraggableContext";
import { DndSortableContext } from "../DndSortableContext";
import { Droppable } from "../Droppable";
import { ItemListSelection } from "../ItemListSelection";
import { Sortable } from "../Sortable";

const Monthly = ({ plates, setSchedule }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [lists, setLists] = useState({});
  const [activeWeek, setActiveWeek] = useState(0);
  const [successWeek, setSuccessWeek] = useState({});

  const days = [...moment.weekdaysShort().slice(1), moment.weekdaysShort()[0]];
  const weeks = [0, 1, 2, 3];

  // If week list has at least one plate, set week ready
  useEffect(() => {
    let successWeekObj = { 0: false, 1: false, 2: false, 3: false };

    // If length of any field of week is bigger than 1, set prop to true, else false
    Object.keys(lists).map((field) => {
      const hasItem = lists[field].length > 0;

      weeks.forEach((_, index) => {
        // If any day in week has at least one item, set to true
        if (field.includes(`week-${index}`) && hasItem) {
          successWeekObj[index] = true;
        }
      });
    });

    setSuccessWeek(successWeekObj);
  }, [lists]);

  // Make array of week days & set state
  useEffect(() => {
    let droppableIdsArr = [];

    weeks.map((_, x) => {
      days.map((__, y) =>
        droppableIdsArr.push(`monthly-droppable-id-week-${x}-day-${y}`)
      );
    });

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

  const weekProps = {
    days,
    setActiveId,
    lists,
    setLists,
    plates,
    activeWeek,
    activeId,
    activeItem,
  };

  const itemListSelectionProps = { plates, activeId, activeItem };

  return (
    <DndDraggableContext {...dndDraggableContextProps}>
      {/* Accordion of 4 weeks */}
      <Accordion
        defaultIndex={[0]}
        onChange={(expandedIndex) => setActiveWeek(expandedIndex)}
      >
        {Array(4)
          .fill()
          .map((_, index) => {
            return (
              <AccordionItem key={index} {...styles.item}>
                <h2>
                  {/* Week number header & state */}
                  <AccordionButton {...styles.button}>
                    <Heading {...styles.buttonHeader}>Week {index + 1}</Heading>
                    {successWeek[index] ? (
                      <CheckIcon {...styles.checkIcon} />
                    ) : (
                      <Spinner {...styles.spinner} />
                    )}
                  </AccordionButton>
                </h2>
                <Box {...styles.collapse}>
                  <AccordionPanel
                    display={activeWeek === index ? "flex" : "none"}
                    {...styles.panel}
                  >
                    {/* Week with droppable days */}
                    <Week weekNum={index} {...weekProps} />
                  </AccordionPanel>
                </Box>
              </AccordionItem>
            );
          })}
      </Accordion>

      {/* Draggable selection items */}
      <ItemListSelection {...itemListSelectionProps} />
    </DndDraggableContext>
  );
};

const Week = ({
  days,
  weekNum,
  setActiveId,
  lists,
  setLists,
  plates,
  activeWeek,
  activeId,
  activeItem,
}) => {
  const droppableFieldProps = {
    lists,
    setLists,
    setActiveId,
    plates,
    weekNum,
    activeWeek,
    activeId,
    activeItem,
  };

  return (
    <Flex {...styles.daysContainer}>
      {days.map((_, index) => (
        <DroppableField
          key={`monthly-droppable-id-week-${weekNum}-day-${index}`}
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
  );
};

const DroppableField = ({
  children,
  weekNum,
  id,
  lists,
  setLists,
  setActiveId,
  styleProps,
  plates,
  activeWeek,
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
    <Droppable
      id={`monthly-droppable-id-week-${weekNum}-day-${id}`}
      displayIfExpanded={{ display: activeWeek === weekNum ? "flex" : "none" }}
      {...droppableProps}
    >
      {/* Children contains week day header */}
      <Flex {...styles.dayHeader}>{children}</Flex>

      {/* Items in list */}
      <DndSortableContext
        droppableId={`monthly-droppable-id-week-${weekNum}-day-${id}`}
        {...dndSortableContextProps}
      >
        <Flex {...styles.droppableContent}>
          {lists[`monthly-droppable-id-week-${weekNum}-day-${id}`]?.map(
            (itemId) => {
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
            }
          )}
        </Flex>
      </DndSortableContext>
    </Droppable>
  );
};

export { Monthly };

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
    minHeight: "100%",
    width: "100%",
    minWidth: "100px",
  },
  dayHeader: {
    direction: "column",
    width: "100%",
    alignSelf: "flex-start",
  },
  instructions: {
    position: "relative",
    color: "gray.300",
    textAlign: "center",
    maxWidth: "55vw",
  },
  item: {
    border: "none",
    marginRight: { base: "1", md: "2" },
    position: "relative",
  },
  image: {
    borderRadius: "full",
    objectFit: "cover",
    draggable: "false", // Prevents image src from being dragged rather than image component
    boxSize: { base: "3em", md: "4em" },
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
  button: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "3em",
    paddingX: "0",
    borderBottom: "1px solid rgba(150,150,150,0.2)",
    _hover: {
      bg: "none",
    },
    _expanded: {
      borderBottom: "none",
    },
  },
  buttonHeader: {
    size: "md",
    paddingY: "1em",
    color: "gray.700",
  },
  checkIcon: {
    size: "sm",
    color: "green.500",
  },
  spinner: {
    color: "brand",
    size: "sm",
    speed: "1s",
  },
  collapse: {
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
  panel: {
    padding: 0,
    minWidth: "100%",
  },
};
