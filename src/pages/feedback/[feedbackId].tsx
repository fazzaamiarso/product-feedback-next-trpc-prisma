import Link from "next/link";
import { useRouter } from "next/router";
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
    <main>
      <Link href='/'>
        <a className='underline'>Go back</a>
      </Link>
      <h1 className='font-bold'>Feedback {id}</h1>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  );
};
