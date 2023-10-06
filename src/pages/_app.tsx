import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "@/store/index";
import { SnackbarProvider, useSnackbar } from "notistack";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      maxSnack={3}
      autoHideDuration={2000}
    >
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SnackbarProvider>
  );
}
