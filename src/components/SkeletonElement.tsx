import mergeClassNames from "utils/mergeClassNames";

export const SkeletonElement = ({ className }: { className: string }) => {
  return <div className={mergeClassNames("h-4 w-full rounded-md bg-darkgray", className)}></div>;
};
