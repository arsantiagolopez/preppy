import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { mutate } from "swr";
import axios from "../../axios";
import { showToast } from "../../utils/showToast";
import { PlanSelect } from "../PlanSelect";

const NewScheduleModal = ({ schedules }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [planValue, setPlanValue] = useState("daily");
  const [scheduleError, setScheduleError] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      schedule: {},
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle schedule errors
  const handleScheduleError = () =>
    setScheduleError(
      planValue === "daily"
        ? "You must add at least one plate to your day!"
        : planValue === "weekly"
        ? "All days of the week must have at least one plate. Fill them out and try again."
        : "Some weeks aren't fully filled. Every day must have at least one plate. Fill them all out before submitting your schedule!"
    );

  // Form submit
  const onSubmit = async ({ name, schedule }) => {
    setIsLoading(true);

    // Check 1: Make sure schedules are filled
    const someEmpty = schedule.some((dayArr) => !dayArr.length);

    if (someEmpty) {
      setIsLoading(false);
      return handleScheduleError();
    }

    const lowercaseName = name.toLowerCase();

    // Get set of unique plates
    let plates = [];
    schedule.forEach((days) =>
      days.forEach((day) => {
        if (!plates.includes(day)) {
          return plates.unshift(day);
        }
      })
    );

    // Downsize schedule to only plate Ids (order matters)
    schedule = schedule.map((day) => day.map(({ _id }) => _id));

    const newSchedule = {
      plates,
      name: lowercaseName,
      plan: planValue,
      schedule,
    };

    const response = await axios.post("/api/schedules", newSchedule);

    // Handle response
    if (response.status === 200) {
      setIsLoading(false);

      const { success, message } = response.data;

      // Handle backend errors
      if (!success) {
        // Display backend error
        return showToast({ status: "error", title: message });
      }

      // Mutate new data & revalidate
      if (schedules) {
        mutate("/api/schedules", [...schedules, newSchedule]);
      }

      // Close modal
      onClose();

      // Successfully created a plate
      showToast({
        status: "success",
        title: `${name} was added to your schedules!`,
      });
    } else {
      setIsLoading(false);
      // Close modal
      onClose();
      // Show error toast
      showToast({
        status: "error",
        title: "Something went wrong. Please try again later.",
      });
    }
  };

  // Form field registration
  const nameRegister = register("name", {
    required: "What should we call your schedule?",
  });

  const planSelectProps = {
    setPlanValue,
    scheduleError,
    setScheduleError,
  };

  return (
    <>
      {/* Add trigger */}
      <Icon as={MdAdd} onClick={onOpen} {...styles.addButton} />

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} {...styles.modal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalBody {...styles.body}>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              <Flex {...styles.field}>
                <Heading {...styles.title}>New Schedule</Heading>
              </Flex>

              {/* Name */}
              <Flex {...styles.field} marginTop="2em">
                <Input placeholder="Name" {...styles.input} {...nameRegister} />
                {errors.name && (
                  <Text {...styles.error}>{errors.name.message}</Text>
                )}
              </Flex>

              {/* Plan select */}
              <Flex {...styles.field} paddingBottom="1em">
                <Controller
                  control={control}
                  name="schedule"
                  render={({ field: { onChange, value, ref } }) => (
                    <PlanSelect
                      inputRef={ref}
                      onChange={(value) => onChange(value)}
                      value={value}
                      {...planSelectProps}
                    />
                  )}
                />
              </Flex>

              {/* Submit button */}
              <Flex
                paddingBottom={
                  planValue === "daily"
                    ? { base: "0", md: "20vh" }
                    : planValue === "weekly"
                    ? { base: "0", md: "20vh" }
                    : planValue === "monthly"
                    ? "20vh"
                    : "15vh"
                }
                {...styles.buttonContainer}
              >
                <Button isLoading={isLoading} {...styles.button}>
                  Create schedule <CheckIcon {...styles.icon} />
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export { NewScheduleModal };

// Styles

const styles = {
  addButton: {
    boxSize: "100%",
    color: "lightgray",
    cursor: "pointer",
    padding: "40%",
  },
  modal: {
    size: "full",
  },
  body: {
    alignSelf: "center",
    width: "32em",
    maxWidth: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  field: {
    direction: "column",
    marginY: "1vh",
    width: "100%",
    align: "flex-start",
  },
  title: {
    display: { base: "none", md: "flex" },
    size: "2xl",
    paddingTop: { base: "0", md: "5vh" },
  },
  input: {
    isTruncated: true,
    spellCheck: false,
    size: "xl",
    paddingY: "0.2em",
    fontWeight: "700",
    fontSize: "4xl",
    letterSpacing: "tight",
  },
  error: {
    color: "red.600",
  },
  buttonContainer: {
    alignSelf: "center",
    width: "100%",
  },
  button: {
    type: "submit",
    loadingText: "Creating",
    spinnerPlacement: "end",
    marginTop: "2vh",
    marginBottom: { base: "3vh", md: "6vh" },
    marginX: "auto",
    paddingY: { base: "1.75em", md: "1.75em" },
    minWidth: "20vw",
    width: "100%",
    borderRadius: "0.75em",
    color: "white",
    background: "gray.700",
    boxShadow: "lg",
  },
  icon: {
    marginLeft: "3",
    marginRight: "-4",
  },
};
