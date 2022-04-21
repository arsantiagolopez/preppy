import { Avatar, Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  IoCalendarOutline,
  IoFolderOpenOutline,
  IoRestaurantOutline,
} from "react-icons/io5";

const IconNavigation = ({ session, hideIconNav, ...props }) => {
  const { user } = session || {};

  return (
    <Flex
      {...styles.wrapper}
      display={hideIconNav ? "none" : { base: "flex", md: "none" }}
      {...props}
    >
      <Flex {...styles.bar}>
        <Link href="/schedules">
          <a>
            <IconButton
              aria-label="Schedules"
              icon={<IoCalendarOutline />}
              {...styles.icon}
            />
          </a>
        </Link>
        <Link href="/categories">
          <a>
            <IconButton
              aria-label="Categories"
              icon={<IoFolderOpenOutline />}
              {...styles.icon}
            />
          </a>
        </Link>
        <Link href="/plates">
          <a>
            <IconButton
              aria-label="My plates"
              icon={<IoRestaurantOutline />}
              {...styles.icon}
            />
          </a>
        </Link>
        <Link href="/">
          <a>
            <Avatar src={user?.image} {...styles.icon} {...styles.avatar} />
          </a>
        </Link>
      </Flex>
    </Flex>
  );
};

export { IconNavigation };

// Styles

const styles = {
  wrapper: {
    zIndex: 1,
    height: "3em",
    background: "rgba(0,0,10, 0.8)",
    position: "sticky",
    bottom: "0",
    top: "0",
  },
  bar: {
    width: "100%",
    justify: "space-around",
    align: "center",
    height: "100%",
    paddingX: { base: "0", md: "15%" },
  },
  icon: {
    colorScheme: "white",
    fontSize: "14pt",
  },
  avatar: {
    boxSize: "18pt",
    marginX: "3",
  },
};
