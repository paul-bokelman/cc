import type { NextPageWithConfig } from "~/shared/types";
import * as React from "react";

const Home: NextPageWithConfig = () => {
  return (
    <div className="mt-40 flex w-full flex-col items-start justify-center gap-8">
      <h1>Club Compass</h1>
    </div>
  );
};

Home.layout = { view: "standard", config: {} };

export default Home;
