import { Flex, Heading, Icon } from "@chakra-ui/react";
import { signOut } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IoExitOutline } from "react-icons/io5";

const Sidebar = () => {
  const { pathname, query } = useRouter();

  const isCategory = pathname.includes("/categories/");
  const isPlate = pathname.includes("/plates");

  return (
    <Flex {...styles.wrapper}>
      <Flex direction="column">
        <Link href="/" passHref>
          <Heading
            color={pathname === "/" ? "brand" : "gray.300"}
            {...styles.item}
          >
            Home
          </Heading>
        </Link>
        <Link href="/schedules" passHref>
          <Heading
            color={pathname === "/schedules" ? "brand" : "gray.300"}
            {...styles.item}
          >
            Schedules
          </Heading>
        </Link>
        <Flex direction="column">
          <Link href="/categories" passHref>
            <Heading
              color={pathname === "/categories" ? "brand" : "gray.300"}
              {...styles.item}
            >
              Categories
            </Heading>
          </Link>
          {isCategory && (
            <Heading {...styles.item} {...styles.subItem}>
              {query?.name}
            </Heading>
          )}
        </Flex>

        <Link href="/plates" passHref>
          <Heading color={isPlate ? "brand" : "gray.300"} {...styles.item}>
            My plates
          </Heading>
        </Link>

        <Link href="/marketplace" passHref>
          <Heading
            color={pathname === "/marketplace" ? "brand" : "gray.300"}
            {...styles.item}
          >
            Marketplace
          </Heading>
        </Link>
      </Flex>

      <Heading onClick={() => signOut()} {...styles.signout}>
        Sign out
        <Icon as={IoExitOutline} marginLeft="5" />
      </Heading>
    </Flex>
  );
};

export { Sidebar };

// Styles

const styles = {
  wrapper: {
    zIndex: 1000,
    display: { base: "none", md: "flex" },
    direction: "column",
    justify: "space-between",
    height: "100%",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    width: "17vw",
    padding: "2.75em",
  },
  item: {
    paddingY: "1",
    cursor: "pointer",
    noOfLines: 1,
    _hover: {
      color: "brand",
    },
  },
  subItem: {
    paddingLeft: "1em",
    textTransform: "capitalize",
  },
  signout: {
    size: "lg",
    color: "red.600",
    cursor: "pointer",
    noOfLines: 1,
    _hover: {
      textDecoration: "underline",
    },
  },
};
