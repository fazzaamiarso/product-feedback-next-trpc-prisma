import Image from "next/image";
import { trpc } from "../utils/trpc";

function Home() {
  const { data, isLoading } = trpc.useQuery(["user"]);

  return (
    <main className='text-2xl font-bold text-cyan bg-darkblue'>
      Hello Somebody
      <ul className='flex flex-col gap-1'>
        {isLoading && "Loading users..."}
        {data?.users.map((user) => {
          return (
            <li
              key={user.id}
              className='flex gap-4 items-center text-normal font-normal'
            >
              <Image
                className='rounded-full'
                src={user.avatar ?? ""}
                width={50}
                height={50}
                alt={user.username}
              />
              <p>{user.username}</p>
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
