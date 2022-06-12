import { ArrowLeftIcon } from "components/Icons";
import Image from "next/image";
import {} from "@headlessui/react";
import { Category } from "@prisma/client";
import { ReactNode } from "react";
import { useRouter } from "next/router";

const categories = Object.values(Category);

const NewFeedback = () => {
  const router = useRouter();
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
          const data = new FormData(e.currentTarget);
          console.log(Object.fromEntries(data));
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
        <h1 className='text-2xl font-bold'>Create New Feedbak</h1>

        <InputWrapper
          id='feedback-title'
          label='feedback Title'
          description='Add a short, descriptive headline'
        >
          {({ descriptionId, id }) => (
            <input
              type='text'
              id={id}
              name='title'
              required
              aria-describedby={descriptionId}
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
            >
              {categories.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
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
              name='detail'
              aria-describedby={descriptionId}
              required
              className='w-full resize-y  rounded-md bg-lightgray'
            />
          )}
        </InputWrapper>
        <div className='flex w-full flex-col gap-4'>
          <button
            type='submit'
            className='w-full rounded-md bg-purple  px-3 py-2 text-xs font-semibold text-white'
          >
            Add Feedback
          </button>
          <button
            type='button'
            onClick={goBack}
            className='w-full rounded-md bg-darkgray px-3  py-2 text-xs font-semibold text-white'
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};
export default NewFeedback;

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
