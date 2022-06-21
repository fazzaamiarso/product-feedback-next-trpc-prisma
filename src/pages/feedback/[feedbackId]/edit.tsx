import Image from "next/image";
import { Category, Status } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import InputWrapper from "components/form/InputWrapper";
import GoBackButton from "components/GoBack";
import InputSelect from "components/form/InputSelect";
import { Button } from "components/Button";
import { Controller, useForm } from "react-hook-form";
import type { InferMutationInput } from "lib/trpc";
import mergeClassNames from "utils/mergeClassNames";

const categories = Object.values(Category);
const statuses = Object.values(Status);

type EditFeedbackInput = InferMutationInput<"feedback.edit">;
const EditFeedback = () => {
  const router = useRouter();
  const { feedbackId } = router.query;
  const utils = trpc.useContext();
  const { data } = trpc.useQuery(["feedback.id", { id: feedbackId as string }]);
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors }
  } = useForm<EditFeedbackInput>({
    defaultValues: {
      description: data?.feedback?.description ?? "",
      title: data?.feedback?.title ?? "",
      feedbackId: data?.feedback?.id ?? "",
      category: data?.feedback?.category ?? categories[0],
      status: data?.feedback?.status ?? statuses[0]
    },
    shouldFocusError: true
  });

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
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
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
        <input type='text' hidden {...register("feedbackId")} />
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
              defaultValue={data?.feedback?.title ?? ""}
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
          label='Update Status'
          id='feedback-status'
          description='Change feature state'
          errorMessage={undefined}
        >
          {({}) => (
            <Controller
              control={control}
              name='status'
              render={({ field }) => (
                <InputSelect list={statuses} initialValue={field.value} onChange={field.onChange} />
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
              defaultValue={data?.feedback?.description ?? ""}
              className={mergeClassNames(
                "w-full rounded-md  bg-lightgray",
                errors.description ? "ring-1 ring-red" : ""
              )}
            />
          )}
        </InputWrapper>
        <div className='flex w-full flex-col gap-4 pt-4 md:flex-row-reverse '>
          <Button className=' bg-purple' type='submit'>
            Save Changes
          </Button>
          <Button onClick={goBack} className=' bg-darkgray  '>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(({ feedbackId }) => deleteMutation.mutate({ feedbackId }))}
            className='bg-red  md:mr-auto '
          >
            {deleteMutation.isLoading ? "Deleting" : "Delete"}
          </Button>
        </div>
      </form>
    </main>
  );
};
export default EditFeedback;
EditFeedback.hasAuth = true;
