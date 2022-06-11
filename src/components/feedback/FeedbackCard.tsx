import { ArrowUpIcon, CommentIcon } from "components/Icons";
import { InferQueryOutput } from "lib/trpc";
import Link from "next/link";
import { capitalize } from "utils/display";

type FeedbackCard = {
  feedback: InferQueryOutput<"feedback.all">["feedbacks"][number];
};
export function FeedbackCard({ feedback }: FeedbackCard) {
  return (
    <li
      key={feedback.id}
      className='grid-rows-[repeat(2, max-content)] grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8  rounded-md bg-white p-6 md:flex md:items-center'
    >
      <div className='col-span-2 flex flex-col items-start space-y-2 md:order-2 md:basis-full'>
        <h4 className='text-lg font-bold text-darkerblue'>
          <Link href={`/feedback/${feedback.id}`} prefetch>
            <a className='hover:text-blue'>{feedback.title}</a>
          </Link>
        </h4>
        <p className='text-sm text-darkgray'>{feedback.description}</p>
        <span className='rounded-md bg-gray px-4 py-1 text-xs font-semibold  text-blue'>
          {capitalize(feedback.category.toLowerCase())}
        </span>
      </div>
      <button className='col-start-1 flex items-center gap-2 place-self-center justify-self-start rounded-md bg-gray px-4 py-1 text-2xs font-semibold hover:bg-[#CFD7FF] md:order-1  md:flex-col md:self-start md:p-2 '>
        <ArrowUpIcon /> {feedback.upvotesCount}
      </button>
      <div className=' col-start-2 flex items-center gap-2 place-self-center justify-self-end md:order-3 '>
        <CommentIcon /> {feedback.interactionsCount}
      </div>
    </li>
  );
}
