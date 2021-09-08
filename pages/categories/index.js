import { Flex, Heading, Tag, TagLabel } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { Layout } from "../../components/Layout";

const Categories = () => {
  const { data } = useSWR("/api/categories");

  // Get random light colours
  const getRandomColor = () => `hsl(${Math.random() * 360}, 100%, 75%)`;

  return (
    <Layout
      hideMobileMainNav
      pageTitle="Categories"
      pageImage={process.env.NEXT_PUBLIC_CATEGORIES_PAGE_IMAGE}
      pageDescription={process.env.NEXT_PUBLIC_CATEGORIES_PAGE_DESCRIPTION}
    >
      <Flex {...styles.wrapper}>
        <Flex {...styles.tagContainer}>
          {data?.map(({ _id, name }) => (
            <Link key={_id} href={`/categories/${name}`} passHref>
              <Tag background={getRandomColor()} {...styles.tag}>
                <TagLabel {...styles.label}>
                  <Heading {...styles.name}>{name}</Heading>
                </TagLabel>
              </Tag>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Layout>
  );
};

Categories.isProtected = true;

export default Categories;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingTop: "0.5em",
  },
  tagContainer: {
    direction: "row",
    wrap: "wrap",
    paddingY: "1em",
  },
  tag: {
    borderRadius: "full",
    bg: "gray.100",
    paddingY: "1em",
    paddingX: "2em",
    marginRight: { base: "0.5em", md: "0.75em" },
    marginBottom: { base: "0.5em", md: "0.75em" },
    cursor: "pointer",
  },
  label: {
    paddingX: { base: "0.5em", md: "1em" },
  },
  name: {
    minWidth: "100%",
    fontSize: { base: "xl", md: "4xl" },
    textTransform: "capitalize",
  },
};
