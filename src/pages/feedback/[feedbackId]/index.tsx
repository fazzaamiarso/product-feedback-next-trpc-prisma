import { Button } from "components/Button";
import { FeedbackCard } from "components/feedback/FeedbackCard";
import GoBackButton from "components/GoBack";
import { Layout } from "components/Layout";
import { InferQueryOutput } from "lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, SetStateAction, useId, useState } from "react";
import { trpc } from "utils/trpc";

Feedback.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
Feedback.hasAuth = true;

export default function Feedback() {
  const router = useRouter();
  const { feedbackId } = router.query;

  if (!feedbackId || typeof feedbackId !== "string")
    return <div>No Feedback with Id: {feedbackId}</div>;

  return <FeedbackPage id={feedbackId} />;
}

const FeedbackPage = ({ id }: { id: string }) => {
  const { data, isLoading } = trpc.useQuery(["feedback.id", { id }]);

  return (
    <>
      <header className='mx-auto my-6 flex w-10/12 max-w-2xl items-center justify-between'>
        <GoBackButton arrowClassName='stroke-blue' textClassName='text-darkgray mt-0' />
        <Link href={`/feedback/${id}/edit`}>
          <a className='rounded-md bg-blue py-2 px-4  text-xs text-white'>Edit Feedback</a>
        </Link>
      </header>
      <main className='mx-auto mb-8 w-10/12 max-w-2xl space-y-6'>
        {data?.feedback && !isLoading ? (
          <FeedbackCard feedback={data.feedback} key={id} cardType='static' />
        ) : (
          <p>Loading Data...</p>
        )}
        <section className='rounded-md bg-white p-6'>
          <h2 className='mb-4 text-xl font-semibold'>
            {data?.feedback?.interactionsCount ?? 0} Comments
          </h2>
          <ul className=' rounded-md '>
            {data?.interactions &&
              data.interactions.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
          </ul>
        </section>
        <NewCommentForm feedbackId={id} />
      </main>
    </>
  );
};

const MAX_COMMENT_LENGTH = 250;
const NewCommentForm = ({ feedbackId }: { feedbackId: string }) => {
  const [commentInput, setCommentInput] = useState("");
  const charactersLeft = MAX_COMMENT_LENGTH - commentInput.length;
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("comment.new", {
    onSuccess() {
      utils.invalidateQueries("feedback.id");
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ content: commentInput, feedbackId, userId: "1" });
        setCommentInput("");
      }}
      className='flex  flex-col items-start space-y-6 rounded-md bg-white p-6'
    >
      <label htmlFor='add-comment' className='text-xl font-bold text-darkerblue'>
        Add Comment
      </label>
      <textarea
        name='comment'
        id='add-comment'
        rows={5}
        placeholder='Type your comment here'
        value={commentInput}
        onChange={(e) =>
          e.target.value.length > MAX_COMMENT_LENGTH ? null : setCommentInput(e.target.value)
        }
        className='w-full resize-y rounded-md bg-lightgray'
      />
      <div className='flex w-full items-center justify-between'>
        <span>{charactersLeft} characters left</span>
        <Button type='submit' className=' bg-purple '>
          Post Comment
        </Button>
      </div>
    </form>
  );
};

const ReplyForm = ({
  replyToId,
  replyFromId,
  commentId
}: {
  replyToId: string;
  replyFromId: string;
  commentId: number;
}) => {
  const uid = useId();
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("comment.reply", {
    onSuccess() {
      utils.invalidateQueries("feedback.id");
    }
  });
  return (
    <form
      className='flex w-full flex-col  items-end gap-4 py-4 md:flex-row md:items-start md:pl-12'
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const content = formData.get("content") as string;
        mutation.mutate({ repliedToId: replyToId, content, replyFromId, commentId });
      }}
    >
      <textarea
        aria-label='reply'
        name='content'
        id={`reply-${uid}`}
        rows={5}
        required
        className='w-full resize-y bg-lightgray'
      />
      <Button type='submit' className='max-w-max whitespace-nowrap  bg-purple px-5 py-2 '>
        Post Reply
      </Button>
    </form>
  );
};

type CommentCardProps = {
  comment: NonNullable<InteractionsOutput>["comments"][number];
};
const CommentCard = ({ comment }: CommentCardProps) => {
  const [isCommenting, setIsCommenting] = useState(false);

  return (
    <li className=' border-b-[1px] border-b-gray bg-white py-4 last:border-none'>
      <CardHeader
        avatar={comment.user.image ?? ""}
        username={comment.user.username}
        name={comment.user.name ?? ""}
        setReplying={setIsCommenting}
      />
      <p className='py-4 md:pl-12'>{comment.content}</p>
      <ul className='relative space-y-6 md:pl-12 '>
        {comment.replies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
      </ul>
      {isCommenting ? (
        <ReplyForm commentId={comment.id} replyFromId='1' replyToId={comment.userId} />
      ) : null}
    </li>
  );
};

type InteractionsOutput = InferQueryOutput<"feedback.id">["interactions"];
type ReplyCardProps = {
  reply: NonNullable<InteractionsOutput>["comments"][0]["replies"][0];
};
const ReplyCard = ({ reply }: ReplyCardProps) => {
  const [isReplying, setIsReplying] = useState(false);
  return (
    <li className=' space-y-4 bg-white '>
      <CardHeader
        avatar={reply.replyFrom.image ?? ""}
        username={reply.replyFrom.username}
        name={reply.replyFrom.name ?? ""}
        setReplying={setIsReplying}
      />

      <p>
        <span className='mr-1 font-bold text-purple'>@{reply.repliedTo.username}</span>
        {reply.content}
      </p>
      {isReplying ? (
        <ReplyForm
          replyToId={reply.repliedToId}
          replyFromId={reply.replyFromId}
          commentId={reply.commentId}
        />
      ) : null}
    </li>
  );
};

type CardHeaderProps = {
  avatar: string;
  name: string;
  username: string;
  setReplying: (val: SetStateAction<boolean>) => void;
  avatarSize?: number;
};
const CardHeader = ({ avatar, name, username, setReplying, avatarSize = 35 }: CardHeaderProps) => {
  return (
    <div className='flex items-center gap-4'>
      <Image
        className='rounded-full'
        src={avatar}
        alt={username}
        width={avatarSize}
        height={avatarSize}
      />
      <div className='flex flex-col items-start '>
        <h3 className='font-bold'>{name}</h3>
        <h4 className='text-sm text-darkgray'>@{username}</h4>
      </div>
      <button
        onClick={() => setReplying((prev) => !prev)}
        className='ml-auto text-xs  font-semibold text-blue hover:underline'
      >
        Reply
      </button>
    </div>
  );
};
