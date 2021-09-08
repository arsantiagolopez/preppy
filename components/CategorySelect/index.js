import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

const CategorySelect = ({ categories, onChange, defaultValue }) => {
  // Destructure category object into only names
  categories = categories?.map(({ name }) => name);

  const createOption = (label) => ({
    label,
    value: label?.toLowerCase().replace(/\W/g, ""),
  });

  const getInitialValues = () => categories?.map((name) => createOption(name));

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(getInitialValues);
  const [value, setValue] = useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
    // newValue is null when creating new value
    if (newValue) {
      onChange(newValue.label);
    }
  };

  const handleCreate = async (inputValue) => {
    setIsLoading(true);

    setTimeout(() => {
      // Create option, add to list, set as new value
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions([...options, newOption]);
      setValue(newOption);
      // Handle null
      if (newOption) {
        onChange(newOption.label);
      }
    }, 1000);
  };

  useEffect(() => {
    // Set initial value to passed down default value
    if (defaultValue) {
      setValue(createOption(defaultValue));
    }
  }, [categories]);

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={handleChange}
      onCreateOption={handleCreate}
      options={options}
      value={value}
      styles={styles}
      placeholder="Category"
      defaultValue={defaultValue}
      noOptionsMessage={() => "You don't have any categories. Create one."}
    />
  );
};

export { CategorySelect };

const styles = {
  container: (provided) => ({
    ...provided,
    marginTop: "0.25em",
    backgroundColor: "transparent",
    width: "100%",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontFamily: "system-ui, sans-serif", // default
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
