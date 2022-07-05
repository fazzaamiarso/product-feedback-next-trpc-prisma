import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";

export default function SignIn({
  providers
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className='mx-auto max-w-lg py-12'>
      <h1 className='mt-6 mb-8 text-center text-[32px] font-bold text-darkerblue'>
        Sign in to Product Feedback
      </h1>
      {providers &&
        Object.values(providers).map((provider) => {
          return (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className='mx-auto block w-60 rounded-md bg-purple p-4 font-semibold text-white hover:opacity-90'
            >
              Sign in with {provider.name}
            </button>
          );
        })}
    </main>
  );
}

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  const providers = await getProviders();
  const session = await getSession({ req });
  if (session?.user || !providers) res.writeHead(302, { location: "/" }) && res.end();
  return { props: { providers } };
};
