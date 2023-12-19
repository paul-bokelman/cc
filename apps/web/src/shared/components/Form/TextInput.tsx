import type { FieldProps } from "formik";
import type { IconType } from "react-icons";
import { useField } from "formik";
import cn from "classnames";
import { FieldError } from ".";

type Props = { textArea?: boolean; accessory?: string | IconType } & FieldProps;

export const TextInput: React.FC<Props> = ({
  textArea,
  accessory: Accessory,
  field,
  form, // unused but needs to be extracted
  ...props
}) => {
  const [_, { error, touched }] = useField(field.name);

  const textInputClasses = cn(
    "w-full rounded-lg border border-black-20 bg-secondary px-4 outline-none focus:ring-2 focus:ring-blue-20 focus:border-blue-70",
    {
      "h-12": !textArea,
      "h-32 py-3": textArea,
      "ring-2 ring-red-20 border-red-50": error && touched,
    }
  );

  const accessoryIsString = Accessory && typeof Accessory === "string";

  return (
    <div className="flex flex-col gap-2">
      {textArea ? (
        <textarea {...field} {...props} className={textInputClasses} />
      ) : (
        <div className="flex w-full items-center">
          {Accessory ? (
            <div
              style={{ borderRadius: "0.5rem 0 0 0.5rem" }}
              className="flex h-full w-fit items-center justify-center border border-r-0 bg-gray-50 px-3 "
            >
              <span
                className={cn(
                  {
                    "text-sm": accessoryIsString,
                    "text-lg": !accessoryIsString,
                  },
                  "whitespace-nowrap text-black"
                )}
              >
                {!accessoryIsString ? <Accessory /> : Accessory}
              </span>
            </div>
          ) : null}
          <input
            style={{
              borderRadius: Accessory ? "0 0.5rem 0.5rem 0" : undefined,
            }}
            {...field}
            {...props}
            className={textInputClasses}
          />
        </div>
      )}
      <FieldError touched={touched} error={error} />
    </div>
  );
};
