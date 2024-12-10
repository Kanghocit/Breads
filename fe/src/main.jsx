import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "../languages/i18n";
import App from "./App.jsx";
import "./index.css";
import store from "./store/index.js";

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("#fafafa", "#0a0a0a")(props),
    },
  }),
};
// _hover={{ bg: colorMode === "dark" ? "#171717" : "#f0f0f0" }}
// bg={colorMode === "dark" ? "#0a0a0a" : "#fafafa"}
// color={colorMode === "dark" ? "#b8b8b8" : "#ffffff"}
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#0a0a0a",
  },
  cbg: {
    light: "#fafafa",
    dark: "#181818",
  },
  cuse: {
    light: "#ffffff",
    dark: "#202020",
  },
  ccl: {
    light: "#f3f5f7",
    dark: "#000000",
  },
};

const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        {/* <ColorModeScript initialColorMode={theme.config.initialColorMode}> */}
        <App />
        {/* </ColorModeScript> */}
      </ChakraProvider>
    </Provider>
  </BrowserRouter>
);
