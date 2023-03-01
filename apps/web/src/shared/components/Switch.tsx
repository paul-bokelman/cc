import cn from 'classnames';

type SwitchOptionProps = {
  label: string;
  value: string;
};

export type SwitchProps = {
  state: [string, (val: any) => void];
  options: [SwitchOptionProps, SwitchOptionProps];
};

export const Switch: React.FC<SwitchProps> = ({ state, options }) => {
  const [activeOptionValue, setActiveOptionValue] = state;
  return (
    <div className="flex items-center gap-2 rounded-md border border-black-20 w-fit justify-between p-1">
      <SwitchOption
        active={activeOptionValue === options[0].value}
        setActive={() => setActiveOptionValue(options[0].value)}
        {...options[0]}
      />
      <div className="h-4 w-[1px] rounded-md bg-black-20" />
      <SwitchOption
        active={activeOptionValue === options[1].value}
        setActive={() => setActiveOptionValue(options[1].value)}
        {...options[1]}
      />
    </div>
  );
};

const SwitchOption: React.FC<SwitchOptionProps & { active: boolean; setActive: () => void }> = (option) => {
  return (
    <div
      className={cn(
        { 'bg-black-10 border-black-40': option.active },
        'py-1 px-3 rounded-md cursor-pointer border border-transparent'
      )}
      onClick={option.setActive}
    >
      <span>{option.label}</span>
    </div>
  );
};
