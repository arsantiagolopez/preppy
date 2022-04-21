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
import React, { useRef, useState } from "react";
import { IoTrash } from "react-icons/io5";
import axios from "../../axios";
import { showToast } from "../../utils/showToast";

const DeleteScheduleAlert = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const router = useRouter();

  const { _id, name } = data || {};

  // Delete schedule on confirmation
  const handleDelete = async () => {
    setIsLoading(true);

    // Delete schedule
    const response = await axios.delete(`/api/schedules/${_id}`);

    if (response.status === 200) {
      setIsLoading(false);
      // Close modal
      onClose();
      // Successfully deleted schedule
      showToast({
        status: "success",
        title: `Your schedule ${name} was deleted.`,
      });
      // Redirect to "/schedules"
      router.push("/schedules");
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
      {/* Edit trigger */}
      <Icon as={IoTrash} {...styles.icon} onClick={onOpen} />

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
            Delete {name}?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete <b>{name}</b>? Once deleted, it
            cannot be recovered.
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
              isLoading={isLoading}
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

export { DeleteScheduleAlert };

// Styles

const styles = {
  icon: {
    color: "brand",
    boxSize: { base: "2em", md: "3em" },
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
    loadingText: "Deleting",
    spinnerPlacement: "end",
    marginY: "1vh",
    marginX: "1",
    paddingY: { base: "1.5em", md: "1.75em" },
    width: "100%",
    borderRadius: "0.5em",
    color: "white",
    boxShadow: "lg",
  },
};
