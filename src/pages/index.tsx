import { Dialog, Listbox, Transition } from "@headlessui/react";
import { Category } from "@prisma/client";
import { Button } from "components/Button";
import { FeedbackCard, FeedbackSkeleton } from "components/feedback/FeedbackCard";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeIcon,
  CheckIcon,
  CloseIcon,
  HamburgerIcon,
  PlusIcon
} from "components/Icons";
import { InferQueryInput } from "lib/trpc";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactNode, SetStateAction, useRef, useState } from "react";
import { formatEnum } from "utils/display";
import { trpc } from "../utils/trpc";
import debounce from "lodash.debounce";
import { ButtonLink } from "components/ButtonLink";
import mergeClassNames from "utils/mergeClassNames";

const sortItems = ["Most Upvotes", "Least Upvotes", "Most Comments", "Least Comments"] as const;
const filterCategories = ["ALL", ...Object.values(Category)] as const;
type FilterValues = InferQueryInput<"feedback.all">["filter"];
type SortValues = InferQueryInput<"feedback.all">["sort"];

Home.hasAuth = true;

function Home() {
  const session = useSession();
  const [filterValue, setFilterValue] = useState<FilterValues>(filterCategories[0]);
  const [sortValue, setSortValue] = useState<SortValues>(sortItems[0]);
  const { data, isLoading } = trpc.useQuery([
    "feedback.all",
    { sort: sortValue, filter: filterValue }
  ]);
  const selectFilter = (val: FilterValues) => setFilterValue(val);

  return (
    <div className='mx-auto max-w-5xl gap-8 lg:flex lg:p-8'>
      <header className='relative z-20 flex w-full justify-between bg-[url("/assets/suggestions/mobile/background-header.png")] bg-cover bg-no-repeat p-4 md:hidden'>
        <div className='rounded-md md:bg-[url("/assets/suggestions/tablet/background-header.png")] md:bg-cover md:bg-no-repeat md:p-6'>
          <h1 className='flex flex-col items-start text-lg font-bold text-white'>
            Frontend Mentor <span className='text-normal font-normal'>Feedback Board</span>
          </h1>
        </div>
        <Drawer>
          {({ setDrawerOpen }) => (
            <>
              <WidgetCard>
                <FilterRadios
                  selectedValue={filterValue}
                  setSelectedValue={selectFilter}
                  setDrawerOpen={setDrawerOpen}
                />
              </WidgetCard>
              <WidgetCard>
                <Roadmap />
              </WidgetCard>
              <WidgetCard>
                <div className='flex flex-col items-center'>
                  <Image
                    src={session.data?.user?.image ?? ""}
                    alt={session.data?.user?.name ?? ""}
                    height={30}
                    width={30}
                    className='rounded-full'
                  />
                  <p className='mb-4'>{session.data?.user?.username}</p>
                  <Button className='bg-blue' type='button' onClick={() => signOut()}>
                    Logout
                  </Button>
                </div>
              </WidgetCard>
            </>
          )}
        </Drawer>
      </header>
      <header className='mx-auto  hidden w-11/12 grid-cols-3 grid-rows-1  gap-x-4 py-8 md:grid lg:flex lg:basis-1/3 lg:flex-col lg:justify-start lg:gap-6 lg:py-0 '>
        <div className='flex flex-col items-start justify-end rounded-md bg-[url("/assets/suggestions/tablet/background-header.png")] bg-cover bg-no-repeat p-6 lg:min-h-[165px]'>
          <h1 className=' flex flex-col items-start text-lg font-bold text-white lg:text-xl'>
            Frontend Mentor <span className='text-normal font-normal'>Feedback Board</span>
          </h1>
          <Button className='mt-2 bg-blue lg:hidden' type='button' onClick={() => signOut()}>
            Logout
          </Button>
        </div>
        <WidgetCard>
          <FilterRadios selectedValue={filterValue} setSelectedValue={selectFilter} />
        </WidgetCard>
        <WidgetCard>
          <Roadmap />
        </WidgetCard>
        <WidgetCard className='md:hidden lg:block'>
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Image
                src={session.data?.user?.image ?? ""}
                alt={session.data?.user?.username ?? ""}
                height={30}
                width={30}
                className='rounded-full'
              />
              <p>{session.data?.user?.username}</p>
            </div>
            <Button className='bg-blue' type='button' onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        </WidgetCard>
      </header>
      <main className='mx-auto  flex w-full flex-col items-center md:w-11/12'>
        <div className=' flex w-full items-center bg-darkerblue px-4 py-4 md:rounded-md'>
          <div className='mr-8 hidden items-center gap-2 font-bold text-white md:flex'>
            <BadgeIcon /> {data?.feedbacks.length ?? 0} Suggestions
          </div>
          <SortListbox selectedValue={sortValue} setSelectedValue={setSortValue} />
          <ButtonLink
            href='/feedback/new'
            replace={false}
            className='ml-auto flex items-center gap-1 rounded-md bg-purple px-6 py-3 text-2xs font-semibold text-white hover:opacity-80'
          >
            <PlusIcon />
            Add Feedback
          </ButtonLink>
        </div>
        {data && data.feedbacks.length > 0 ? (
          <ul className='mx-auto flex w-11/12 flex-col items-center gap-6 py-6 md:w-full'>
            {data.feedbacks.map((fb) => {
              return <FeedbackCard key={fb.id} feedback={fb} cardType='link' />;
            })}
          </ul>
        ) : isLoading ? (
          <div className='mx-auto flex w-11/12 flex-col items-center gap-6 py-6 md:w-full'>
            <FeedbackSkeleton />
            <FeedbackSkeleton />
            <FeedbackSkeleton />
            <FeedbackSkeleton />
            <FeedbackSkeleton />
          </div>
        ) : (
          <EmptyBoard />
        )}
      </main>
    </div>
  );
}

