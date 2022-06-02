import { Dialog, Listbox, RadioGroup, Transition } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeIcon,
  CheckIcon,
  CloseIcon,
  CommentIcon,
  HamburgerIcon,
  PlusIcon,
} from "components/Icons";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode, useId, useState } from "react";
import { trpc } from "../utils/trpc";
import type { EnumCategory } from "./api/trpc/[trpc]";

const SORT_LIST = [
  "Most Upvotes",
  "Least Upvotes",
  "Most Comments",
  "Least Comments",
];
const CATEGORIES = ["All", "UI", "UX", "Enhancement", "Bug", "Feature"];

function Home() {
  const [filterValue, setFilterValue] = useState(CATEGORIES[0]);
  const [sortValue, setSortValue] = useState(SORT_LIST[0]);
  const { data, isLoading } = trpc.useQuery([
    "feedback",
    { sort: sortValue, filter: filterValue.toUpperCase() as EnumCategory },
  ]);

  return (
    <main className='flex  flex-col  items-center bg-gray'>
      <header className='w-full bg-purple'>
        <Example>
          <FilterRadios
            selectedValue={filterValue}
            setSelectedValue={setFilterValue}
          />
        </Example>
      </header>
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

function Example({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <HamburgerIcon />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-75'
            leave='ease-in-out duration-500'
            leaveFrom='opacity-75'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-darkgray transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden '>
            <div className='absolute inset-0 overflow-hidden '>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-[300px] pl-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-y-scroll bg-gray shadow-xl'>
                      <div className='overflow-y-auto py-6 px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='font-medium text-gray-900 text-lg'>
                            {" "}
                            Shopping cart{" "}
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='text-gray-400 hover:text-gray-500 -m-2 p-2'
                              onClick={() => setOpen(false)}
                            >
                              <span className='sr-only'>Close panel</span>
                              <CloseIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/*Content */}
                      {children}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

const FilterRadios = ({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: (val: string) => void;
}) => {
  return (
    <div className='mx-auto w-10/12 rounded-md bg-white p-6'>
      <fieldset className='flex flex-wrap gap-4 '>
        {CATEGORIES.map((c, idx) => (
          <div key={idx} className='relative'>
            <input
              type='radio'
              id={c}
              name='category'
              value={c}
              className='peer absolute left-0 z-10 h-full w-full cursor-pointer rounded-none opacity-0 checked:pointer-events-none '
              checked={selectedValue === c}
              onChange={() => {
                setSelectedValue(c);
              }}
            />
            <label
              htmlFor={c}
              className='rounded-md bg-gray px-4 py-1 text-2xs font-semibold text-blue  peer-checked:bg-blue peer-checked:text-white peer-hover:bg-[#CFD7FF]  '
            >
              {c}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
};
