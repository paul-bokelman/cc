import type { NextPageWithConfig } from "~/shared/types";
import * as React from "react";
import { GetServerSideProps } from "next";

const Home: NextPageWithConfig = () => {
  return (
    <div className="mt-40 flex w-full flex-col items-start justify-center gap-8">
      <h1>WIP</h1>
    </div>
  );
};

Home.layout = { view: "standard", config: {} };

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/clubs",
      permanent: false,
    },
  };
};

export default Home;
