import { AspectRatio, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { Card } from "../../components/Card";
import { Layout } from "../../components/Layout";
import { NewPlateModal } from "../../components/NewPlateModal";

const Plates = () => {
  const { data: plates } = useSWR("/api/plates");
  const { data: categories } = useSWR("/api/categories");

  const newPlateModalProps = { plates, categories };

  return (
    <Layout
      hideMobileMainNav
      pageTitle="My Plates"
      pageImage={process.env.NEXT_PUBLIC_PLATES_PAGE_IMAGE}
      pageDescription={process.env.NEXT_PUBLIC_PLATES_PAGE_DESCRIPTION}
    >
      <Flex {...styles.wrapper}>
        <Flex
          {...styles.plates}
          justify={{
            base: "space-between",
            md: plates?.length === 1 && "flex-start",
          }}
        >
          <Card {...styles.newPlate} {...styles.item}>
            <NewPlateModal {...newPlateModalProps} />
          </Card>

          {plates?.map(({ _id, picture, name, calories }, index) => (
            <AspectRatio
              key={_id || index}
              {...styles.aspect}
              {...styles.item}
              marginLeft={{
                base: "0",
                md: plates?.length === 1 ? "3%" : "none",
              }}
            >
              <Link href={`/plates/${_id}`} passHref>
                <Card backgroundImage={`url(${picture})`} {...styles.card}>
                  <Flex {...styles.meta}>
                    <Heading {...styles.name}>{name}</Heading>
                    <Text {...styles.calories}>{calories} cal</Text>
                  </Flex>
                </Card>
              </Link>
            </AspectRatio>
          ))}
        </Flex>
      </Flex>
    </Layout>
  );
};

Plates.isProtected = true;

export default Plates;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingTop: "0.5em",
  },
  plates: {
    direction: "row",
    justify: "space-between",
    wrap: "wrap",
    paddingY: { base: "0.5em", md: "1em" },
  },
  newPlate: {
    justify: "center",
    align: "center",
    boxShadow: {
      base: "inset 0 -5vh 5vh -5vh rgba(0,0,0,0.5)",
      md: "inset 0 -10vh 10vh -10vh rgba(0,0,0,0.5)",
    },
    marginX: 0,
  },
  item: {
    flex: { base: "1 1 48.5%", md: "1 1 32%" },
    maxWidth: { base: "48.5%", md: "32%" },
    marginBottom: { base: "3%", md: "2%" },
    marginX: "0",
  },
  aspect: {
    ratio: 1,
    boxShadow: "lg",
    borderRadius: "2em",
  },
  card: {
    cursor: "pointer",
    direction: "column",
    boxShadow: {
      base: "inset 0 -15vh 20vh -7vh rgba(0,0,0,0.8)",
      md: "inset 0 -30vh 30vh -15vh rgba(0,0,0,0.8)",
    },
    marginX: "0",
  },
  meta: {
    direction: "column",
    justify: "space-between",
    marginTop: "auto",
    width: "100%",
    paddingX: { base: "0.5em", md: "1.5em" },
    paddingY: { base: "0.5em", md: "1.5em" },
  },
  name: {
    size: "xl",
    lineHeight: "1.2em",
    color: "white",
    noOfLines: 2,
    textTransform: "capitalize",
  },
  calories: {
    color: "white",
  },
};
