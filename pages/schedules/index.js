import { AspectRatio, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { Card } from "../../components/Card";
import { Layout } from "../../components/Layout";
import { NewScheduleModal } from "../../components/NewScheduleModal";

const Schedules = () => {
  const { data: schedules } = useSWR("/api/schedules");

  const newScheduleModalProps = { schedules };

  const SCHEDULES_THUMBNAIL = process.env.NEXT_PUBLIC_SCHEDULES_THUMBNAIL;

  return (
    <Layout
      hideMobileMainNav
      pageTitle="Schedules"
      pageImage={process.env.NEXT_PUBLIC_SCHEDULES_PAGE_IMAGE}
      pageDescription={process.env.NEXT_PUBLIC_SCHEDULES_PAGE_DESCRIPTION}
    >
      <Flex {...styles.wrapper}>
        <Flex
          {...styles.schedules}
          justify={{
            base: "space-between",
            md: schedules?.length === 1 && "flex-start",
          }}
        >
          <Card {...styles.newSchedule} {...styles.item}>
            <NewScheduleModal {...newScheduleModalProps} />
          </Card>

          {schedules?.map(({ _id, name }, index) => (
            <AspectRatio
              key={_id || index}
              {...styles.aspect}
              {...styles.item}
              marginLeft={{
                base: "0",
                md: schedules?.length === 1 ? "3%" : "none",
              }}
            >
              <Link href={`/schedules/${_id}`} passHref>
                <Card
                  backgroundImage={`url(${SCHEDULES_THUMBNAIL})`}
                  {...styles.card}
                >
                  <Flex {...styles.meta}>
                    <Heading {...styles.name}>{name}</Heading>
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

Schedules.isProtected = true;

export default Schedules;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingTop: "0.5em",
  },
  schedules: {
    direction: "row",
    justify: "space-between",
    wrap: "wrap",
    paddingY: { base: "0.5em", md: "1em" },
  },
  newSchedule: {
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
      base: "inset 0 -10vh 10vh -10vh rgba(0,0,0,0.8)",
      md: "inset 0 -15vh 15vh -15vh rgba(0,0,0,0.8)",
    },
    marginX: "0",
  },
  meta: {
    direction: "column",
    justify: "center",
    align: "center",
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
    paddingRight: "0.5",
    textAlign: "center",
  },
};
