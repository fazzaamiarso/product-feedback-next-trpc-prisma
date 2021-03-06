import { Listbox } from "@headlessui/react";
import { ArrowUpIcon, CheckIcon } from "components/Icons";
import { useState } from "react";
import { formatEnum } from "utils/display";
import mergeClassNames from "utils/mergeClassNames";

type InputSelectProps = {
  list: string[];
  onChange: (val: string) => void;
  initialValue?: string;
};
function InputSelect({ list, initialValue, onChange }: InputSelectProps) {
  const [selectedValue, setSelectedValue] = useState(initialValue ?? list[0]);

  return (
    <Listbox
      value={selectedValue}
      onChange={(val) => {
        setSelectedValue(val);
        onChange(val);
      }}
    >
      <div className='group relative w-full'>
        <Listbox.Button className='relative  w-full gap-2 rounded-md bg-lightgray py-3 px-4 group-focus-within:ring-1 group-focus-within:ring-blue   '>
          {({ open }) => (
            <span className='flex w-full items-center justify-between gap-1  text-darkerblue'>
              {formatEnum(selectedValue)}
              <ArrowUpIcon
                className={mergeClassNames("stroke-darkerblue", open ? "rotate-0" : "rotate-180")}
              />
            </span>
          )}
        </Listbox.Button>
        <Listbox.Options className='absolute z-40 mt-4 w-full divide-y-[1px] divide-gray rounded-md bg-white text-darkerblue shadow-xl '>
          {list.map((value, idx) => {
            return (
              <Listbox.Option
                key={idx}
                value={value}
                className='flex cursor-pointer items-center justify-between px-4 py-2'
              >
                {({ active, selected }) => (
                  <>
                    <span className={active ? " text-purple" : ""}>{formatEnum(value)}</span>
                    {selected && <CheckIcon />}
                  </>
                )}
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
export default InputSelect;
