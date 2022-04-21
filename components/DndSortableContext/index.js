import { Flex, Image } from "@chakra-ui/react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React from "react";

const DndSortableContext = ({
  children,
  droppableId,
  items,
  setActiveId,
  lists,
  setLists,
  activeId,
  activeItem,
}) => {
  // Sort items
  const sort = (list, itemId, destinationId) => {
    const oldIndex = list.indexOf(itemId);
    const newIndex = list.indexOf(destinationId);
    return arrayMove(list, oldIndex, newIndex);
  };

  // Remove item if dropped outside of droppable
  const remove = (list, itemId) => list.filter((item) => item !== itemId);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    const itemId = active.id;
    const destinationId = over && over.id;

    // Dropped outside the list
    if (!over) {
      return setLists({
        ...lists,
        ...{
          [droppableId]: remove(lists[droppableId], itemId),
        },
      });
    }

    // Sort items
    if (itemId !== destinationId) {
      return setLists({
        ...lists,
        ...{
          [droppableId]: sort(lists[droppableId], itemId, destinationId),
        },
      });
    }
  };

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 0,
      tolerance: 5,
    },
  });

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(touchSensor, mouseSensor, keyboardSensor);

  if (!items) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items?.map((item) => `sortable-${item.id}`)}>
        {children}
      </SortableContext>

      {/* Sorting overlay */}
      <DragOverlay>
        {activeId && activeItem && (
          <Flex {...styles.item}>
            <Image src={activeItem["picture"]} {...styles.image} />
          </Flex>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export { DndSortableContext };

// styles
const styles = {
  item: {
    minWidth: { base: "4em", md: "6em" },
    marginRight: { base: "1", md: "2" },
  },
  image: {
    borderRadius: "full",
    boxSize: { base: "3.5em", md: "5.5em" },
    objectFit: "cover",
    draggable: "false", // Prevents image src from being dragged rather than image component
    boxShadow: "2xl",
    _active: {
      boxShadow: "dark-lg",
    },
  },
};
