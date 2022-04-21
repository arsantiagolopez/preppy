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
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import useSWR, { mutate } from "swr";
import axios from "../../axios";
import { CategorySelect } from "../../components/CategorySelect";
import { showToast } from "../../utils/showToast";
import { stripEmptyOrUnused } from "../../utils/stripEmptyOrUnused";

const EditPlateModal = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { _id, picture, name, calories, category, protein, carbs, fat } =
    data || {};

  const { data: categories } = useSWR("/api/categories");

  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  // Image validation
  const validateImageURL = (url) => {
    // If unchanged, passed pre-validation
    if (url === picture) {
      return true;
    }
    // Valid image extension
    if (!url.match(/\.(jpg|jpeg|png|gif)$/)) {
      return false;
    }
    return true;
  };

  // Form submit
  const onSubmit = async (values) => {
    const { picture: newPicture, name, category } = values;

    // Check 1: Validate image URL
    // Validate image URL
    const validPicture = validateImageURL(newPicture);

    if (!validPicture) {
      return setError("picture", {
        type: "manual",
        message: "Please enter a valid image URL.",
      });
    }

    // Check 2: Delete old image object from s3
    await axios.post("/api/s3/url", { url: picture });

    const lowercaseName = name.toLowerCase();
    const lowercaseCategory = category.toLowerCase();

    // Check 3: Create category if it doesn't exist
    const categoryExists = categories.includes(lowercaseCategory);

    if (!categoryExists) {
      await axios.post("/api/categories", { name: lowercaseCategory });
    }

    // Remove empty strings or unchanged values
    const updatedPlate = stripEmptyOrUnused(data, {
      name: lowercaseName,
      category: lowercaseCategory,
      picture: newPicture,
      ...values,
    });

    const response = await axios.put(`/api/plates/${_id}`, updatedPlate);

    // Handle response
    if (response.status === 200) {
      // Mutate new data & revalidate (id needed detailed plate link)
      mutate(`/api/plates/${_id}`, { ...data, updatedPlate });
      // Close modal
      onClose();
      // Successfully created a plate
      showToast({
        status: "success",
        title: `${name} was succesfully edited!`,
      });
    } else {
      // Show error toast
      showToast({
        status: "error",
        title: "Something went wrong. Please try again later.",
      });
    }
  };

  // Form field registration
  const pictureRegister = register("picture", {});
  const nameRegister = register("name", {});
  const caloriesRegister = register("calories", {});
  const proteinRegister = register("protein", {});
  const carbsRegister = register("carbs", {});
  const fatRegister = register("fat", {});

  return (
    <>
      {/* Edit Button */}
      <Icon as={MdEdit} {...styles.icon} onClick={onOpen} />

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent {...styles.content}>
          <ModalHeader {...styles.header}>Edit</ModalHeader>
          <ModalCloseButton />

          <ModalBody {...styles.body}>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              <Flex {...styles.fields}>
                <Flex {...styles.field}>
                  <Heading {...styles.label}>Picture</Heading>
                  <Input
                    placeholder="Name"
                    defaultValue={picture}
                    {...styles.input}
                    {...pictureRegister}
                  />
                  {errors.picture && (
                    <Text {...styles.error}>{errors.picture.message}</Text>
                  )}
                </Flex>

                <Flex {...styles.field}>
                  <Heading {...styles.label}>Name</Heading>
                  <Input
                    placeholder="Name"
                    defaultValue={name}
                    {...styles.input}
                    {...nameRegister}
                  />
                  {errors.name && (
                    <Text {...styles.error}>{errors.name.message}</Text>
                  )}
                </Flex>

                <Flex {...styles.field}>
                  <Heading {...styles.label}>Calories</Heading>
                  <Input
                    type="number"
                    placeholder="Calories"
                    defaultValue={calories}
                    {...styles.input}
                    {...caloriesRegister}
                  />
                </Flex>

                <Flex {...styles.field}>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={category}
                    render={({ field: { onChange, value, ref } }) => (
                      <CategorySelect
                        inputRef={ref}
                        onChange={(value) => onChange(value)}
                        value={value}
                        categories={categories}
                        defaultValue={category}
                      />
                    )}
                  />
                </Flex>

                <Flex {...styles.field}>
                  <Heading {...styles.label}>Protein</Heading>
                  <Input
                    type="number"
                    placeholder="Protein"
                    defaultValue={protein}
                    {...styles.input}
                    {...proteinRegister}
                  />
                </Flex>

                <Flex {...styles.field}>
                  <Heading {...styles.label}>Carbohydrates</Heading>
                  <Input
                    type="number"
                    placeholder="Carbohydrates"
                    defaultValue={carbs}
                    {...styles.input}
                    {...carbsRegister}
                  />
                </Flex>

                <Flex {...styles.field}>
                  <Heading {...styles.label}>Fat</Heading>
                  <Input
                    type="number"
                    placeholder="Fat"
                    defaultValue={fat}
                    {...styles.input}
                    {...fatRegister}
                  />
                  {errors.fat && (
                    <Text {...styles.error}>{errors.fat.message}</Text>
                  )}
                </Flex>

                {/* Button */}
                <Flex {...styles.buttonContainer}>
                  <Button {...styles.button}>
                    Confirm <CheckIcon marginLeft="3" marginRight="-4" />
                  </Button>
                </Flex>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export { EditPlateModal };

// Styles

const styles = {
  icon: {
    color: "white",
    boxSize: { base: "40px", md: "100px" },
  },
  content: {
    minHeight: { base: "100%", md: "75%" },
    marginTop: { base: "0", md: "3.75em" },
    borderRadius: { base: "0", md: "1em" },
    minHeight: "70%",
    marginBottom: { base: "0", md: "3.75em" },
  },
  header: {
    textAlign: "center",
  },
  body: {
    align: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
  },
  fields: {
    direction: "column",
    align: "center",
    paddingY: { base: "0.5em", md: "1vh" },
    paddingX: { base: "0", md: "2vw" },
  },
  field: {
    direction: "column",
    marginY: "1vh",
    align: "flex-start",
    width: "100%",
  },
  label: {
    size: "md",
    marginBottom: "-2",
  },
  input: {
    isTruncated: true,
    size: "xl",
    paddingY: "0.2em",
    fontWeight: "600",
    fontSize: "4xl",
    letterSpacing: "tight",
  },
  error: {
    color: "red.600",
  },
  buttonContainer: {
    paddingY: "1em",
    width: { base: "90%", md: "100%" },
  },
  button: {
    type: "submit",
    marginTop: "2vh",
    marginBottom: "3vh",
    marginX: "auto",
    paddingY: { base: "1.5em", md: "1.75em" },
    width: "100%",
    borderRadius: "0.75em",
    color: "white",
    background: "gray.700",
    boxShadow: "lg",
  },
};
