import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "../styles/globals.css";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Board Game Playground | Play against AI</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Five board games in the browser: TZAAR, Family Inc., High Society, No Thanks! and Razzia!, against clever bots or friends."
          key="desc"
        />
      </Head>

      <MantineProvider defaultColorScheme="light">
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
