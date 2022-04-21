import { getProviders } from "next-auth/client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Signin } from "../../components/Signin";
import { useDimensions } from "../../utils/useDimensions";

const SignIn = ({ providers }) => {
  const [screenHeight, setScreenHeight] = useState(null);

  const { height, width } = useDimensions();

  const isPortrait = height > width;

  // Update height post SSR fetch to allow
  // height CSS to work on mount
  useEffect(() => setScreenHeight(height), [height]);

  const signinProps = { providers, screenHeight, isPortrait };

  return (
    <>
      <Head>
        <title>Preppy - Sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Signin {...signinProps} />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
