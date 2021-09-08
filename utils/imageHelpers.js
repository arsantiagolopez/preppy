import Pica from "pica";

const resizeImage = (file, body) => {
  const pica = Pica();

  const outputCanvas = document.createElement("canvas");
  // this will determine resulting size
  // ignores proper aspect ratio, but could be set dynamically
  // to handle that
  outputCanvas.height = 50;
  outputCanvas.width = 50;

  return new Promise((resolve) => {
    const img = new Image();

    // resize needs to happen after image is "loaded"
    img.onload = () => {
      resolve(
        pica
          .resize(img, outputCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          })
          .then((result) => pica.toBlob(result, "image/jpeg", 0.7))
      );
    };

    img.src = `data:${file.type};base64,${body}`;
  });
};

const convertBlobToBinaryString = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onabort = () => {
      reject(new Error("Reading blob aborted"));
    };

    reader.onerror = () => {
      reject(new Error("Error reading blob"));
    };

    reader.readAsBinaryString(blob);
  });
};

const readFile = (file, onUpload) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    onUpload(file, btoa(event.target.result));
  };

  reader.readAsBinaryString(file);
};

export { resizeImage, convertBlobToBinaryString, readFile };
