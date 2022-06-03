import { Tab } from "@headlessui/react";
import { PlusIcon } from "components/Icons";
import Link from "next/link";
import { Fragment } from "react";
import { trpc } from "utils/trpc";

const ROADMAPS_ITEMS = [
  {
    title: "Planned",
    value: "PLANNED" as const,
    description: "Ideas prioritized for research",
  },
  {
    title: "In-Progress",
    value: "IN_PROGRESS" as const,
    description: "Features currently being developed",
  },
  { title: "Live", value: "LIVE" as const, description: "Released Features" },
];

const Roadmaps = () => {
  return (
    <>
      <header className='flex w-full items-center bg-darkerblue p-4'>
        <div className='flex flex-col items-start text-white'>
          <Link href='/'>
            <a>Go Back</a>
          </Link>
          <h1 className='text-xl font-bold'>Roadmap</h1>
        </div>
        <Link href='/feedback/new'>
          <a className='ml-auto flex items-center gap-1 rounded-md bg-purple px-6 py-3 text-2xs font-semibold text-white hover:opacity-80'>
            <PlusIcon />
            Add Feedback
          </a>
        </Link>
      </header>
      <main>
        <CategoryTabs />
      </main>
    </>
  );
};

export default Roadmaps;

const CategoryTabs = () => {
  return (
    <Tab.Group as='div' defaultIndex={0} className='md:hidden'>
      <Tab.List className='flex w-full  justify-evenly border-b-[1px] border-b-darkgray     '>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`basis-full  py-4 font-semibold text-darkerblue opacity-50 ${
                selected ? "opacity-100" : ""
              }`}
            >
              Planned (0)
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`basis-full  py-4 font-semibold text-darkerblue opacity-50  ${
                selected ? "opacity-100" : ""
              }`}
            >
              In-Progress (0){" "}
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`basis-full py-4  font-semibold text-darkerblue opacity-50  ${
                selected ? "opacity-100" : ""
              }`}
            >
              Live (0)
            </button>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        {ROADMAPS_ITEMS.map((item) => {
          return (
            <Tab.Panel key={item.value}>
              <RoadmapItem {...item} />
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
};

const RoadmapItem = ({
  title,
  description,
  value,
}: typeof ROADMAPS_ITEMS[number]) => {
  const { data, isLoading } = trpc.useQuery(["feedback.roadmapItem", value]);

  return (
    <section className='mx-auto w-11/12 py-8 '>
      <div className='flex flex-col items-start'>
        <h2 className='text-xl font-bold text-darkerblue'>{title} (0)</h2>
        <p className='text-darkgray'>{description}</p>
      </div>
      {isLoading ? (
        <p>Loading your data..</p>
      ) : data && data.roadmaps.length > 0 ? (
        <ul>
          {data.roadmaps.map((item) => {
            return <li key={item.id}>{JSON.stringify(item, null, 2)}</li>;
          })}
        </ul>
      ) : (
        <p>No Feedback yet</p>
      )}
    </section>
  );
};
