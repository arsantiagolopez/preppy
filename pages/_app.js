import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "next-auth/client";
import { SWRConfig } from "swr";
import axios from "../axios";
import { ProtectedRoute } from "../components/ProtectedRoute";
import "../styles/global.css";
import theme from "../theme";

const MyApp = ({ Component, pageProps }) => (
  <Provider session={pageProps.session}>
    <SWRConfig
      value={{
        fetcher: (url) => axios(url).then((res) => res.data),
      }}
    >
      <ChakraProvider theme={theme}>
        {Component.isProtected ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </ChakraProvider>
    </SWRConfig>
  </Provider>
);

export default MyApp;
