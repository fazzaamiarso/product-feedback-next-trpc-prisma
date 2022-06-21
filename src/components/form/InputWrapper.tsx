import { ReactNode } from "react";

type InputWrapperProps = {
  children: (props: { descriptionId: string; id: string; errorId: string }) => ReactNode;
  id: string;
  label: string;
  description: string;
  errorMessage: string | undefined;
};
const InputWrapper = ({ children, id, label, description, errorMessage }: InputWrapperProps) => {
  return (
    <div className='flex w-full flex-col items-start'>
      <label htmlFor={id} className='font-bold text-darkerblue'>
        {label}
      </label>
      <p id={`${id}-description`} className='pb-3 text-darkgray'>
        {description}
      </p>
      {children({ descriptionId: `${id}-description`, id, errorId: `${id}-error` })}
      {errorMessage ? <span className='pt-1 pl-1 text-xs text-red'>{errorMessage}</span> : null}
    </div>
  );
};
export default InputWrapper;
