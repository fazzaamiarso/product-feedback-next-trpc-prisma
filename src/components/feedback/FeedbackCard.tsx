import { CommentIcon } from "components/Icons";
import { SkeletonElement } from "components/SkeletonElement";
import { InferQueryOutput } from "lib/trpc";
import Link from "next/link";
import { formatEnum } from "utils/display";
import UpvoteButton from "./UpvoteButton";

type FeedbackCard = {
  feedback: InferQueryOutput<"feedback.all">["feedbacks"][number];
  cardType: "static" | "link";
};
export function FeedbackCard({ feedback, cardType }: FeedbackCard) {
  return (
    <li className='grid-rows-[repeat(2, max-content)] grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8  rounded-md bg-white py-6 px-8 md:flex md:items-center'>
      <div className='col-span-2 flex flex-col items-start space-y-2 md:order-2 md:basis-full'>
        <h4 className='text-lg font-bold text-darkerblue'>
          {cardType === "link" ? (
            <Link href={`/feedback/${feedback.id}`}>
              <a className='hover:text-blue'>{feedback.title}</a>
            </Link>
          ) : (
            feedback.title
          )}
        </h4>
        <p className='text-sm text-darkgray'>{feedback.description}</p>
        <div className='mt-2 rounded-md bg-gray px-4 py-1 text-xs font-semibold  text-blue'>
          {formatEnum(feedback.category)}
        </div>
      </div>
      <UpvoteButton
        upvotes={feedback.upvotes}
        feedbackId={feedback.id}
        upvotesCount={feedback.upvotesCount}
        className='col-start-1 flex w-16 items-center gap-2 place-self-center justify-self-start rounded-md  px-4 py-1 text-2xs font-semibold  md:order-1 md:w-10 md:flex-col md:self-start md:p-2 '
      />
      <div className=' col-start-2 flex items-center gap-2 place-self-center justify-self-end md:order-3 '>
        <CommentIcon /> {feedback.interactionsCount}
      </div>
    </li>
  );
}

export function FeedbackSkeleton() {
  return (
    <div className='grid-rows-[repeat(2, max-content)] grid w-full animate-pulse grid-cols-2 place-content-between gap-y-6 gap-x-8  rounded-md bg-white py-6 px-8 md:flex md:items-center'>
      <div className='col-span-2 flex w-full flex-col items-start space-y-2 md:order-2 md:basis-full'>
        <SkeletonElement className=' h-6 w-10/12'></SkeletonElement>
        <SkeletonElement className=' h-4'></SkeletonElement>
        <SkeletonElement className='mt-2 h-4 w-12'></SkeletonElement>
      </div>
      <SkeletonElement className='col-start-1 flex h-6 w-8 items-center gap-2 place-self-center justify-self-start   md:order-1 md:h-10 md:w-8 md:flex-col md:self-start  ' />
      <SkeletonElement className='col-start-2 flex h-6 w-8 items-center  gap-2 place-self-center justify-self-end  md:order-3 ' />
    </div>
  );
}
