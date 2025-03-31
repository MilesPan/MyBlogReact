import { IconPack, config, library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "windi.css";
import "../styles/globals.css";
import "../styles/transition.css";
import "../styles/robot.css";
import type { AppProps } from "next/app";
import BlogLayout from "../components/layout/BlogLayout";
import Head from "next/head";

import AOS from "aos";
import "aos/dist/aos.css";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";
import NextNprogress from "nextjs-progressbar";
import type { NextPage } from "next";
import { pageview } from "../lib/gtag";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from '../lib/ChatContext';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

config.autoAddCss = false;
library.add(fab as IconPack);

declare global {
  interface Window {
    _hmt: any;
  }
}

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });

    const handleRouteChange = (url: string) => {
      pageview(url, document.title);
      try {
        window._hmt.push(["_trackPageview", url]);
      } catch (e) {}
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  const getLayout =
    Component.getLayout || ((page: any) => <BlogLayout>{page}</BlogLayout>);

  return (
    <ThemeProvider attribute="class">
      <ChatProvider>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <title>Peter Pan</title>
          <meta name="description" content="潘冬源" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/blog/favicon-32x32.ico"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/blog/favicon-16x16.ico"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <NextNprogress color="#ff9500" options={{ showSpinner: false }} />
        {getLayout(<Component {...pageProps} />)}
      </ChatProvider>
    </ThemeProvider>
  );
}

export default MyApp;
