import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
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
    <main className="text-red-500">
      Hello Somebody
      <div>{post.length}</div>
    </main>
  );
}

export default Home;
