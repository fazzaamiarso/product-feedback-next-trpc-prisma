import { Tab } from "@headlessui/react";
import UpvoteButton from "components/feedback/UpvoteButton";
import GoBackButton from "components/GoBack";
import { CommentIcon, PlusIcon } from "components/Icons";
import { SkeletonElement } from "components/SkeletonElement";
import Link from "next/link";
import { Fragment } from "react";
import { formatEnum } from "utils/display";
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
      <header className='mx-auto flex w-full max-w-5xl items-center bg-darkerblue p-4 lg:mt-12 lg:rounded-md lg:p-6'>
        <div className='flex flex-col items-start text-white'>
          <GoBackButton arrowClassName='stroke-white' textClassName='text-white mt-0' />
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
Roadmaps.hasAuth = true;

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
                  className={`relative basis-full  py-4 font-semibold text-darkerblue opacity-50 ${
                    selected ? "opacity-100" : ""
                  }`}
                >
                  {item.title} ({data?.roadmapItems[item.value] ?? 0})
                  {selected && <span className='absolute bottom-0 left-0 h-1 w-full bg-purple' />}
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
        <div className='space-y-6 py-6'>
          <RoadmapItemSkeleton />
          <RoadmapItemSkeleton />
          <RoadmapItemSkeleton />
        </div>
      ) : data && data.roadmaps.length > 0 ? (
        <ul className='space-y-6 py-6'>
          {data.roadmaps.map((item) => {
            return (
              <li
                key={item.id}
                className='grid-rows-[repeat(2, max-content)]  grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8 rounded-md   border-t-4 bg-white p-6'
                style={{ borderTopColor: color }}
              >
                <div className='col-span-2 flex flex-col items-start space-y-2  '>
                  <div className='flex items-center gap-4 text-darkgray'>
                    <div className='aspect-square w-2 rounded-full' style={{ background: color }} />
                    {title}
                  </div>
                  <h4 className='text-lg font-bold text-darkerblue'>
                    <Link href={`/feedback/${item.id}`}>
                      <a className='hover:text-blue'>{item.title}</a>
                    </Link>
                  </h4>
                  <p className='text-sm text-darkgray'>{item.description}</p>
                  <div className='mt-2 rounded-md bg-gray px-4 py-1 text-xs font-semibold  text-blue'>
                    {formatEnum(item.category)}
                  </div>
                </div>
                <UpvoteButton
                  upvotes={item.upvotes}
                  feedbackId={item.id}
                  upvotesCount={item.upvotesCount}
                  className='col-start-1 flex items-center gap-2 place-self-center justify-self-start rounded-md  px-4 py-2 text-2xs font-semibold'
                />

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

const RoadmapItemSkeleton = () => {
  return (
    <div className='grid-rows-[repeat(2, max-content)]  grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8 rounded-md border-t-4  border-t-gray bg-white p-6'>
      <div className='col-span-2 flex flex-col items-start space-y-2  '>
        <SkeletonElement className='w-1/3' />
        <SkeletonElement className='h-6 w-10/12' />
        <SkeletonElement className=' ' />
        <SkeletonElement className='h-5 w-6' />
      </div>
      <SkeletonElement className='col-start-1   h-6 w-8   place-self-center justify-self-start' />
      <SkeletonElement className=' col-start-2 h-6 w-8  place-self-center justify-self-end ' />
    </div>
  );
};
