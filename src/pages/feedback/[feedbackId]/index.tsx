import { Button } from "components/Button";
import { ButtonLink } from "components/ButtonLink";
import { CommentCard } from "components/comment/CommentCard";
import { FeedbackCard, FeedbackSkeleton } from "components/feedback/FeedbackCard";
import GoBackButton from "components/GoBack";
import { Layout } from "components/Layout";
import { SkeletonElement } from "components/SkeletonElement";
import { CommentProvider } from "context/CommentContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { sanitizeInput } from "utils/form";
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
          <ButtonLink
            href={`/feedback/${id}/edit`}
            className=' rounded-md bg-blue py-2 px-4  text-xs text-white'
            replace
          >
            Edit Feedback
          </ButtonLink>
        ) : null}
      </header>
      <main className='mx-auto mb-8 w-10/12 max-w-2xl space-y-6'>
        {data?.feedback && !isLoading ? (
          <FeedbackCard feedback={data.feedback} key={id} cardType='static' />
        ) : (
          <FeedbackSkeleton />
        )}
        <section className='rounded-md bg-white p-6'>
          {data?.feedback ? (
            <>
              <h2 className='mb-4 text-xl font-semibold'>
                {data.feedback.interactionsCount} Comments
              </h2>
              <CommentProvider>
                <ul className=' rounded-md '>
                  {data.interactions.comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </ul>
              </CommentProvider>
            </>
          ) : (
            <>
              <SkeletonElement className='mb-6 h-6 w-1/3 animate-pulse ' />
              <ul className='space-y-6 rounded-md'>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </ul>
            </>
          )}
        </section>
        <NewCommentForm feedbackId={id} />
      </main>
    </>
  );
};

const CommentSkeleton = () => {
  return (
    <div className='w-full animate-pulse bg-white '>
      <div className='mb-4 flex w-full gap-4'>
        <SkeletonElement className='h-8 w-8 rounded-full' />
        <div className='w-full'>
          <SkeletonElement className='mb-2 w-2/3 ' />
          <SkeletonElement className='h-3 w-1/3 ' />
        </div>
      </div>
      <SkeletonElement className='mb-2 h-3 w-full' />
      <SkeletonElement className='mb-2 h-3 w-full' />
      <SkeletonElement className='h-3 w-10/12 ' />
    </div>
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
      onSubmit={handleSubmit((data) => {
        const { comment } = sanitizeInput(data);
        mutation.mutate({ feedbackId, content: comment });
      })}
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






