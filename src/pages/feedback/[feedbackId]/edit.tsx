import Image from "next/image";
import {} from "@headlessui/react";
import { Category, Status } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import InputWrapper from "components/form/InputWrapper";
import GoBackButton from "components/GoBack";
import InputSelect from "components/form/InputSelect";
import { Button } from "components/Button";

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
      router.replace(`/feedback/${id}`);
    }
  });
  const deleteMutation = trpc.useMutation("feedback.delete", {
    onSuccess() {
      utils.invalidateQueries(["feedback.all"]);
      router.replace("/");
    }
  });
  const goBack = () => router.back();
  return (
    <main className='mx-auto my-12 w-10/12 max-w-lg'>
      <GoBackButton arrowClassName='stroke-blue' textClassName='text-darkgray' />
      <form
        className='relative mt-16 w-full space-y-6 rounded-md bg-white p-6 pt-8'
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
            src='/assets/shared/icon-edit-feedback.svg'
            alt='edit feedback'
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
              className='w-full rounded-md  bg-lightgray '
            />
          )}
        </InputWrapper>
        <InputWrapper
          label='Category'
          id='feedback-category'
          description='Choose a category for your feedback'
        >
          {({ descriptionId, id }) => (
            <InputSelect
              list={categories}
              name='category'
              initialValue={data?.feedback?.category ?? undefined}
            />
          )}
        </InputWrapper>
        <InputWrapper label='Update Status' id='feedback-status' description='Change feature state'>
          {({ descriptionId, id }) => (
            <InputSelect
              list={statuses}
              name='status'
              initialValue={data?.feedback?.status ?? undefined}
            />
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
              className='w-full resize-y  rounded-md '
            />
          )}
        </InputWrapper>
        <div className='flex w-full flex-col gap-4 pt-4 md:flex-row-reverse '>
          <Button className=' bg-purple   '>Save Changes</Button>
          <Button onClick={goBack} className=' bg-darkgray  '>
            Cancel
          </Button>
          <Button
            onClick={() => deleteMutation.mutate({ feedbackId: feedbackId as string })}
            className=' bg-[#D73737]  md:mr-auto '
          >
            {deleteMutation.isLoading ? "Deleting" : "Delete"}
          </Button>
        </div>
      </form>
    </main>
  );
};
export default EditFeedback;
