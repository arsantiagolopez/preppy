import { ArrowBackIcon } from "@chakra-ui/icons";
import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { ScheduleWeekView } from "../../components/ScheduleWeekView";

const Schedule = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR(`/api/schedules/${id}`);

  const { name } = data || {};

  const scheduleWeekViewProps = { data };

  return (
    <Layout isSchedule hideMobileMainNav withoutBlur withTitle={name}>
      <Flex {...styles.wrapper}>
        {/* Mobile header */}
        <Heading {...styles.heading}>
          <ArrowBackIcon onClick={() => router.back()} {...styles.backIcon} />
          {name}
        </Heading>

        {/* Schedule view */}
        <ScheduleWeekView {...scheduleWeekViewProps} />
      </Flex>
    </Layout>
  );
};

Schedule.isProtected = true;

export default Schedule;

// Styles

const styles = {
  wrapper: {
    direction: "column",
    align: "center",
  },
  heading: {
    display: { base: "flex", md: "none" },
    width: "100%",
    textTransform: "capitalize",
    noOfLines: 1,
    fontSize: "4xl",
    marginY: "0.5em",
  },
  backIcon: {
    fontSize: "3xl",
    cursor: "pointer",
    marginBottom: "2",
  },
};
