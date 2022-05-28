import type { InferGetServerSidePropsType } from "next";
import db from "../db/prisma";

export const getServerSideProps = async () => {
  const post = await db.post.findMany();

  return {
    props: {
      post,
    },
  };
};

function Home({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className='text-2xl font-bold text-cyan bg-darkblue'>
      Hello Somebody
      <div className='text-salmon text-normal font-normal'>{post.length}</div>
    </main>
  );
}

export default Home;
