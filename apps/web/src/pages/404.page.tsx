import type { NextPageWithConfig } from "~/shared/types";
import { ClubCompassLogo } from "~/shared/components";
import Link from "next/link";

const Custom404: NextPageWithConfig = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <ClubCompassLogo className="text-3xl mb-2" />
      <div className="text-4xl font-bold text-gray-800">404: Page not found</div>
      <Link href="/" className="font-semibold text-blue-70 hover:underline cursor-pointer">
        Go back home
      </Link>
    </div>
  );
};

Custom404.layout = {
  view: "standard",
  config: {},
};

export default Custom404;
