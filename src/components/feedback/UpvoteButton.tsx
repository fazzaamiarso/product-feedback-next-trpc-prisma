import { Upvote } from "@prisma/client";
import { ArrowUpIcon } from "components/Icons";
import { useSession } from "next-auth/react";
import mergeClassNames from "utils/mergeClassNames";
import { trpc } from "utils/trpc";

const findUpvote = (upvotesArr: Upvote[], userId: string) => {
  return upvotesArr.find((item) => item.userId === userId);
};

type UpvoteButtonProps = {
  upvotes: Upvote[];
  upvotesCount: number;
  feedbackId: string;
  className: string;
};

const UpvoteButton = ({ upvotes, upvotesCount, feedbackId, className }: UpvoteButtonProps) => {
  const session = useSession();
  const utils = trpc.useContext();
  
  const hasUpvoted = Boolean(findUpvote(upvotes, session.data?.user.id ?? ""));

  const mutation = trpc.useMutation("feedback.upvote", {
    onSettled() {
      utils.invalidateQueries("feedback.all");
      utils.invalidateQueries("feedback.id");
      utils.invalidateQueries("feedback.roadmap");
    }
  });
  const handleUpvote = () => mutation.mutate({ feedbackId });

  return (
    <button
      type='button'
      onClick={handleUpvote}
      className={mergeClassNames(
        "rounded-md  px-4 py-1 text-2xs font-semibold  ",
        className,
        hasUpvoted ? "bg-blue text-white " : "bg-gray hover:bg-[#CFD7FF]",
        mutation.isLoading ? "opacity-75" : ""
      )}
    >
      <ArrowUpIcon className={mergeClassNames(hasUpvoted ? "stroke-white" : "stroke-blue")} />
      {upvotesCount}
    </button>
  );
};

export default UpvoteButton;
