import { Button } from "components/Button";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  if (session?.user.username)
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  return {};
};

export default function Username() {
  const router = useRouter();
  const mutation = trpc.useMutation("user.username", {
    onSuccess: () => router.replace("/")
  });
  return (
    <main className='w-full'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const username = formData.get("username") as string;
          mutation.mutate({ username });
        }}
        className='mx-auto my-20 flex w-10/12 max-w-lg flex-col gap-4 bg-white p-4 shadow-lg'
      >
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          name='username'
          required
          className='w-full ring-1 ring-darkerblue'
        />
        <Button type='submit' className='bg-blue'>
          {mutation.isLoading ? "Checking username..." : "Create Username"}
        </Button>
      </form>
    </main>
  );
}
