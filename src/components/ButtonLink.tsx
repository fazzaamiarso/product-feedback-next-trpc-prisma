import Link, { LinkProps } from "next/link";
import { ComponentPropsWithRef } from "react";
import mergeClassNames from "utils/mergeClassNames";

type MyOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
type ButtonLink = Partial<MyOmit<ComponentPropsWithRef<"a">, "href">> & LinkProps;

export const ButtonLink = ({ children, className = "", href, replace = false }: ButtonLink) => {
  return (
    <Link href={href} passHref replace={replace}>
      <a
        className={mergeClassNames(
          "flex items-center gap-1 rounded-md bg-purple px-6 py-3 text-2xs font-semibold text-white hover:opacity-80",
          className
        )}
      >
        {children}
      </a>
    </Link>
  );
};
