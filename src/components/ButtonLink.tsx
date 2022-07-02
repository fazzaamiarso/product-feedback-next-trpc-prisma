import Link, { LinkProps } from "next/link";
import { ComponentPropsWithRef, ReactNode } from "react";

type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
type ButtonLink = MyOmit<ComponentPropsWithRef<"a">, "href"> & LinkProps;

type Props = {
  children: ReactNode;
};
export const ButtonLink = ({ href, children }: ButtonLink) => {
  return (
    <Link href={href} passHref>
      <a>{children}</a>
    </Link>
  );
};
