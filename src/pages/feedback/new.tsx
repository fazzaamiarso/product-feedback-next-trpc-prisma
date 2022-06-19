import Image from "next/image";
import { Category } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import InputWrapper from "components/form/InputWrapper";
import GoBackButton from "components/GoBack";
import InputSelect from "components/form/InputSelect";
import { Button } from "components/Button";

const categories = Object.values(Category);

const NewFeedback = () => {
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("feedback.new", {
    onSuccess() {
      utils.invalidateQueries(["feedback.all"]);
      router.push("/");
    }
  });
  const router = useRouter();
  const goBack = () => router.back();
  return (
    <main className='mx-auto my-12 w-10/12 max-w-lg'>
      <GoBackButton arrowClassName='stroke-blue' textClassName='text-darkgray' />
      <form
        className='relative  mt-16 w-full  space-y-6 rounded-md bg-white p-6 pt-8'
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const title = formData.get("title") as string;
          const category = formData.get("category") as Category;
          const description = formData.get("description") as string;
          mutation.mutate({
            userId: "1",
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
        <h1 className='text-2xl font-bold text-darkerblue'>Create New Feedbak</h1>
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
              className='w-full rounded-md  bg-lightgray '
            />
          )}
        </InputWrapper>
        <InputWrapper
          label='Category'
          id='feedback-category'
          description='Choose a category for your feedback'
        >
          {({ descriptionId, id }) => <InputSelect list={categories} name='category' />}
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
              className='w-full resize-y  rounded-md  bg-lightgray '
            />
          )}
        </InputWrapper>
        <div className='flex w-full flex-col gap-4 pt-4 md:flex-row-reverse md:justify-end'>
          <Button type='submit' className='bg-purple'>
            Add Feedback
          </Button>
          <Button onClick={goBack} className='bg-darkgray '>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
};
export default NewFeedback;
NewFeedback.hasAuth = true;
