import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import store from "./store/index.js";
import React from "react";

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
