import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { signIn } from "next-auth/client";
import React, { useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

const BANNER_IMAGE_URL =
  "https://images.unsplash.com/photo-1604147873686-02c49cfdfb1e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3334&q=80";

const Signin = ({ providers, screenHeight, isPortrait }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const year = new Date().getFullYear();

  const handleChange = (event) => {
    if (error) setError(null);
    setEmail(event.target.value);
  };

  const handleEmailSend = async () => {
    setIsLoading(true);

    const res = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: `${process.env.NEXTAUTH_URL}`,
    });

    if (res.error) {
      setError("Link not sent. Please input a valid email.");
    } else {
      setEmailSent(true);
    }

    setIsLoading(false);
  };

  const socialProviders = Object.values(providers).filter(
    ({ type }) => type !== "email"
  );

  return (
    <Flex {...styles.wrapper} height={screenHeight}>
      {/* Content */}
      <Flex {...styles.content}>
        <Heading {...styles.heading}>Sign in with your email.</Heading>

        {/* Email */}
        <Flex {...styles.field}>
          <Input
            placeholder="Your email"
            value={email}
            onChange={handleChange}
            {...styles.input}
          />
          {error && <Text {...styles.error}>{error}</Text>}
        </Flex>

        {!emailSent ? (
          <Button
            {...styles.button}
            onClick={handleEmailSend}
            isLoading={isLoading}
            loadingText="Sending"
            spinnerPlacement="end"
          >
            Send me a link
          </Button>
        ) : (
          <Button {...styles.button} backgroundColor="green.400">
            Email sent <CheckIcon paddingLeft="1" marginLeft="2" />
          </Button>
        )}

        <Text {...styles.separator}>...or continue with</Text>

        {/* Socials */}
        {Object.values(socialProviders).map(({ id, name }, index) => (
          <Button
            key={id}
            {...styles.heading}
            {...styles.socials}
            onClick={() =>
              signIn(id, {
                callbackUrl: `${process.env.NEXTAUTH_URL}`,
              })
            }
            marginBottom={
              Object.values(socialProviders).length - 1 !== index && "2vh"
            }
          >
            <Icon
              as={
                id === "google"
                  ? FaGoogle
                  : id === "facebook"
                  ? FaFacebookF
                  : null
              }
              {...styles.icon}
            />{" "}
            {name}
          </Button>
        ))}

        <Text {...styles.policy}>
          By continuing, I agree to Preppy&apos;s <u>Privacy Policy</u> and{" "}
          <u>Terms of Use.</u>
        </Text>

        {/* Footer */}
        <Flex {...styles.footer}>
          <Image src="/black-logo.png" alt="Preppy" {...styles.logo} />
          <Text {...styles.disclaimer}>All rights reserved {year}</Text>
        </Flex>
      </Flex>

      {/* Desktop banner */}
      <Flex
        {...styles.banner}
        backgroundImage={`url(${BANNER_IMAGE_URL})`}
        display={{
          base: "none",
          // Hide banner on mobile
          md: isPortrait ? "none" : "flex",
        }}
        height="100%"
      >
        <Heading {...styles.title}>
          Meal preps,
          <br /> on steroids.
        </Heading>
      </Flex>
    </Flex>
  );
};

export { Signin };

// Styles

const styles = {
  wrapper: {
    width: "100vw",
    justify: "center",
  },
  content: {
    flex: 1,
    position: "relative",
    paddingX: { base: "2em", md: "5vw" },
    maxWidth: "40em",
    direction: "column",
    justify: "center",
    align: "flex-start",
    background: "white",
    height: "100%",
  },
  heading: {
    color: "brand",
    letterSpacing: "tight",
    paddingY: "0.5vh",
  },
  field: {
    direction: "column",
    marginY: "2vh",
    width: "100%",
  },
  input: {
    paddingY: "1.5em",
  },
  error: {
    color: "red.500",
    lineHeight: { base: "1.25em", md: "1.5em" },
    paddingTop: "1",
  },
  button: {
    width: "100%",
    color: "white",
    background: "brand",
    paddingY: "1.5em",
  },
  separator: {
    width: "100%",
    paddingY: "2vh",
    textAlign: "center",
  },
  socials: {
    width: "100%",
    variant: "outline",
    color: "gray.600",
    paddingY: "1.5em",
  },
  icon: {
    color: "gray.600",
    marginRight: "3",
  },
  policy: {
    display: "inline-block",
    direction: "column",
    justify: "center",
    align: "flex-start",
    paddingY: "2vh",
    color: "gray.500",
  },
  footer: {
    position: "absolute",
    bottom: "8vh",
    left: "0",
    direction: "column",
    justify: "center",
    align: "center",
    width: "100%",
  },
  logo: {
    paddingY: "3",
    width: "6em",
  },
  disclaimer: {
    fontSize: "10pt",
  },
  // Only on desktop
  banner: {
    flex: 2,
    justify: "center",
    align: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  title: {
    color: "white",
    letterSpacing: "tight",
    fontSize: "5vw",
    textAlign: "center",
  },
};
