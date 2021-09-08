/**
 * Mutation inputs take objects with the field and values to be
 * updated. This method tests for empty, null, undefined or unchanged
 * values. Strip the empty ones and return an object ready to be passed
 * as a mutation input. Takes new object and old object to compare to
 * @param {object} oldValues - object of old values to be updated.
 * @param {object} newValues - object with the changes to be updated.
 * @returns object of new values ready to be mutated.
 */
const stripEmptyOrUnused = (oldValues, newValues) => {
  let newObj = newValues;

  Object.keys(newObj).forEach((key) => {
    // If old value is number & not null, change new value to number
    if (
      typeof oldValues[key] === "number" &&
      typeof newObj[key] !== typeof oldValues[key] &&
      typeof newObj[key] !== "undefined" &&
      newObj[key] !== null &&
      newObj[key] !== ""
    ) {
      newObj[key] = parseInt(newObj[key]);
    }

    // Filter out undefined or null keys of new object
    if (
      typeof newObj[key] === "undefined" ||
      newObj[key] === null ||
      newObj[key] === ""
    ) {
      delete newObj[key];
    }

    // Check for any unchanged same type values
    if (oldValues.hasOwnProperty(key) && newObj[key] === oldValues[key]) {
      delete newObj[key];
    }
  });

  // Change string to number if needed
  Object.keys(newObj).forEach((key) => {
    const numberFields = ["calories", "protein", "carbs", "fat"];
    const isNumber = numberFields.includes(key);

    if (isNumber && typeof newObj[key] !== "number") {
      newObj[key] = parseInt(newObj[key]);
    }
  });

  return newObj;
};

export { stripEmptyOrUnused };
