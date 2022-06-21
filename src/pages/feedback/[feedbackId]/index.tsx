import { Button } from "components/Button";
import { FeedbackCard } from "components/feedback/FeedbackCard";
import GoBackButton from "components/GoBack";
import { Layout } from "components/Layout";
import { InferMutationInput, InferQueryOutput } from "lib/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, SetStateAction, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import mergeClassNames from "utils/mergeClassNames";
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
  const session = useSession();
  const { data, isLoading } = trpc.useQuery(["feedback.id", { id }]);
  const isFeedbackAuthor = session.data?.user.id === data?.feedback?.userId;

  return (
    <>
      <header className='mx-auto my-6 flex w-10/12 max-w-2xl items-center justify-between'>
        <GoBackButton arrowClassName='stroke-blue' textClassName='text-darkgray mt-0' />
        {isFeedbackAuthor ? (
          <Link href={`/feedback/${id}/edit`}>
            <a className='rounded-md bg-blue py-2 px-4  text-xs text-white'>Edit Feedback</a>
          </Link>
        ) : null}
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
  const { control, handleSubmit, clearErrors, reset } = useForm<{ comment: string }>({
    reValidateMode: "onSubmit"
  });
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("comment.new", {
    onSuccess: () => {
      utils.invalidateQueries("feedback.id");
      reset();
    }
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate({ feedbackId, content: data.comment }))}
      className='flex  flex-col items-start rounded-md bg-white p-6'
    >
      <label htmlFor='add-comment' className='mb-4 text-xl font-bold text-darkerblue'>
        Add Comment
      </label>
      <Controller
        name='comment'
        control={control}
        defaultValue=''
        rules={{ required: "Can't be empty!", maxLength: MAX_COMMENT_LENGTH }}
        render={({ field, formState: { errors } }) => {
          const charactersLeft = MAX_COMMENT_LENGTH - field.value.length;

          return (
            <>
              <textarea
                id='add-comment'
                rows={5}
                placeholder='Type your comment here'
                value={field.value}
                onChange={(e) => {
                  errors.comment && clearErrors("comment");
                  e.target.value.length <= MAX_COMMENT_LENGTH && field.onChange(e.target.value);
                }}
                className={mergeClassNames(
                  "w-full bg-lightgray",
                  errors.comment ? "ring-1 ring-red" : ""
                )}
              />
              {errors.comment ? (
                <span className='pl-2 pt-1 text-xs text-red'>{errors.comment.message}</span>
              ) : null}
              <div className='mt-4 flex w-full items-center justify-between'>
                <span>{charactersLeft} characters left</span>
                <Button type='submit' className='bg-purple '>
                  {mutation.isLoading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </>
          );
        }}
      />
    </form>
  );
};

const ReplyForm = ({
  replyToId,
  commentId,
  onDone
}: {
  replyToId: string;
  commentId: number;
  onDone?: () => void;
}) => {
  const { register, handleSubmit } = useForm<InferMutationInput<"comment.reply">>();
  const uid = useId();
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("comment.reply", {
    onSuccess: () => {
      utils.invalidateQueries("feedback.id");
      onDone && onDone();
    }
  });
  return (
    <form
      className='flex w-full flex-col  items-end gap-4 py-4 md:flex-row md:items-start md:pl-12'
      onBlur={() => onDone && onDone()}
      onSubmit={handleSubmit(({ content }) =>
        mutation.mutate({ content, commentId, repliedToId: replyToId })
      )}
    >
      <textarea
        {...register("content")}
        aria-label='reply'
        id={`reply-${uid}`}
        rows={5}
        required
        className='w-full resize-y bg-lightgray'
      />
      <Button type='submit' className='max-w-max whitespace-nowrap  bg-purple px-5 py-2 '>
        {mutation.isLoading ? "Posting" : "Post Reply"}
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
        username={comment.user.username ?? ""}
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
        <ReplyForm
          commentId={comment.id}
          replyToId={comment.userId}
          onDone={() => setIsCommenting(false)}
        />
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
        username={reply.replyFrom.username ?? ""}
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
          commentId={reply.commentId}
          onDone={() => setIsReplying(false)}
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
