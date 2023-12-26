import type { NextPage } from "next";
import { ClubCompassLogo } from "~/shared/components";
import Link from "next/link";

const Custom500: NextPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
      <ClubCompassLogo className="text-3xl mb-2" />
      <div className="text-4xl font-bold text-gray-800">500: Something went horribly wrong</div>
      <Link href="/" replace={true} prefetch={true} className="text-blue-70 hover:underline cursor-pointer">
        Go back home (hopefully...)
      </Link>
    </div>
  );
};

export default Custom500;
