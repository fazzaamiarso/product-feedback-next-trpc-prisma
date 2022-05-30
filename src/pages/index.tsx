import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import db from "../db/prisma";

export const getServerSideProps = async () => {
  const users = await db.user.findMany({
    select: { avatar: true, id: true, name: true },
  });

  const feedbacks = await db.feedback.findMany({
    select: { id: true, comments: true, title: true, description: true },
  });
  return {
    props: {
      users,
      feedbacks,
    },
  };
};

function Home({
  users,
  feedbacks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className='text-2xl font-bold text-cyan bg-darkblue'>
      Hello Somebody
      <ul className='flex gap-2'>
        {users.map((user) => {
          return (
            <li key={user.id}>
              <Image
                className='rounded-full'
                width={50}
                height={50}
                src={user.avatar ?? ""}
                alt={user.name}
              />
            </li>
          );
        })}
      </ul>
      <ul className='max-w-screen w-10/12'>
        {feedbacks.map((feedback) => {
          return (
            <pre className='w-screen' key={feedback.id}>
              {JSON.stringify(feedback)}
            </pre>
          );
        })}
      </ul>
      <Image
        src='/assets/suggestions/illustration-empty.svg'
        alt='empty'
        width={200}
        height={200}
      />
    </main>
  );
}

export default Home;
