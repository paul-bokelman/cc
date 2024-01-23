import Link from "next/link";
import cn from "classnames";
import { ClubCompassLogo } from "~/shared/components/icons";

type Props = {
  withText?: boolean;
  beta?: boolean;
  dest?: string;
  mobile?: boolean;
  size?: number;
  // omitLink?: boolean;
};

export const Logo: React.FC<Props> = ({ withText = false, beta = false, dest, mobile = false, size = 24 }) => {
  return (
    <Link href={dest || "/"} className={cn({ "focus:outline-none": mobile })}>
      <div className="flex items-center gap-2">
        <ClubCompassLogo style={{ fontSize: `${size}px` }} />
        {mobile && beta && <span className="text-xs font-bold text-gray-400">BETA</span>}
        {withText && (
          <span className={cn({ "text-4xl": mobile }, "ml-2 text-lg font-semibold")}>
            Club Compass {beta && <span className="text-xs text-gray-400">BETA</span>}
          </span>
        )}
      </div>
    </Link>
  );
};
