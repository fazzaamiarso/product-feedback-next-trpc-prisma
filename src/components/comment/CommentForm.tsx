import { Button } from "components/Button";
import { InferMutationInput } from "lib/trpc";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { sanitizeInput } from "utils/form";
import { trpc } from "utils/trpc";

export const ReplyForm = ({
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
      onSubmit={handleSubmit((data) => {
        const { content } = sanitizeInput(data);
        mutation.mutate({ content, commentId, repliedToId: replyToId });
      })}
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
