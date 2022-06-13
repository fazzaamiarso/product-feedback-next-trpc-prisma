import { ReactNode } from "react";

type InputWrapperProps = {
  children: (props: { descriptionId: string; id: string }) => ReactNode;
  id: string;
  label: string;
  description: string;
};
const InputWrapper = ({ children, id, label, description }: InputWrapperProps) => {
  return (
    <div className='flex w-full flex-col items-start'>
      <label htmlFor={id} className='font-bold text-darkerblue'>
        {label}
      </label>
      <p id={`${id}-description`} className='pb-4 text-darkgray'>
        {description}
      </p>
      {children({ descriptionId: `${id}-description`, id })}
    </div>
  );
};
export default InputWrapper;
