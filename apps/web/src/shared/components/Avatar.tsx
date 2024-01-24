import Image from "next/image";
import type { AuthenticatedUser } from "cc-common";
import cn from "classnames";

type Props = {
  user: AuthenticatedUser | null;
  className?: React.ComponentProps<"div">["className"];
};

export const Avatar: React.FC<Props> = ({ user, className }) => {
  return (
    <div className={cn("rounded-full", className)}>
      {user?.avatar ? (
        <Image src={user.avatar} width={48} height={48} alt="avatar" className="h-full w-full rounded-full" />
      ) : (
        <div className="flex justify-center p-2 items-center h-full w-full rounded-full bg-black-20 text-black capitalize">
          {user ? user?.username[0] : "?"}
        </div>
      )}
    </div>
  );
};
