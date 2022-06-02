import { Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Card } from "../Card";
import { Footer } from "../Footer";
import { Navigation } from "../Navigation";
import { Sidebar } from "../Sidebar";

const Layout = ({
  children,
  pageTitle,
  pageImage,
  pageDescription,
  hideMobileMainNav,
  withTitle,
  withoutBlur,
  isSchedule,
  ...props
}) => {
  const router = useRouter();

  const isPlates = router?.pathname === "/plates";
  const isMarketplace = router?.pathname === "/marketplace";
  const isPlate = router?.pathname.includes("/plates/");

  const navigationProps = {
    hideMobileMainNav,
    withTitle,
    withoutBlur,
    isSchedule,
    ...props,
  };

  return (
    <>
      <Head>
        <title>Preppy{pageTitle && ` - ${pageTitle}`}</title>
      </Head>
      <Flex {...styles.wrapper}>
        <Navigation {...navigationProps} />
        <Flex {...styles.content}>
          {/* Side desktop menu */}
          <Sidebar />

          {/* Page title */}
          {isPlates || isMarketplace ? (
            <Flex direction="row">
              <Heading
                color={isPlates ? "brand" : "gray.200"}
                onClick={() => !isPlates && router?.push("/plates")}
                cursor={!isPlates && "pointer"}
                {...styles.heading}
              >
                My Plates
              </Heading>
              <Heading
                color={isMarketplace ? "brand" : "gray.200"}
                onClick={() => !isMarketplace && router?.push("/marketplace")}
                cursor={!isMarketplace && "pointer"}
                {...styles.heading}
                marginLeft="3"
              >
                Marketplace
              </Heading>
            </Flex>
          ) : (
            pageTitle && <Heading {...styles.heading}>{pageTitle}</Heading>
          )}

          {/* Page banner */}
          {pageImage && (
            <Card backgroundImage={pageImage} {...styles.banner}>
              <Heading {...styles.meta}>{pageDescription}</Heading>
            </Card>
          )}

          {children}
        </Flex>

        {!isPlate && <Footer />}
      </Flex>
    </>
  );
};

export { Layout };

// Styles

const styles = {
  wrapper: {
    direction: "column",
  },
  content: {
    direction: "column",
    paddingX: { base: "1em", md: "22vw" },
  },
  heading: {
    marginTop: { base: "0.5em", md: "0" },
  },
  banner: {
    width: "100%",
    height: { base: "45vh", md: "45vh" },
    marginY: { base: "1em", md: "2em" },
  },
  meta: {
    marginTop: "auto",
    width: "100%",
    padding: "1em",
    color: "white",
    fontSize: { base: "3xl", md: "3xl" },
    lineHeight: "1em",
  },
};
