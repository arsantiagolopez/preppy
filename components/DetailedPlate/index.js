import {
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { mutate } from "swr";
import axios from "../../axios";
import { showToast } from "../../utils/showToast";

const DetailedPlate = ({ plate, active, setActive, plates, categories }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, name, link, category, picture, calories, protein, carbs, fat } =
    plate;

  const isMyPlate = plates?.some((plate) => plate.name === name);

  // Handle toast response on success or failure
  const handleToast = (status) => {
    setIsLoading(false);

    const successMessage = isMyPlate
      ? `${name} was removed from your plates.`
      : `${name} was added to your plates!`;

    if (status === 200) {
      // Show success toast
      return showToast({
        status: isMyPlate ? "error" : "success",
        title: successMessage,
      });
    } else {
      // Show error toast
      return showToast({
        status: "error",
        title: "Something went wrong. Try again later.",
      });
    }
  };

  // Toggle add or remove plate
  const handlePlateAction = async () => {
    setIsLoading(true);

    // Add plate if it isn't already added
    if (!isMyPlate) {
      // Check 1: Create category "marketplace" if it doesn't exist
      const categoryExists = categories.includes("marketplace");

      if (!categoryExists) {
        await axios.post("/api/categories", { name: "marketplace" });
      }

      // Check 2: Create plate
      const { link, ...newPlateProps } = plate;

      const { status } = await axios.post("/api/plates", newPlateProps);

      // Handle response
      if (status === 200) {
        // Mutate new data & revalidate
        mutate("/api/plates", [...plates, newPlateProps]);
      }

      // Show toast on success or failure
      handleToast(status);
    }
    // Delete if plate is added
    else {
      // Get plate ID
      const plateObj = plates?.find((plate) => plate.name.includes(name));
      const plateId = plateObj?._id;

      // Delete plate
      const { status } = await axios.delete(`/api/plates/${plateId}`);

      // Handle response
      if (status === 200) {
        // Mutate new data & revalidate
        const updatedPlates = plates.filter(({ _id }) => _id !== plateId);
        mutate("/api/plates", updatedPlates);
      }

      // Show toast on success or failure
      handleToast(status);
    }

    // Close modal
    setActive(null);
  };

  return (
    <Modal
      isCentered
      isOpen={active === id}
      onClose={() => setActive(null)}
      {...styles.wrapper}
    >
      <ModalOverlay />
      <ModalContent {...styles.content} backgroundImage={`url(${picture})`}>
        <ModalCloseButton {...styles.closeButton} />

        <ModalBody {...styles.body}>
          <Flex {...styles.meta}>
            <Heading {...styles.category}>Spoontacular&apos;s</Heading>
            <Heading {...styles.name}>{name}</Heading>

            <Flex width="100%">
              <Text {...styles.macros}>
                <Image
                  src="/calories.png"
                  alt="Calories"
                  {...styles.macrosImage}
                />
                {calories} cals
              </Text>
              <Text {...styles.macros}>
                <Image
                  src="/protein.png"
                  alt="Protein"
                  {...styles.macrosImage}
                />
                {protein} protein
              </Text>
              <Text {...styles.macros}>
                <Image
                  src="/carbs.png"
                  alt="Carbohydrates"
                  {...styles.macrosImage}
                />
                {carbs} carbs
              </Text>
              <Text {...styles.macros}>
                <Image src="/fat.png" alt="Fat" {...styles.macrosImage} />
                {fat} fat
              </Text>
            </Flex>

            {/* Action control */}
            <Flex {...styles.actions}>
              <Link href={link} isExternal {...styles.externalButton}>
                <Button leftIcon={<GiForkKnifeSpoon />} {...styles.button}>
                  See recipe
                </Button>
              </Link>

              <Button
                onClick={handlePlateAction}
                isLoading={isLoading}
                loadingText={isMyPlate ? "Removing" : "Adding"}
                leftIcon={isMyPlate ? <IoMdRemove /> : <IoMdAdd />}
                _hover={{ bg: isMyPlate ? "red.400" : "green.500" }}
                _active={{ bg: isMyPlate ? "red.500" : "green.200" }}
                {...styles.button}
              >
                {isMyPlate ? "Remove" : "Add"}
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { DetailedPlate };

// Styles

const styles = {
  wrapper: {
    size: "2xl",
  },
  content: {
    height: { base: "100%", md: "80vh" },
    borderRadius: { base: "0", md: "1.5em" },
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  closeButton: {
    color: "white",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "inset 0 -30vh 30vh -15vh black",
    borderRadius: { base: "0", md: "1.5em" },
  },
  meta: {
    direction: "column",
    maxWidth: "100%",
    paddingY: { base: "2em", md: "1em" },
  },
  macros: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    isTruncated: true,
    color: "white",
    size: "lg",
    paddingRight: { base: "1em", md: "1.5em" },
    paddingY: "0.5em",
  },
  category: {
    isTruncated: true,
    color: "white",
    size: "md",
    marginBottom: "1",
  },
  name: {
    isTruncated: true,
    color: "white",
    letterSpacing: "tighter",
    size: "3xl",
  },
  macrosImage: {
    boxSize: { base: "15px", md: "20px" },
    filter: "brightness(0) invert(1)",
    marginRight: "1",
  },
  link: {
    isTruncated: true,
    color: "gray.400",
  },
  actions: {
    direction: "row",
    justify: "space-between",
    width: "100%",
    height: "4em",
    marginTop: "1em",
  },
  button: {
    spinnerPlacement: "start",
    width: "100%",
    borderRadius: "0.5em",
    background: "rgba(230,230,230,0.1)",
    style: {
      backdropFilter: "blur(3px)",
    },
  },
  externalButton: {
    marginRight: "3",
    width: "100%",
    _hover: {
      textTransform: "none",
    },
  },
};
