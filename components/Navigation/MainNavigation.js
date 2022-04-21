import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import { IoExitOutline } from "react-icons/io5";

const MainNavigation = ({
  session,
  hideMobileMainNav,
  withoutBlur,
  withTitle,
  isSchedule,
}) => {
  // Get user's first name
  const getFirstName = (name) => name?.split(" ")[0];

  const date = moment().format("dddd, MMMM Do");
  const name = session?.user?.name ? session?.user?.name : session?.user?.email;
  const image = session?.user?.image ? session?.user?.image : null;

  const router = useRouter();

  return (
    <Flex
      {...styles.wrapper}
      display={!hideMobileMainNav ? "flex" : { base: "none", md: "flex" }}
      background={
        isSchedule
          ? "brand"
          : !withoutBlur
          ? "rgba(300,300,300,0.5)"
          : "transparent"
      }
      style={
        !withoutBlur
          ? {
              backdropFilter: "blur(10px)",
            }
          : { backdropFilter: "none" }
      }
      paddingBottom={isSchedule && "2em"}
    >
      <Flex {...styles.left}>
        {!withTitle ? (
          <>
            <Text {...styles.date}>{date}</Text>
            <Text {...styles.welcome}>Hi {getFirstName(name)}!</Text>
          </>
        ) : (
          <Flex {...styles.titleContainer}>
            <ArrowBackIcon
              onClick={() => router.back()}
              {...styles.backIcon}
              color={isSchedule && "white"}
            />
            <Text
              {...styles.welcome}
              {...styles.title}
              maxWidth={isSchedule ? "100%" : { base: "auto", md: "30vw" }}
              color={isSchedule && "white"}
            >
              {withTitle}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex {...styles.right}>
        <Menu {...styles.menu}>
          <MenuButton>
            <Avatar src={image} {...styles.image} />
          </MenuButton>
          <MenuList {...styles.menuList}>
            <MenuGroup title="Account">
              <MenuItem
                onClick={() => signOut()}
                icon={<IoExitOutline />}
                {...styles.menuItem}
              >
                Sign out
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export { MainNavigation };

// Styles

const styles = {
  wrapper: {
    direction: "row",
    position: "sticky",
    top: "0",
    width: "100%",
    paddingY: "1em",
    paddingX: { base: "1em", md: "20vw" },
    zIndex: 4,
  },
  left: {
    direction: "column",
    minWidth: "50%",
  },
  date: {
    color: "gray.500",
    fontWeight: "600",
  },
  welcome: {
    fontSize: { base: "xl", md: "4xl" },
    fontWeight: "bold",
  },
  titleContainer: {
    direction: "row",
    align: "center",
  },
  backIcon: {
    fontSize: "5xl",
    marginTop: "2vh",
    marginLeft: "-1em",
    cursor: "pointer",
  },
  title: {
    marginTop: { base: "0", md: "2vh" },
    fontSize: { base: "4xl", md: "6xl" },
    noOfLines: 1,
    textTransform: "capitalize",
  },
  right: {
    justify: "center",
    align: "flex-end",
    marginLeft: "auto",
  },
  menu: {
    placement: "bottom-end",
  },
  image: {
    boxSize: { base: "2em", md: "2.5em" },
    marginY: { base: "2", md: "5" },
  },
  menuList: {
    marginTop: { base: "-0.5em", md: "-1em" },
  },
  menuItem: {
    color: "red.600",
    fontWeight: "semibold",
  },
};
