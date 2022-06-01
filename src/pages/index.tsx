import { Listbox } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeIcon,
  CheckIcon,
  CommentIcon,
  PlusIcon,
} from "components/Icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const SORT_LIST = [
  "Most Upvotes",
  "Least Upvotes",
  "Most Comments",
  "Least Comments",
];

function Home() {
  const [sortValue, setSortValue] = useState(SORT_LIST[0]);
  const { data, isLoading } = trpc.useQuery(["feedback", sortValue]);

  return (
    <main className='flex  flex-col  items-center bg-gray'>
      <div className=' flex w-full items-center bg-darkerblue px-4 py-4 '>
        <div className='mr-8 hidden items-center gap-2 font-bold text-white md:flex'>
          <BadgeIcon /> {data?.feedbacks.length} Suggestions
        </div>
        <SortListbox
          selectedValue={sortValue}
          setSelectedValue={setSortValue}
        />
        <Link href='/feedback/new'>
          <a className='ml-auto flex items-center gap-1 rounded-md bg-purple px-6 py-3 text-2xs font-semibold text-white hover:opacity-80'>
            <PlusIcon />
            Add Feedback
          </a>
        </Link>
      </div>
      {data && data.feedbacks ? (
        <ul className='mx-auto flex w-full flex-col items-center gap-6 py-12 px-4'>
          {data.feedbacks.map((fb) => {
            return (
              <li
                key={fb.id}
                className='grid-rows-[repeat(2, max-content)] grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8  rounded-md bg-white p-6 md:flex md:items-center'
              >
                <div className='col-span-2 flex flex-col items-start space-y-2 md:order-2 md:basis-full'>
                  <h4 className='text-lg font-bold text-darkerblue'>
                    {fb.title}
                  </h4>
                  <p className='text-sm text-darkgray'>{fb.description}</p>
                  <span className='rounded-md bg-gray px-4 py-1 text-xs  text-blue'>
                    {fb.category.toLowerCase()}
                  </span>
                </div>
                <button className='col-start-1 flex items-center gap-2 place-self-center justify-self-start rounded-md bg-gray px-4 py-1 text-2xs font-semibold hover:bg-[#CFD7FF] md:order-1 md:flex-col '>
                  <ArrowUpIcon /> {fb.upvotesCount}
                </button>
                <div className=' col-start-2 flex items-center gap-2 place-self-center justify-self-end md:order-3 '>
                  <CommentIcon /> {fb.interactionsCount}
                </div>
              </li>
            );
          })}
        </ul>
      ) : isLoading ? (
        <p>Loading.....</p>
      ) : (
        <EmptyBoard />
      )}
    </main>
  );
}

export default Home;

function SortListbox({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: (val: string) => void;
}) {
  return (
    <Listbox value={selectedValue} onChange={setSelectedValue}>
      <div className=' relative '>
        <Listbox.Button className='relative flex w-full items-center gap-2 text-xs text-lightgray'>
          {({ open }) => (
            <>
              <span>Sort by:</span>
              <span className='flex items-center gap-1 font-semibold text-white'>
                {selectedValue} {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </span>
            </>
          )}
        </Listbox.Button>
        <Listbox.Options className='absolute mt-4 w-[calc(100%+3rem)] divide-y-[1px] divide-gray rounded-md bg-white text-darkerblue shadow-xl '>
          {SORT_LIST.map((item, idx) => (
            <Listbox.Option
              key={idx}
              value={item}
              className='flex cursor-pointer items-center justify-between p-2 px-4 '
            >
              {({ active, selected }) => (
                <>
                  <span className={active ? " text-purple" : ""}>{item}</span>
                  {selected && <CheckIcon />}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

const EmptyBoard = () => {
  return (
    <div className='mt-24 flex w-10/12 flex-col items-center gap-4 text-center'>
      <Image
        src='/assets/suggestions/illustration-empty.svg'
        alt='empty'
        width={200}
        height={200}
      />
      <p className='text-2xl font-bold text-darkerblue'>
        There is no feedback yet.
      </p>
      <p className='text-normal text-darkgray'>
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <button className='mt-6 flex items-center gap-1 rounded-md bg-purple px-6 py-3 text-2xs font-semibold text-white hover:opacity-80'>
        <PlusIcon />
        Add Feedback
      </button>
    </div>
  );
};
