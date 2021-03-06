import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";
import superjson from "superjson";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import type { NextPage } from "next";
import { ReactNode, useEffect } from "react";

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

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

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
  ssr: true
})(MyApp);
