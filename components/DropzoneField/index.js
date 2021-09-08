import { Flex, Text } from "@chakra-ui/react";
import Compressor from "compressorjs";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const DropzoneField = ({
  children,
  file,
  setFile,
  setImage,
  imageError,
  setImageError,
  ...props
}) => {
  // Handle drop
  const onDrop = useCallback(async ([file]) => {
    if (file) {
      // Clear error
      setImageError(null);

      // Create preview
      file["preview"] = URL.createObjectURL(file);

      // Temporarily update user's avatar for better UX
      setImage(file.preview);

      // Compress image
      new Compressor(file, {
        quality: 0.1,
        // Convert PNG to JPEG if over 1MB
        converstSize: 1000000,
        success(result) {
          // Store file in state
          setFile(result);
        },
      });
    } else {
      // Clear image & display error
      setImage(null);
      setImageError(
        "Your image doesn't meet our requirements. Try an image smaller than 3MB."
      );
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    minSize: 1024,
    maxSize: 5072000,
    onDrop,
  });

  useEffect(() => {
    return () => {
      if (file) {
        // Revoke the data uris to avoid memory leaks
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <Flex {...getRootProps()} {...styles.wrapper} {...props}>
      {children}
      {imageError && <Text {...styles.error}>{imageError}</Text>}
      <input {...getInputProps()} />
    </Flex>
  );
};

export { DropzoneField };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    justify: "center",
    align: "center",
  },
  error: {
    width: { base: "70%", md: "20%" },
    position: "absolute",
    paddingTop: "1em",
    color: "red.600",
  },
};
