type Props = {
  condition: boolean;
  wrapper: (children: React.ReactNode | React.ReactNode[]) => React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
};

export const ConditionalWrapper: React.FC<Props> = ({
  children,
  condition,
  wrapper,
}) => {
  return <>{condition ? wrapper(children) : children}</>; // fragments to make ts happy
};
