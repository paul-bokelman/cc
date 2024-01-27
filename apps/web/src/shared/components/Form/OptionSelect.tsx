import * as React from "react";
import cn from "classnames";
import { TbCheck } from "react-icons/tb";
import { FieldError } from ".";

interface OptionSelectProps {
  name: string;
  options: Array<{ value: string; description: string }>;
  selected: string;
  touched: boolean | undefined;
  errors: string | undefined;
  disabled?: boolean;
  setFieldValue: (field: string, value: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
}

export const OptionSelect: React.FC<OptionSelectProps> = ({
  name,
  options,
  selected,
  touched,
  errors,
  disabled,
  setFieldValue,
  setFieldTouched,
}) => {
  return (
    <>
      {options.map(({ value: option, description }) => {
        const isActive = selected === option;
        return (
          <div
            key={option}
            className={cn("box-border flex flex-col gap-4 rounded-lg p-6 pr-24", {
              "border border-black-20": !isActive,
              "border-[2px] border-blue-70": isActive,
              "cursor-default": isActive && disabled,
              "cursor-not-allowed": !isActive && disabled,
              "cursor-pointer": !isActive && !disabled,
            })}
            onClick={() => {
              if (!touched) setFieldTouched(name, true);
              setFieldValue(name, option);
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn("flex h-6 w-6 items-center justify-center rounded-md", {
                  "bg-black-20": !isActive,
                  "bg-blue-70": isActive,
                })}
              >
                {isActive ? <TbCheck className="stroke-[3px] text-sm text-white" /> : null}
              </div>
              <div
                className={cn("font-medium capitalize", {
                  "text-black-40": !isActive && disabled,
                })}
              >
                {option.toLowerCase()}
              </div>
            </div>
            <p
              className={cn("text-sm", {
                "text-black-70": !disabled,
                "text-black-40": !isActive && disabled,
              })}
            >
              {description}
            </p>
          </div>
        );
      })}
      <FieldError touched={touched} error={errors} />
    </>
  );
};