export default Home;

function SortListbox({
  selectedValue,
  setSelectedValue
}: {
  selectedValue: SortValues;
  setSelectedValue: (val: SortValues) => void;
}) {
  return (
    <Listbox
      value={selectedValue}
      onChange={(selected) => setSelectedValue(selected as SortValues)}
    >
      <div className=' relative '>
        <Listbox.Button className='relative flex w-full items-center gap-2 text-xs text-lightgray'>
          {({ open }) => (
            <>
              <span>Sort by:</span>
              <span className='flex items-center gap-1 font-semibold text-white'>
                {selectedValue}{" "}
                {open ? <ArrowUpIcon className='stroke-white' /> : <ArrowDownIcon />}
              </span>
            </>
          )}
        </Listbox.Button>
        <Listbox.Options className='absolute z-40 mt-4 w-[calc(100%+3rem)] divide-y-[1px] divide-gray rounded-md bg-white text-darkerblue shadow-xl '>
          {sortItems.map((item, idx) => (
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
      <p className='text-2xl font-bold text-darkerblue'>There is no feedback yet.</p>
      <p className='max-w-[45ch] text-normal text-darkgray'>
        Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to
        improve our app.
      </p>
      <ButtonLink
        href='/feedback/new'
        className='mt-6 flex items-center gap-1  bg-purple px-6 py-3 text-2xs'
        replace={false}
      >
        <PlusIcon />
        Add Feedback
      </ButtonLink>
    </div>
  );
};

type DrawerProps = {
  children:
    | ReactNode
    | ((props: { setDrawerOpen: (val: SetStateAction<boolean>) => void }) => ReactNode);
};
function Drawer({ children }: DrawerProps) {
  const [open, setOpen] = useState(false);
  const debouncedToggle = useRef(debounce(() => setOpen((prev) => !prev), 300)).current;

  return (
    <>
      <button type='button' onClick={debouncedToggle} className='md:hidden'>
        {open ? <CloseIcon /> : <HamburgerIcon />}
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10 md:hidden' onClose={setOpen}>
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
                      <Dialog.Title className='sr-only'>Filter and Roadmap</Dialog.Title>
                      <div className='space-y-6 pt-28 '>
                        {typeof children === "function"
                          ? children({ setDrawerOpen: setOpen })
                          : children}
                      </div>
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
  setDrawerOpen
}: {
  selectedValue: FilterValues;
  setSelectedValue: (val: FilterValues) => void;
  setDrawerOpen?: (val: boolean) => void;
}) => {
  return (
    <fieldset className='flex flex-wrap gap-4 '>
      {filterCategories.map((category, idx) => (
        <div key={idx} className='relative'>
          <input
            type='radio'
            id={category}
            name='category'
            value={category}
            className='peer absolute left-0 z-10 h-full w-full cursor-pointer rounded-none opacity-0 checked:pointer-events-none '
            checked={selectedValue === category}
            onChange={() => {
              setSelectedValue(category);
              setDrawerOpen && setDrawerOpen(false);
            }}
          />
          <label
            htmlFor={category}
            className='rounded-md bg-gray px-3 py-1 text-2xs font-semibold text-blue  peer-checked:bg-blue peer-checked:text-white peer-hover:bg-[#CFD7FF]  '
          >
            {formatEnum(category)}
          </label>
        </div>
      ))}
    </fieldset>
  );
};

const Roadmap = () => {
  const { data } = trpc.useQuery(["feedback.roadmapCount"]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-bold text-darkerblue'>Roadmap</h2>
        <Link href='/feedback/roadmap'>
          <a className='text-blue underline hover:no-underline'>View</a>
        </Link>
      </div>
      <ul className='flex flex-col gap-2'>
        <li className='flex items-center gap-4'>
          <div className='aspect-square w-2 rounded-full bg-[#F49F85]' />
          Planned{" "}
          <span className='ml-auto font-semibold text-darkgray'>
            {data?.roadmapItems.PLANNED ?? 0}
          </span>
        </li>
        <li className='flex items-center gap-4'>
          <div className='aspect-square w-2 rounded-full bg-purple' />
          In-Progress{" "}
          <span className='ml-auto font-semibold text-darkgray'>
            {data?.roadmapItems.IN_PROGRESS ?? 0}
          </span>
        </li>
        <li className='flex items-center gap-4'>
          <div className='aspect-square w-2 rounded-full bg-[#62BCFA]' />
          Live{" "}
          <span className='ml-auto font-semibold text-darkgray'>
            {data?.roadmapItems.LIVE ?? 0}
          </span>
        </li>
      </ul>
    </div>
  );
};

const WidgetCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={mergeClassNames(
        "mx-auto w-10/12 rounded-md bg-white p-4 md:w-full md:p-6 ",
        className
      )}
    >
      {children}
    </div>
  );
};
