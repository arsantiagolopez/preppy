import { CheckIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
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
import { MdAdd, MdAddAPhoto } from "react-icons/md";
import { mutate } from "swr";
import axios from "../../axios";
import { showToast } from "../../utils/showToast";
import { Card } from "../Card";
import { CategorySelect } from "../CategorySelect";
import { DropzoneField } from "../DropzoneField";

const NewPlateModal = ({ plates, categories }) => {
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const uploadImageToS3 = async () => {
    // Get secure URL from server
    const response = await axios.get("/api/s3/url");

    if (response.status !== 200) return;

    const { url } = response.data;

    // Remove preview from file
    delete file.preview;

    // Post image to S3 Bucket
    await axios.put(url, file, {
      headers: { "Content-type": file.type },
    });

    const imageURL = url.split("?")[0];

    return imageURL;
  };

  // Form submit
  const onSubmit = async (values) => {
    const { name, category } = values;

    setIsLoading(true);

    // Check 1: Picture field isn't registered, but is required
    if (!image) {
      return setImageError("Please add a picture for your plate.");
    }

    // Upload image to s3
    const picture = await uploadImageToS3();

    // Check 2: Make sure image was uploaded to s3
    if (!picture) return;

    const lowercaseName = name.toLowerCase();
    const lowercaseCategory = category.toLowerCase();

    // Check 3: Create category if it doesn't exist
    const categoryExists = categories.includes(lowercaseCategory);

    if (!categoryExists) {
      await axios.post("/api/categories", { name: lowercaseCategory });
    }

    const newPlate = {
      ...values,
      picture,
      name: lowercaseName,
      category: lowercaseCategory,
    };

    const response = await axios.post("/api/plates", newPlate);

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
      if (plates) {
        mutate("/api/plates", [...plates, newPlate]);
      }

      // Close modal
      onClose();
      // Successfully created a plate
      showToast({
        status: "success",
        title: `${name} was added to your plates!`,
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
    required: "This field is required.",
  });
  const caloriesRegister = register("calories", {
    required: "This field is required.",
  });
  const proteinRegister = register("protein", {});
  const carbsRegister = register("carbs", {});
  const fatRegister = register("fat", {});

  const dropzoneFieldProps = {
    file,
    setFile,
    setImage,
    imageError,
    setImageError,
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
              <DropzoneField {...dropzoneFieldProps} {...styles.dropzone}>
                <AspectRatio {...styles.aspectRatio}>
                  <Card direction="column">
                    {!image ? (
                      <>
                        <Icon as={MdAddAPhoto} {...styles.icon} />
                        <Heading {...styles.pictureText}>Add photo</Heading>
                      </>
                    ) : (
                      <Flex backgroundImage={image} {...styles.picture} />
                    )}
                  </Card>
                </AspectRatio>
              </DropzoneField>

              <Flex {...styles.fields}>
                <Flex {...styles.field} display={{ base: "none", md: "flex" }}>
                  <Heading size="2xl">New plate</Heading>
                </Flex>
                <Flex {...styles.field}>
                  <Input
                    placeholder="Name"
                    {...styles.input}
                    {...nameRegister}
                  />
                  {errors.name && (
                    <Text {...styles.error}>{errors.name.message}</Text>
                  )}
                </Flex>

                <Flex {...styles.field}>
                  <Input
                    type="number"
                    placeholder="Calories"
                    {...styles.input}
                    {...caloriesRegister}
                  />
                  {errors.calories && (
                    <Text {...styles.error}>{errors.calories.message}</Text>
                  )}
                </Flex>

                {categories && (
                  <Flex {...styles.field}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "This field is required." }}
                      render={({ field: { onChange, value, ref } }) => (
                        <CategorySelect
                          inputRef={ref}
                          onChange={(value) => onChange(value)}
                          value={value}
                          categories={categories}
                        />
                      )}
                    />
                    {errors.category && (
                      <Text {...styles.error}>{errors.category.message}</Text>
                    )}
                  </Flex>
                )}

                {/* Macros */}

                <Flex {...styles.field} paddingTop="2vh">
                  <Heading>Macros (optional)</Heading>
                </Flex>
                <Flex {...styles.macros}>
                  <Flex {...styles.macrosField}>
                    <Image
                      src="/protein.png"
                      alt="protein"
                      {...styles.macrosImage}
                    />
                    <Input
                      type="number"
                      placeholder="Protein"
                      {...styles.input}
                      {...styles.macrosInput}
                      {...proteinRegister}
                    />
                    <Text {...styles.macrosName}>Protein</Text>
                  </Flex>

                  <Flex {...styles.macrosField}>
                    <Image
                      src="/carbs.png"
                      alt="carbs"
                      {...styles.macrosImage}
                    />
                    <Input
                      type="number"
                      placeholder="Carbohydrates"
                      {...styles.input}
                      {...styles.macrosInput}
                      {...carbsRegister}
                    />
                    <Text {...styles.macrosName}>Carbs</Text>
                  </Flex>

                  <Flex {...styles.macrosField} marginRight="0">
                    <Image src="/fat.png" alt="fat" {...styles.macrosImage} />
                    <Input
                      type="number"
                      placeholder="Fat"
                      {...styles.input}
                      {...styles.macrosInput}
                      {...fatRegister}
                    />
                    <Text {...styles.macrosName}>Fat</Text>
                  </Flex>
                </Flex>

                <Flex {...styles.block} />

                <Flex {...styles.buttonContainer}>
                  <Button isLoading={isLoading} {...styles.button}>
                    Add plate <CheckIcon marginLeft="3" marginRight="-4" />
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

export { NewPlateModal };

// Styles

const styles = {
  addButton: {
    boxSize: "100%",
    color: "lightgray",
    cursor: "pointer",
    padding: "40%",
    // bg: "red",
  },
  modal: {
    size: "full",
  },
  body: {
    align: "center",
  },
  form: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    // background: "purple",
    justifyContent: "center",
  },
  dropzone: {
    order: { base: 1, md: 2 },
    width: { base: "100%", md: "45%" },
    marginTop: { base: "2em", md: "3em" },
    cursor: "pointer",
  },
  aspectRatio: {
    ratio: 1,
    width: "100%",
    height: "100%",
  },
  icon: {
    boxSize: "4em",
    color: "gray.100",
  },
  pictureText: {
    color: "gray.100",
    paddingTop: "2",
  },
  picture: {
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  fields: {
    order: { base: 2, md: 1 },
    direction: "column",
    basis: { base: "100%", md: "40%" },
    paddingY: { base: "1vh", md: "4em" },
    paddingX: { base: "0", md: "5vw" },
    align: "center",
  },
  field: {
    direction: "column",
    marginY: "1vh",
    width: "100%",
    align: "flex-start",
  },
  input: {
    isTruncated: true,
    spellCheck: false,
    size: "xl",
    paddingY: "0.2em",
    fontWeight: "700",
    fontSize: "3xl",
    letterSpacing: "tight",
  },
  error: {
    color: "red.600",
  },
  macros: {
    direction: "row",
  },
  macrosField: {
    position: "relative",
    bg: "rgba(200,200,200,0.2)",
    borderRadius: "1em",
    marginRight: "1em",
    marginY: "1.5em",
    width: "100%",
    justify: "center",
  },
  macrosImage: {
    position: "absolute",
    top: "-3",
    boxSize: "35px",
    filter: "grayscale(0.2)",
    pointerEvents: "none",
  },
  macrosName: {
    position: "absolute",
    bottom: "3",
    color: "gray.300",
    fontWeight: "500",
    pointerEvents: "none",
  },
  block: {
    height: { base: "7em", md: "0" },
  },
  macrosInput: {
    placeholder: "0g",
    border: "none",
    textAlign: "center",
    focusBorderColor: "none",
    paddingTop: "0.75em",
    paddingBottom: "1em",
  },
  buttonContainer: {
    position: "fixed",
    bottom: { base: "1vh", md: "3vh" },
    width: { base: "90%", md: "30%" },
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
};
