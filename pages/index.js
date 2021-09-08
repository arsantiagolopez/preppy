import { AspectRatio, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";

const SCHEDULES_PAGE_IMAGE = process.env.NEXT_PUBLIC_SCHEDULES_PAGE_IMAGE;
const CATEGORIES_PAGE_IMAGE = process.env.NEXT_PUBLIC_CATEGORIES_PAGE_IMAGE;
const PLATES_PAGE_IMAGE = process.env.NEXT_PUBLIC_PLATES_PAGE_IMAGE;
const MARKETPLACE_PAGE_IMAGE = process.env.NEXT_PUBLIC_MARKETPLACE_PAGE_IMAGE;

const Home = () => {
  return (
    <Layout hideIconNav>
      <Flex {...styles.wrapper}>
        <Flex {...styles.topRow}>
          <Link href="/schedules" passHref>
            <AspectRatio {...styles.aspect}>
              <Card backgroundImage={SCHEDULES_PAGE_IMAGE} {...styles.card}>
                <Heading {...styles.heading}>Schedules</Heading>
              </Card>
            </AspectRatio>
          </Link>

          <Link href="/categories" passHref>
            <AspectRatio {...styles.aspect}>
              <Card backgroundImage={CATEGORIES_PAGE_IMAGE} {...styles.card}>
                <Heading {...styles.heading}>Categories</Heading>
              </Card>
            </AspectRatio>
          </Link>

          <Link href="/plates" passHref>
            <AspectRatio {...styles.aspect} marginRight="none">
              <Card backgroundImage={PLATES_PAGE_IMAGE} {...styles.card}>
                <Heading {...styles.heading}>Plates</Heading>
              </Card>
            </AspectRatio>
          </Link>
        </Flex>
        <Link href="/marketplace" passHref>
          <Card
            backgroundImage={MARKETPLACE_PAGE_IMAGE}
            {...styles.bottomRow}
            {...styles.card}
          >
            <Heading {...styles.heading}>Marketplace</Heading>
          </Card>
        </Link>
      </Flex>
    </Layout>
  );
};

Home.isProtected = true;

export default Home;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingTop: "0.5em",
  },
  topRow: {
    direction: { base: "column", md: "row" },
    width: "100%",
    minHeight: "40vh",
  },
  aspect: {
    width: "100%",
    ratio: 1,
    marginRight: "1em",
    marginBottom: "1em",
  },
  card: {
    cursor: "pointer",
    padding: { base: "1em", md: "2em" },
    _hover: {
      opacity: "0.7",
    },
  },
  heading: {
    color: "white",
    fontSize: "5xl",
    isTruncated: true,
  },
  bottomRow: {
    justify: "center",
    align: "center",
    minHeight: "40vh",
    direction: "column",
  },
};
