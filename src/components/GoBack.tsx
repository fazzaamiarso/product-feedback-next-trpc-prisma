import { useRouter } from "next/router";
import mergeClassNames from "utils/mergeClassNames";
import { ArrowLeftIcon } from "./Icons";

type Props = {
  arrowClassName: string;
  textClassName: string;
};

const GoBackButton = ({ arrowClassName = "", textClassName = "" }: Props) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={mergeClassNames("mt-8 flex items-center gap-2 font-bold ", textClassName)}
    >
      <ArrowLeftIcon className={arrowClassName} /> <span className='hover:underline'>Go back</span>
    </button>
  );
};

export default GoBackButton;
