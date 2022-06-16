import { Upvote } from "@prisma/client";
import { CommentIcon } from "components/Icons";
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
    <li
      key={feedback.id}
      className='grid-rows-[repeat(2, max-content)] grid w-full grid-cols-2 place-content-between gap-y-6 gap-x-8  rounded-md bg-white py-6 px-8 md:flex md:items-center'
    >
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
        className='col-start-1 flex w-16 items-center gap-2 place-self-center justify-self-start rounded-md bg-gray px-4 py-1 text-2xs font-semibold hover:bg-[#CFD7FF] md:order-1 md:w-10 md:flex-col md:self-start md:p-2 '
      />
      <div className=' col-start-2 flex items-center gap-2 place-self-center justify-self-end md:order-3 '>
        <CommentIcon /> {feedback.interactionsCount}
      </div>
    </li>
  );
}
