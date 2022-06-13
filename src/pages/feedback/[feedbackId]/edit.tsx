import { ArrowLeftIcon } from "components/Icons";
import Image from "next/image";
import {} from "@headlessui/react";
import { Category, Status } from "@prisma/client";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

const categories = Object.values(Category);
const statuses = Object.values(Status);

const EditFeedback = () => {
  const router = useRouter();
  const { feedbackId } = router.query;
  const utils = trpc.useContext();
  const { data } = trpc.useQuery(["feedback.id", { id: feedbackId as string }]);
  const mutation = trpc.useMutation("feedback.edit", {
    onSuccess({ id }) {
      utils.invalidateQueries(["feedback.id"]);
      router.push(`/feedback/${id}`);
    }
  });
  const deleteMutation = trpc.useMutation("feedback.delete", {
    onSuccess() {
      utils.invalidateQueries(["feedback.all"]);
      router.push("/");
    }
  });
  const goBack = () => router.back();
  return (
    <main>
      <a onClick={goBack}>
        <ArrowLeftIcon /> Go back
      </a>
      <form
        className='relative mx-auto mt-16 w-10/12 space-y-6 rounded-md bg-white p-6 pt-8'
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const title = formData.get("title") as string;
          const category = formData.get("category") as Category;
          const status = formData.get("status") as Status;
          const description = formData.get("description") as string;
          mutation.mutate({
            feedbackId: feedbackId as string,
            status,
            title,
            description,
            category
          });
        }}
      >
        <div className='absolute top-0 z-10  -translate-y-1/2'>
          <Image
            src='/assets/shared/icon-new-feedback.svg'
            alt='new feedback'
            width={50}
            height={50}
          />
        </div>
        <h1 className='text-2xl font-bold'>{`Editing '${data?.feedback?.title}'`}</h1>

        <InputWrapper
          id='feedback-title'
          label='Feedback Title'
          description='Add a short, descriptive headline'
        >
          {({ descriptionId, id }) => (
            <input
              type='text'
              id={id}
              name='title'
              required
              aria-describedby={descriptionId}
              defaultValue={data?.feedback?.title ?? ""}
              className='w-full rounded-md bg-lightgray'
            />
          )}
        </InputWrapper>
        <InputWrapper
          label='Category'
          id='feedback-category'
          description='Choose a category for your feedback'
        >
          {({ descriptionId, id }) => (
            <select
              name='category'
              id={id}
              aria-describedby={descriptionId}
              className='w-full rounded-md bg-lightgray'
              defaultValue={data?.feedback?.category}
            >
              {categories.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </InputWrapper>
        <InputWrapper label='Update Status' id='feedback-status' description='Change feature state'>
          {({ descriptionId, id }) => (
            <select
              name='status'
              id={id}
              aria-describedby={descriptionId}
              className='w-full rounded-md bg-lightgray'
              defaultValue={data?.feedback?.status}
            >
              {statuses.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </InputWrapper>
        <InputWrapper
          label='Feedback Detail'
          id='feedback-detail'
          description='Include any specific comments on what should be improved, added, etc.'
        >
          {({ descriptionId, id }) => (
            <textarea
              id={id}
              name='description'
              aria-describedby={descriptionId}
              required
              defaultValue={data?.feedback?.description ?? ""}
              className='w-full resize-y  rounded-md bg-lightgray'
            />
          )}
        </InputWrapper>
        <div className='flex w-full flex-col gap-4'>
          <button
            type='submit'
            className='w-full rounded-md bg-purple  px-3 py-2 text-xs font-semibold text-white'
          >
            Save Changes
          </button>
          <button
            type='button'
            onClick={goBack}
            className='w-full rounded-md bg-darkgray px-3  py-2 text-xs font-semibold text-white'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={() => deleteMutation.mutate({ feedbackId: feedbackId as string })}
            className='w-full rounded-md bg-[#D73737] px-3  py-2 text-xs font-semibold text-white'
          >
            Delete
          </button>
        </div>
      </form>
    </main>
  );
};
export default EditFeedback;

type InputWrapperProps = {
  children: (props: { descriptionId: string; id: string }) => ReactNode;
  id: string;
  label: string;
  description: string;
};
const InputWrapper = ({ children, id, label, description }: InputWrapperProps) => {
  return (
    <div className='flex w-full flex-col items-start'>
      <label htmlFor={id}>{label}</label>
      <p id={`${id}-description`} className='pb-4 text-darkgray'>
        {description}
      </p>
      {children({ descriptionId: `${id}-description`, id })}
    </div>
  );
};
