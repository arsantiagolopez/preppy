import { Flex } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

const Droppable = ({ children, id, styleProps, displayIfExpanded }) => {
  const { setNodeRef } = useDroppable({ id });

  let displayProps;

  // If week isn't expanded (accordion), hide droppable field
  if (displayIfExpanded) {
    displayProps = displayIfExpanded;
  }

  return (
    <div ref={setNodeRef} style={styleProps}>
      <Flex {...styles.wrapper} {...displayProps}>
        {children}
      </Flex>
    </div>
  );
};

export { Droppable };

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
  },
};
