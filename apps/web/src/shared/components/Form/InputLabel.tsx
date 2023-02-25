import type { Children } from '~/shared/types';
import cn from 'classnames';

type Props = {
  value: string;
  edited?: boolean;
  required?: boolean; //! NOT IMPLEMENTED
  omitFullWidth?: boolean;
  children: Children;
};

export const InputLabel: React.FC<Props> = (props) => {
  return (
    <div
      className={cn('flex flex-col gap-2', { 'w-full': !props.omitFullWidth })}
    >
      <label className="flex items-center justify-between">
        <span className="text-sm text-black">
          {props.value}{' '}
          {props.required ? (
            <span className="text-xs text-red-500">*</span>
          ) : null}
        </span>{' '}
        {props.edited ? (
          <span className="text-xs text-[#FFAA47]">EDITED</span>
        ) : null}
      </label>
      {props.children}
    </div>
  );
};
