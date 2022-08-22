import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import superjson from "superjson";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import type { NextPage } from "next";
import { ReactNode, useEffect } from "react";
import Head from "next/head";

type NextPageWithAuthAndLayout = NextPage & {
  hasAuth?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithAuthAndLayout = AppProps & {
  Component: NextPageWithAuthAndLayout;
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuthAndLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const page = getLayout(<Component {...pageProps} />);
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Product Feedback</title>
      </Head>
      {Component.hasAuth ? <Auth>{page}</Auth> : page}
    </SessionProvider>
  );
};

const Auth = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const isAuthenticated = Boolean(session.data?.user);
  const isUsernameRegistered = Boolean(session.data?.user?.username);

  useEffect(() => {
    if (session.status === "loading") return;
    if (!isAuthenticated || !isUsernameRegistered)
      signIn(undefined, { callbackUrl: "/auth/username" });
  }, [isAuthenticated, session.status, isUsernameRegistered]);

  if (isAuthenticated) return <>{children}</>;
  return null;
};


function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      transformer: superjson,
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      }
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false
})(MyApp);
