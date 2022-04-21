import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "../../axios";
import { showToast } from "../../utils/showToast";

const DeleteCategoryAlert = ({ name }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef();

  const router = useRouter();

  // Delete plate on confirmation
  const handleDelete = async () => {
    const response = await axios.delete(`/api/categories/${name}`);

    if (response.status === 200) {
      // Close modal
      onClose();
      // Successfully deleted a plate
      showToast({
        status: "success",
        title: `Your category ${name} was deleted.`,
      });
      // Redirect to "/categories"
      router.push("/categories");
    } else {
      // Show error toast
      showToast({
        status: "error",
        title: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <>
      {/* Delete trigger */}
      <Button onClick={onOpen} {...styles.trigger}>
        <Icon as={IoCloseSharp} {...styles.icon} />
      </Button>

      {/* Alert */}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        {...styles.alert}
      >
        <AlertDialogOverlay />

        <AlertDialogContent {...styles.content}>
          <AlertDialogHeader {...styles.header}>
            Delete category &quot;{name}&quot;?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this category?
            <br />
            The category will be gone but your plates will be stored on the
            <b>&quot;All&quot;</b> category.
          </AlertDialogBody>
          <AlertDialogFooter {...styles.footer}>
            <Button
              ref={cancelRef}
              onClick={onClose}
              background="gray.200"
              {...styles.button}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              background="brand"
              {...styles.button}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { DeleteCategoryAlert };

// Styles

const styles = {
  trigger: {
    variant: "ghost",
    paddingX: "0",
    marginLeft: "2",
    height: "100%",
  },
  icon: {
    color: "red.500",
    fontSize: "3xl",
    animation:
      "rotate-in-2-cw 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
  },
  alert: {
    isCentered: true,
    motionPreset: "slideInBottom",
  },
  content: {
    borderRadius: "0.5em",
    paddingX: { base: "0.5em", md: "1em" },
    paddingY: "1em",
  },
  header: {
    textAlign: "center",
    paddingY: "0.5em",
  },
  body: {
    align: "center",
  },
  footer: {
    paddingY: "1vh",
    width: { base: "100%", md: "100%" },
    marginX: "auto",
  },
  button: {
    marginY: "1vh",
    marginX: "1",
    paddingY: { base: "1.5em", md: "1.75em" },
    width: "100%",
    borderRadius: "0.5em",
    color: "white",
    boxShadow: "lg",
  },
};
