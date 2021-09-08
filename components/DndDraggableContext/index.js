import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React from "react";

const DndDraggableContext = ({ children, setActiveId, lists, setLists }) => {
  // Add item to sortable droppable
  const add = (list, newId) => {
    let finalId;
    const PREFIX = "sortable";
    const COPY = "copy";
    // Check if item with id exists
    const existingId = list.some((item) => item.includes(newId));
    // Check if copy of item exists (two copies)
    const existingCopy = list.some((item) =>
      item.includes(`${COPY}-${PREFIX}-${newId}`)
    );

    if (existingId) {
      // If third copy
      if (existingCopy) {
        finalId = `${COPY}-${COPY}-${PREFIX}-${newId}`;
      } else {
        finalId = `${COPY}-${PREFIX}-${newId}`;
      }
    } else {
      finalId = `${PREFIX}-${newId}`;
    }

    return [...list, finalId];
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    const itemId = active.id;
    const destinationId = over && over.id;

    // Dropped outside the list
    if (!over) setActiveId(null);

    // Lists cannot have more than 3 items
    if (lists[destinationId] && lists[destinationId].length < 3) {
      // Add item to list
      setLists({
        ...lists,
        // Add sortable to id to cross work with sortable context
        ...{ [destinationId]: add(lists[destinationId], itemId) },
      });
      setActiveId(null);
    }
  };

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 100,
      tolerance: 2,
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

  const customRestrictToAboveAxis = ({ transform }) => {
    return {
      ...transform,
      y: transform.y > 0 ? 0 : transform.y,
    };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, customRestrictToAboveAxis]}
    >
      {children}
    </DndContext>
  );
};

export { DndDraggableContext };
