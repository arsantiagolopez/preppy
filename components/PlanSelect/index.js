import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import useSWR from "swr";
import { Daily } from "./Daily";
import { Monthly } from "./Monthly";
import { Weekly } from "./Weekly";

const PlanSelect = ({
  onChange,
  setPlanValue,
  scheduleError,
  setScheduleError,
}) => {
  const [planUI, setPlanUI] = useState(null);
  const [description, setDescription] = useState(null);
  const [schedule, setSchedule] = useState(null);

  const { data: plates } = useSWR("/api/plates");

  const uiProps = { plates, setSchedule };

  const DEFAULT_OPTION_INDEX = 0;
  const options = [
    {
      label: "Daily",
      value: "daily",
      ui: <Daily {...uiProps} />,
      description:
        "Personalize a day of meals. The same meals are eaten daily.",
    },
    {
      label: "Weekly",
      value: "weekly",
      ui: <Weekly {...uiProps} />,
      description:
        "Create a weekly plan. All Mondays are the same, Tuesdays, Wednesdays, etc...",
    },
    {
      label: "Monthly",
      value: "monthly",
      ui: <Monthly {...uiProps} />,
      description:
        "Want a more diverse diet? Monthly plans let you personalize every day of the month.",
    },
  ];

  // Select change
  const handleChange = ({ ui, description, value }) => {
    setPlanUI(ui);
    setDescription(description);
    setPlanValue(value);
  };

  // Update initial values on mount
  useEffect(() => {
    const dailyUI = options[DEFAULT_OPTION_INDEX]["ui"];
    const dailyDescription = options[DEFAULT_OPTION_INDEX]["description"];
    setPlanUI(dailyUI);
    setDescription(dailyDescription);
  }, [plates]);

  // Update schedule
  useEffect(() => {
    if (schedule) {
      onChange(schedule);

      // Clear errors
      setScheduleError(false);
    }
  }, [schedule]);

  return (
    <Flex {...styles.wrapper}>
      {/* Dropdown Select */}
      <Select
        defaultValue={options[DEFAULT_OPTION_INDEX]}
        options={options}
        styles={selectStyles}
        onChange={handleChange}
      />

      {/* Description or error */}
      {scheduleError ? (
        <Text {...styles.error}>{scheduleError}</Text>
      ) : (
        <Text {...styles.description}>{description}</Text>
      )}

      {/* Plan UI with DND */}
      {planUI}
    </Flex>
  );
};

export { PlanSelect };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
    maxWidth: "100%",
  },
  description: {
    color: "gray.500",
    paddingY: "2",
  },
  error: {
    color: "red.600",
    paddingY: "2",
  },
};

// Select styles

const selectStyles = {
  container: (provided) => ({
    ...provided,
    marginTop: "0.25em",
    backgroundColor: "transparent",
    width: "100%",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontFamily: "system-ui, sans-serif",
    fontSize: "2.25rem", // 4xl
    fontWeight: "600",
    width: "100%",
    color: "#A0AEC0", // gray.400
    textAlign: "left",
    letterSpacing: "-1px",
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderRadius: 0,
    // Hover & State
    border: state.isFocused ? 0 : 0,
    borderBottom: state.isFocused
      ? "2px solid rgb(56, 132, 204)"
      : "1px solid rgba(1,1,1,0.1)",
    // Disables the blue border
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      borderBottom: state.isFocused
        ? "2px solid rgb(56, 132, 204)"
        : "1px solid rgba(1,1,1,0.1)",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: "system-ui, sans-serif",
    backgroundColor: state.isFocused ? "rgba(1,1,1,0.1)" : "none",
    color: "black",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "2.25rem",
    letterSpacing: "-1px",
    fontWeight: "700",
    paddingRight: "3px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    paddingBottom: "0.25em",
    margin: 0,
  }),
  input: (provided) => ({
    ...provided,
    fontSize: "2.25rem",
    fontWeight: "600",
    maxWidth: "20vw",
  }),
  indicatorSeparator: () => ({}),
};
