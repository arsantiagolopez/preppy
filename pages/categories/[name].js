import { ChevronRightIcon } from "@chakra-ui/icons";
import { AspectRatio, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Card } from "../../components/Card";
import { DeleteCategoryAlert } from "../../components/DeleteCategoryAlert";
import { Layout } from "../../components/Layout";

const CategoryPage = () => {
  const router = useRouter();
  const { name } = router.query || {};

  const { data } = useSWR(`/api/categories/${name}`);

  const deleteCategoryAlertProps = { name };

  return (
    <Layout>
      <Flex {...styles.wrapper}>
        <Flex {...styles.titleContainer}>
          <Heading onClick={() => router.push("/categories")} {...styles.title}>
            Categories
          </Heading>
          <ChevronRightIcon {...styles.icon} />
          <Heading {...styles.heading}>{name}</Heading>
          {name !== "all" && (
            <DeleteCategoryAlert {...deleteCategoryAlertProps} />
          )}
        </Flex>

        <Flex {...styles.plates}>
          {data?.map(({ _id, picture, name, calories }, index) => (
            <AspectRatio
              key={_id || index}
              {...styles.cardContainer}
              marginRight={{ base: (index + 1) % 2 && "3%", md: "1vw" }}
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

CategoryPage.isProtected = true;

export default CategoryPage;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingTop: "0.5em",
  },
  titleContainer: {
    direction: "row",
    align: "center",
  },
  title: {
    textTransform: "capitalize",
    cursor: "pointer",
    color: "gray.300",
  },
  heading: {
    textTransform: "capitalize",
  },
  icon: {
    fontSize: "4xl",
  },
  plates: {
    direction: "row",
    wrap: "wrap",
    paddingY: "1em",
  },
  cardContainer: {
    ratio: 1,
    width: "100%",
    flexBasis: { base: "48%", md: "32%" },
    marginBottom: { base: "3%", md: "1em" },
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
