import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react";

export default function SignIn({
  providers
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className='mx-auto max-w-lg py-12'>
      <h1 className='mt-6 mb-8 text-center text-2xl font-bold text-darkerblue'>
        Sign in to your account
      </h1>
      {providers &&
        Object.values(providers).map((provider) => {
          return (
            <div key={provider.id}>
              <button
                onClick={() => signIn(provider.id)}
                className='w-full rounded-md bg-salmon p-4 font-semibold hover:opacity-90'
              >
                Sign in with {provider.name}
              </button>
            </div>
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
