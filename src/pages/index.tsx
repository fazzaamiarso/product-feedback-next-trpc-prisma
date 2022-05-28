import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import db from "../db/prisma";

export const getServerSideProps = async () => {
  const feedbacks = await db.feedback.findMany();
  const users = await db.user.findMany({
    select: { avatar: true, id: true, name: true },
  });

  return {
    props: {
      feedbacks,
      users,
    },
  };
};

function Home({
  feedbacks,
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className='text-2xl font-bold text-cyan bg-darkblue'>
      Hello Somebody
      <div className='text-salmon text-normal font-normal'>
        {feedbacks.length}
      </div>
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
