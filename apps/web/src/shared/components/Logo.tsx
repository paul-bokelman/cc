import Link from 'next/link';
import cn from 'classnames';
import { ClubCompassLogo } from '~/shared/components/icons';

type Props = {
  withText?: boolean;
  dest?: string;
  mobile?: boolean;
  size?: number;
  // omitLink?: boolean;
};

export const Logo: React.FC<Props> = ({
  withText = false,
  dest,
  mobile = false,
  size = 24,
}) => {
  return (
    <Link href={dest || '/'} className={cn({ 'focus:outline-none': mobile })}>
      <div
        className={cn('flex', {
          'flex-col items-start gap-6': mobile,
          'items-center gap-2': !mobile,
        })}
      >
        <ClubCompassLogo style={{ fontSize: `${size}px` }} />
        {withText && (
          <span
            className={cn({ 'text-4xl': mobile }, 'ml-2 text-lg font-semibold')}
          >
            Club Compass
          </span>
        )}
      </div>
    </Link>
  );
};
