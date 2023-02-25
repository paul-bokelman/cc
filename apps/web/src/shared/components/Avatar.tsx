import Image from "next/image";
import cn from "classnames";

type Props = {
  src?: string | null;
  className?: React.ComponentProps<"div">["className"];
};

export const Avatar: React.FC<Props> = ({ src, className }) => {
  return (
    <div className={cn("rounded-full", className)}>
      {src ? (
        <Image
          src={src}
          width={48}
          height={48}
          alt="avatar"
          className="h-full w-full rounded-full"
        />
      ) : (
        <div className="h-full w-full rounded-full bg-gray-500" />
      )}
    </div>
  );
};
