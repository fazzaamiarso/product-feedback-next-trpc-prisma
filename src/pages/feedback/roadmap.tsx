import { Tab } from "@headlessui/react";
import { PlusIcon } from "components/Icons";
import Link from "next/link";
import { Fragment } from "react";

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
        <Tab.Panel>
          <RoadmapItem />
        </Tab.Panel>
        <Tab.Panel>
          <RoadmapItem />
        </Tab.Panel>
        <Tab.Panel>
          <RoadmapItem />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const RoadmapItem = () => {
  return (
    <section className='mx-auto w-11/12 py-8 '>
      <div className='flex flex-col items-start'>
        <h2 className='text-xl font-bold text-darkerblue'>Planned (0)</h2>
        <p className='text-darkgray'>Features currently being developed</p>
      </div>
      <ul></ul>
    </section>
  );
};
