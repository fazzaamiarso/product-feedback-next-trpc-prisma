import { Tab } from "@headlessui/react";
import { ArrowLeftIcon, ArrowUpIcon, CommentIcon, PlusIcon } from "components/Icons";
import Link from "next/link";
import { Fragment } from "react";
import { trpc } from "utils/trpc";

const ROADMAPS_ITEMS = [
  {
    title: "Planned",
    value: "PLANNED" as const,
    description: "Ideas prioritized for research",
    color: "#F49F85"
  },
  {
    title: "In-Progress",
    value: "IN_PROGRESS" as const,
    description: "Features currently being developed",
    color: "#AD1FEA"
  },
  {
    title: "Live",
    value: "LIVE" as const,
    description: "Released Features",
    color: "#62BCFA"
  }
];

const Roadmaps = () => {
  return (
    <>
      <header className='mx-auto flex w-full max-w-5xl items-center bg-darkerblue p-4 lg:rounded-md lg:p-6'>
        <div className='flex flex-col items-start text-white'>
          <Link href='/'>
            <a className='flex items-center gap-4'>
              <ArrowLeftIcon /> Go Back
            </a>
          </Link>
          <h1 className='text-2xl font-bold'>Roadmap</h1>
        </div>
        <Link href='/feedback/new'>
          <a className='ml-auto flex items-center gap-1 rounded-md bg-purple px-6 py-3 text-2xs font-semibold text-white hover:opacity-80'>
            <PlusIcon />
            Add Feedback
          </a>
        </Link>
      </header>
      <main className='mx-auto max-w-5xl'>
        <CategoryTabs />
        <div className='hidden grid-cols-3 md:grid '>
          {ROADMAPS_ITEMS.map((item) => {
            return <RoadmapItem key={item.value} {...item} />;
          })}
        </div>
      </main>
    </>
  );
};

export default Roadmaps;

const CategoryTabs = () => {
  const { data, isLoading } = trpc.useQuery(["feedback.roadmapCount"]);

  return (
    <Tab.Group as='div' defaultIndex={0} className='md:hidden'>
      <Tab.List className='flex w-full  justify-evenly border-b-[1px] border-b-darkgray     '>
        {ROADMAPS_ITEMS.map((item) => {
          return (
            <Tab key={item.description} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`basis-full  py-4 font-semibold text-darkerblue opacity-50 ${
                    selected ? "opacity-100" : ""
                  }`}
                >
                  {item.title} ({data?.roadmapItems[item.value] ?? 0})
                </button>
              )}
            </Tab>
          );
        })}
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

const RoadmapItem = ({ title, description, value, color }: typeof ROADMAPS_ITEMS[number]) => {
  const { data, isLoading } = trpc.useQuery(["feedback.roadmap", value]);

  return (
    <section className='mx-auto w-11/12 py-8 '>
      <div className='flex flex-col items-start'>
        <h2 className='text-xl font-bold text-darkerblue'>
          {title} ({data?.roadmaps.length ?? 0})
        </h2>
        <p className='text-darkgray'>{description}</p>
      </div>
      {isLoading ? (
        <p>Loading your data..</p>
      ) : data && data.roadmaps.length > 0 ? (
        <ul className='space-y-6 py-6'>
          {data.roadmaps.map((item) => {
            return (
              <li
                key={item.id}
                className='grid-rows-[repeat(2, max-content)]  grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8 rounded-md   border-t-8 bg-white p-6'
                style={{ borderTopColor: color }}
              >
                <div className='col-span-2 flex flex-col items-start space-y-2  '>
                  <div className='flex items-center gap-4'>
                    <div className='aspect-square w-2 rounded-full' style={{ background: color }} />
                    {title}
                  </div>
                  <h4 className='text-lg font-bold text-darkerblue'>
                    <Link href='#'>
                      <a className='hover:text-blue'>{item.title}</a>
                    </Link>
                  </h4>
                  <p className='text-sm text-darkgray'>{item.description}</p>
                  <span className='rounded-md bg-gray px-4 py-1 text-xs  text-blue'>
                    {item.category.toLowerCase()}
                  </span>
                </div>
                <button className='col-start-1 flex items-center gap-2 place-self-center justify-self-start rounded-md bg-gray px-4 py-1 text-2xs font-semibold hover:bg-[#CFD7FF]  '>
                  <ArrowUpIcon /> {item.upvotesCount}
                </button>
                <div className=' col-start-2 flex items-center gap-2 place-self-center justify-self-end '>
                  <CommentIcon /> {item.interactionsCount}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No Feedback yet</p>
      )}
    </section>
  );
};
