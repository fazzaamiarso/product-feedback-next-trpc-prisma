import { ComponentPropsWithoutRef, ReactNode } from "react";
import mergeClassNames from "utils/mergeClassNames";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  className: string;
  children: ReactNode;
  type?: "button" | "submit";
}
export const Button = ({ type = "button", children, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={mergeClassNames(
        "rounded-md  px-3  py-2 text-xs font-semibold text-white",
        "hover:opacity-80",
        className
      )}
    >
      {children}
    </button>
  );
};
