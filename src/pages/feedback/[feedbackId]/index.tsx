import { FeedbackCard } from "components/feedback/FeedbackCard";
import GoBackButton from "components/GoBack";
import { InferQueryOutput } from "lib/trpc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "utils/trpc";

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
      <header className='mx-auto my-6 flex w-10/12 items-center justify-between'>
        <GoBackButton arrowClassName='stroke-blue' textClassName='text-darkgray mt-0' />
        <Link href={`/feedback/${id}/edit`}>
          <a className='rounded-md bg-blue py-2 px-4  text-xs text-white'>Edit Feedback</a>
        </Link>
      </header>
      <main className='mx-auto mb-8 w-10/12 space-y-6'>
        {data?.feedback && !isLoading ? (
          <FeedbackCard feedback={data.feedback} key={id} />
        ) : (
          <p>Loading Data...</p>
        )}
        <section className='bg-white p-6'>
          <h2 className='mb-4 text-xl font-semibold'>
            {data?.feedback?.interactionsCount ?? 0} Comments
          </h2>
          <ul className='space-y-6  rounded-md  '>
            {data?.interactions &&
              data.interactions.comments.map((comment) => (
                <li key={comment.id} className=' space-y-4 bg-white'>
                  <div className='flex items-center gap-4'>
                    <Image
                      className='rounded-full'
                      src={comment.user.avatar ?? ""}
                      width={35}
                      alt={comment.user.username}
                      height={35}
                    />
                    <div className='flex flex-col items-start '>
                      <h3 className='font-bold'>{comment.user.name}</h3>
                      <h4 className='text-sm text-darkgray'>@{comment.user.username}</h4>
                    </div>
                    <button
                      onClick={() => {}}
                      className='ml-auto text-xs  font-semibold text-blue hover:underline'
                    >
                      Reply
                    </button>
                  </div>
                  <p>{comment.content}</p>
                  <ul className='space-y-6'>
                    {comment.replies.map((replies) => (
                      <li key={replies.id} className=' space-y-4 bg-white pl-6'>
                        <div className='flex items-center gap-4'>
                          <Image
                            className='rounded-full'
                            src={replies.replyFrom.avatar ?? ""}
                            width={35}
                            alt={replies.replyFrom.username}
                            height={35}
                          />
                          <div className='flex flex-col items-start '>
                            <h3 className='font-bold'>{replies.replyFrom.name}</h3>
                            <h4 className='text-sm text-darkgray'>@{replies.replyFrom.username}</h4>
                          </div>
                          <button
                            onClick={() => {}}
                            className='ml-auto text-xs  font-semibold text-blue hover:underline'
                          >
                            Reply
                          </button>
                        </div>
                        <p>
                          <span className='mr-1 font-bold text-purple'>
                            @{replies.repliedTo.username}
                          </span>
                          {replies.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </section>
        <NewCommentForm />
      </main>
    </>
  );
};

const MAX_COMMENT_LENGTH = 250;
const NewCommentForm = () => {
  const [commentInput, setCommentInput] = useState("");
  const charactersLeft = MAX_COMMENT_LENGTH - commentInput.length;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
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
        className='w-full resize-y rounded-md'
      />
      <div className='flex w-full items-center justify-between'>
        <span>{charactersLeft} characters left</span>
        <button type='submit' className='rounded-md bg-purple py-1 px-3 text-white'>
          Post Comment
        </button>
      </div>
    </form>
  );
};

type CommentCardProps = {
  comments: InferQueryOutput<"feedback.id">["interactions"];
};
const CommentCard = () => {
  return null;
};
