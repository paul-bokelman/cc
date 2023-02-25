export type FieldErrorMessageProps = {
  touched: boolean | undefined;
  error: string | string[] | undefined;
};

const FieldErrorMessage: React.FC<FieldErrorMessageProps> = ({
  touched,
  error,
}) => {
  if (!error || !touched) return null;

  return (
    <p className="text-sm text-red-500">
      {Array.isArray(error) ? error[0] : error}
    </p>
  );
};

export { FieldErrorMessage as FieldError };
