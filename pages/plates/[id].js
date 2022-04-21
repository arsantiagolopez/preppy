import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { DeletePlateAlert } from "../../components/DeletePlateAlert";
import { EditPlateModal } from "../../components/EditPlateModal";
import { Layout } from "../../components/Layout";

const Plate = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR(`/api/plates/${id}`);

  const { picture, name, category, calories, protein, carbs, fat } = data || {};

  const editPlateModalProps = { data };
  const deletePlateAlertProps = { data };

  return (
    <Layout hideMobileMainNav withoutBlur withTitle={name}>
      <Flex {...styles.wrapper}>
        {/* Data */}
        <Flex {...styles.data}>
          <Flex {...styles.field}>
            <Flex {...styles.category}>
              <Heading {...styles.subHeading}>Calories</Heading>
              <Image
                src="/calories.png"
                alt="calories"
                {...styles.macrosImage}
              />
            </Flex>
            <Text>{calories}</Text>
          </Flex>

          <Heading {...styles.heading}>Macros</Heading>

          <Flex {...styles.field}>
            <Flex {...styles.category}>
              <Heading {...styles.subHeading}>Protein</Heading>
              <Image src="/protein.png" alt="protein" {...styles.macrosImage} />
            </Flex>
            <Text>{typeof protein === "number" ? protein : "Unknown"}</Text>
          </Flex>

          <Flex {...styles.field}>
            <Flex {...styles.category}>
              <Heading {...styles.subHeading}>Carbohydrates</Heading>
              <Image src="/carbs.png" alt="carbs" {...styles.macrosImage} />
            </Flex>
            <Text>{typeof carbs === "number" ? carbs : "Unknown"}</Text>
          </Flex>

          <Flex {...styles.field}>
            <Flex {...styles.category}>
              <Heading {...styles.subHeading}>Fat</Heading>
              <Image src="/fat.png" alt="fat" {...styles.macrosImage} />
            </Flex>
            <Text>{typeof fat === "number" ? fat : "Unknown"}</Text>
          </Flex>
        </Flex>

        {/* Image banner */}
        <Flex {...styles.picture} backgroundImage={picture}>
          <Flex {...styles.meta}>
            <Heading {...styles.metaCategory}>{category}&apos;s</Heading>
            <Heading
              background={"linear-gradient(90deg, white 40%, transparent 100%)"}
              backgroundClip="text"
              {...styles.name}
            >
              {name}{" "}
              <Flex {...styles.actions}>
                <Button {...styles.button}>
                  <EditPlateModal {...editPlateModalProps} />
                </Button>

                <Button {...styles.button}>
                  <DeletePlateAlert {...deletePlateAlertProps} />
                </Button>
              </Flex>
            </Heading>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

Plate.isProtected = true;

export default Plate;

// Styles

const styles = {
  wrapper: {
    direction: "column",
  },
  data: {
    order: { base: 2, md: 1 },
    direction: "column",
    width: { base: "100%", md: "30vw" },
    paddingRight: "3vw",
    marginTop: { base: "50vh", md: "2em" },
  },
  field: {
    direction: "column",
    marginY: { base: "1.5vh", md: "1em" },
    marginLeft: { base: "0.5em", md: "0" },
  },
  category: {
    direction: "row",
    justify: "space-between",
  },
  heading: {
    marginY: { base: "1vh", md: "2vh" },
    marginX: { base: "0.25em", md: "0" },
    marginTop: { base: "1vh", md: "6vh" },
  },
  subHeading: {
    size: "md",
  },
  macrosImage: {
    position: "absolute",
    right: { base: "1.5em", md: "55vw" },
    marginTop: "-1",
    boxSize: { base: "40px", md: "50px" },
    filter: "grayscale(0.2)",
    pointerEvents: "none",
  },
  picture: {
    order: { base: 1, md: 2 },
    position: { base: "absolute", md: "fixed" },
    top: "0",
    right: "0",
    bottom: "0",
    width: { base: "100%", md: "50vw" },
    height: { base: "55vh", md: "100vh" },
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: {
      base: "inset 0 -30vh 30vh -15vh rgba(0,0,0,0.8)",
      md: "inset 0 -50vh 50vh -15vh rgba(0,0,0,0.8)",
    },
  },
  meta: {
    marginTop: "auto",
    direction: "column",
    position: "relative",
    width: "100%",
    marginBottom: { base: "1em", md: "5vw" },
    marginLeft: { base: "1em", md: "5vw" },
  },
  name: {
    color: "white",
    fontSize: { base: "5xl", md: "9xl" },
    textTransform: "capitalize",
    width: "100%",
    maxWidth: { base: "85%", md: "37vw" },
    fontWeight: "extrabold",
    noOfLines: 1,
    marginTop: { base: "-0.2em", md: "-0.1em" },
  },
  actions: {
    position: "absolute",
    right: { base: "1.5vw", md: "2vw" },
    bottom: { base: "3vw", md: "2vh" },
  },
  button: {
    variant: "ghost",
    boxSize: { base: "40px", md: "100px" },
    color: "white",
  },
  metaCategory: {
    fontSize: { base: "xl", md: "4xl" },
    color: "white",
    marginLeft: "0.25em",
  },
};
