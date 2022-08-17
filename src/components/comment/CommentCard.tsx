import { useComment } from "context/CommentContext";
import { InferQueryOutput } from "lib/trpc";
import { useId } from "react";
import { ReplyForm } from "./CommentForm";
import Image from "next/image";

type CommentCardProps = {
  comment: NonNullable<InteractionsOutput>["comments"][number];
};
export const CommentCard = ({ comment }: CommentCardProps) => {
  const uid = useId();
  const { updateOpenReplyId, openReplyId } = useComment();
  const handleOpenComment = () => {
    updateOpenReplyId(uid);
  };
  const isCommenting = openReplyId === uid;
  return (
    <li className=' border-b-[1px] border-b-gray bg-white py-4 last:border-none'>
      <CardHeader
        avatar={comment.user.image ?? ""}
        username={comment.user.username ?? ""}
        name={comment.user.name ?? ""}
        setReplying={handleOpenComment}
      />
      <p className='py-4 md:pl-12'>{comment.content}</p>
      <ul className='relative space-y-6 md:pl-12 '>
        {comment.replies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
      </ul>
      {isCommenting ? (
        <ReplyForm commentId={comment.id} replyToId={comment.userId} onDone={handleOpenComment} />
      ) : null}
    </li>
  );
};

type InteractionsOutput = InferQueryOutput<"feedback.id">["interactions"];
type ReplyCardProps = {
  reply: NonNullable<InteractionsOutput>["comments"][0]["replies"][0];
};
export const ReplyCard = ({ reply }: ReplyCardProps) => {
  const uid = useId();
  const { updateOpenReplyId, openReplyId } = useComment();
  const handleOpenComment = () => {
    updateOpenReplyId(uid);
  };
  const isReplying = openReplyId === uid;
  return (
    <li className=' space-y-4 bg-white '>
      <CardHeader
        avatar={reply.replyFrom.image ?? ""}
        username={reply.replyFrom.username ?? ""}
        name={reply.replyFrom.name ?? ""}
        setReplying={handleOpenComment}
      />
      <p>
        <span className='mr-1 font-bold text-purple'>@{reply.repliedTo.username}</span>
        {reply.content}
      </p>
      {isReplying ? (
        <ReplyForm
          replyToId={reply.repliedToId}
          commentId={reply.commentId}
          onDone={handleOpenComment}
        />
      ) : null}
    </li>
  );
};

type CardHeaderProps = {
  avatar: string;
  name: string;
  username: string;
  setReplying: () => void;
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
        onClick={() => setReplying()}
        className='ml-auto text-xs  font-semibold text-blue hover:underline'
      >
        Reply
      </button>
    </div>
  );
};
