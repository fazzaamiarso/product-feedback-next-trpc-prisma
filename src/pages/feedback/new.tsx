import Image from "next/image";
import { Category } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import InputWrapper from "components/form/InputWrapper";
import GoBackButton from "components/GoBack";
import InputSelect from "components/form/InputSelect";
import { Button } from "components/Button";
import { Controller, useForm } from "react-hook-form";
import { InferMutationInput } from "lib/trpc";
import mergeClassNames from "utils/mergeClassNames";
import { sanitizeInput } from "utils/form";

const categories = Object.values(Category);
type NewFeedbackInput = InferMutationInput<"feedback.new">;
const NewFeedback = () => {
  const {
    handleSubmit,
    register,
    control,
    clearErrors,
    formState: { errors }
  } = useForm<NewFeedbackInput>({
    defaultValues: {
      category: categories[0]
    },
    reValidateMode: "onSubmit",
    shouldFocusError: true
  });
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
        onSubmit={handleSubmit((data) => {
          if (mutation.isLoading) return;
          const sanitizedData = sanitizeInput(data);
          mutation.mutate(sanitizedData);
        })}
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
          errorMessage={errors?.title?.message}
        >
          {({ descriptionId, id }) => (
            <input
              {...register("title", {
                onChange: () => errors.title && clearErrors("title"),
                required: "Can't be empty!"
              })}
              type='text'
              id={id}
              aria-describedby={descriptionId}
              className={mergeClassNames(
                "w-full rounded-md  bg-lightgray",
                errors.title ? "ring-1 ring-red" : ""
              )}
            />
          )}
        </InputWrapper>
        <InputWrapper
          label='Category'
          id='feedback-category'
          description='Choose a category for your feedback'
          errorMessage={undefined}
        >
          {({}) => (
            <Controller
              control={control}
              name='category'
              render={({ field }) => (
                <InputSelect
                  list={categories}
                  initialValue={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </InputWrapper>
        <InputWrapper
          label='Feedback Detail'
          id='feedback-detail'
          description='Include any specific comments on what should be improved, added, etc.'
          errorMessage={errors?.description?.message}
        >
          {({ descriptionId, id }) => (
            <textarea
              {...register("description", {
                onChange: () => errors.description && clearErrors("description"),
                required: "Can't be empty!"
              })}
              id={id}
              aria-describedby={descriptionId}
              className={mergeClassNames(
                "w-full rounded-md  bg-lightgray",
                errors.description ? "ring-1 ring-red" : ""
              )}
            />
          )}
        </InputWrapper>
        <div className='flex w-full flex-col gap-4 pt-4 md:flex-row-reverse md:justify-end'>
          <Button type='submit' className='bg-purple'>
            {mutation.isLoading ? "Posting Feedback..." : "Add Feedback"}
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
