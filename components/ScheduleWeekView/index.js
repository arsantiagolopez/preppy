import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { DeleteScheduleAlert } from "../DeleteScheduleAlert";

const ScheduleWeekView = ({ data }) => {
  const [weeks, setWeeks] = useState({ 0: [], 1: [], 2: [], 3: [] });
  const [weekDates, setWeekDates] = useState(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [platesData, setPlatesData] = useState(null);

  const { plan, plates, schedule } = data || {};

  const days = [...moment.weekdaysMin().slice(1), moment.weekdaysMin()[0]];

  // Handle week change
  const handleIncrement = (increment) => {
    // If below zero, loop back to end (3)
    if (activeWeek === 0 && increment === -1) {
      setActiveWeek(3);
    }
    // If above 3, go back to beginning (0)
    else if (activeWeek === 3 && increment === 1) {
      setActiveWeek(0);
    }
    // Normal increment
    else {
      setActiveWeek(activeWeek + increment);
    }
  };

  // Update start and end of week
  useEffect(() => {
    // Multiple today's date by a weekly factor
    const date = moment().add(activeWeek, "weeks");

    const start = date.weekday(1).format("MMM D");
    const end = date.weekday(7).format("MMM D");

    setWeekDates({ start, end });
  }, [activeWeek]);

  // Get plate objects
  useEffect(async () => {
    if (plates) {
      const getPlate = async (id) => {
        const { data } = await axios.get(`/api/plates/${id}`);
        return data;
      };

      const platesData = await Promise.all(plates?.map((id) => getPlate(id)));

      setPlatesData(platesData);
    }
  }, [plates]);

  // Populate weeks
  useEffect(() => {
    if (schedule) {
      // Handle daily plans
      if (plan === "daily") {
        const week = Array(7).fill(schedule[0]);

        const updatedWeeks = Object.keys(weeks).map(
          (key) => (weeks[key] = week)
        );

        setWeeks(updatedWeeks);
      }
      // Handle weekly plans
      if (plan === "weekly") {
        const week = schedule;

        const updatedWeeks = Object.keys(weeks).map(
          (key) => (weeks[key] = week)
        );

        setWeeks(updatedWeeks);
      }
      // Handle monthly plans
      if (plan === "monthly") {
        const scheduleCopy = schedule;

        const updatedWeeks = Object.keys(weeks).map((key) => {
          const week = scheduleCopy.splice(0, 7);
          return (weeks[key] = week);
        });

        setWeeks(updatedWeeks);
      }
    }
  }, [schedule]);

  const deleteScheduleAlertProps = { data };

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.top}>
        <Flex {...styles.weeks}>
          <Flex {...styles.week}>
            <ArrowBackIcon
              onClick={() => handleIncrement(-1)}
              {...styles.arrow}
            />
            <Heading {...styles.heading}>Week {activeWeek + 1} </Heading>
            <ArrowForwardIcon
              onClick={() => handleIncrement(1)}
              {...styles.arrow}
            />
          </Flex>
          <Heading {...styles.interval}>
            {weekDates && `${weekDates?.start} - ${weekDates?.end}`}
          </Heading>
        </Flex>
        <Button {...styles.button}>
          <DeleteScheduleAlert {...deleteScheduleAlertProps} />
        </Button>
      </Flex>

      {platesData ? (
        <>
          <Flex {...styles.days}>
            {days.map((day, index) => {
              let calories = 0;
              const dayPlates = weeks[activeWeek][index];
              return (
                <Flex
                  key={day}
                  background={{
                    base: (index + 1) % 2 && "rgba(240,240,240,0.3)",
                    md: "none",
                  }}
                  {...styles.day}
                >
                  <Text {...styles.name}>{day[0]}</Text>

                  <Flex {...styles.platesContainer}>
                    {dayPlates?.map((id, y) => {
                      const plate = platesData?.find(
                        (plate) => plate?._id === id
                      );
                      calories += plate?.calories;
                      return (
                        <Flex
                          key={y}
                          backgroundImage={`url(${plate?.picture})`}
                          {...styles.picture}
                        />
                      );
                    })}
                  </Flex>

                  <Text {...styles.calories}>{calories} cal</Text>
                </Flex>
              );
            })}
          </Flex>
        </>
      ) : (
        <Spinner {...styles.spinner} />
      )}
    </Flex>
  );
};

export { ScheduleWeekView };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
  },
  top: {
    position: "relative",
    direction: "row",
    justify: "center",
    width: "100%",
    marginY: { base: "0", md: "2vh" },
    marginTop: { base: "0", md: "4vh" },
  },
  weeks: {
    direction: "column",
    align: "center",
    width: { base: "100%", md: "auto" },
  },
  week: {
    direction: "row",
    align: "center",
    justify: { base: "space-around", md: "center" },
    width: "100%",
  },
  arrow: {
    fontSize: "3xl",
    cursor: "pointer",
    userSelect: "none",
  },
  heading: {
    color: "brand",
    fontSize: { base: "4xl", md: "4xl" },
    textTransform: "uppercase",
    letterSpacing: "wide",
    fontWeight: "extrabold",
    textAlign: "center",
    paddingX: { base: "none", md: "5em" },
  },
  interval: {
    color: "brand",
    fontSize: { base: "3xl", md: "6xl" },
    textTransform: "uppercase",
    fontStyle: "italic",
    letterSpacing: "widest",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    right: { base: "-3", md: "0" },
    top: { base: "-9.75vh", md: "4vh" },
    variant: "ghost",
    boxSize: "4em",
  },
  days: {
    direction: { base: "column", md: "row" },
    justify: { base: "center", md: "space-between" },
    marginY: { base: "1vh", md: "0" },
  },
  day: {
    direction: { base: "row", md: "column" },
    align: "center",
    paddingY: { base: "1vh", md: "2vh" },
  },
  name: {
    fontWeight: "bold",
    textTransform: "uppercase",
    width: { base: "5em", md: "auto" },
    textAlign: "center",
  },
  platesContainer: {
    direction: { base: "row", md: "column" },
    justify: "center",
    width: "100%",
    height: { base: "100%", md: "45vh" },
    marginY: { base: "0", md: "2vh" },
  },
  picture: {
    boxSize: { base: "3.5em", md: "6em" },
    borderRadius: "full",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginX: { base: "0.5em", md: "0" },
    marginTop: { base: "0", md: "2vh" },
  },
  calories: {
    color: { base: "gray.300", md: "gray.400" },
    fontSize: { base: "0.75rem", md: "0.90rem" },
    width: { base: "20%", md: "auto" },
  },
  totalCalories: {
    color: "brand",
  },
  spinner: {
    color: "brand",
    size: "lg",
    thickness: "2px",
    alignSelf: "center",
    marginTop: "20vh",
  },
};
