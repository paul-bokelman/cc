import type { NextPageWithConfig } from "~/shared/types";
import * as React from "react";
import { Logo } from "~/shared/components";
import { GetServerSideProps } from "next";

const About: NextPageWithConfig = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 mt-12">
      <Logo size={40} />
      <h1 className="text-6xl font-bold ">Who are we? </h1>
      <p className="-my-2 text-black-60 w-1/2 text-center">
        We're ClubCompass, and we're paving the path to better academic communities by connecting students with each
        other through clubs.
      </p>
      <div className="flex w-3/4 h-1 border-t" />
      <div className="flex flex-col gap-12">
        <div className="flex flex-col justify-start items-start gap-4">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="-my-2 text-black-60 w-1/2">
            We're ClubCompass, and we're paving the path to better academic communities by connecting students with each
            other through clubs.
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="-my-2 text-black-60 w-1/2 ">
            We're ClubCompass, and we're paving the path to better academic communities by connecting students with each
            other through clubs.
          </p>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 w-3/4">
        <div className="flex flex-col justify-center items-center gap-2">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="-my-2 text-black-60 w-1/2 text-center">
            We're ClubCompass, and we're paving the path to better academic communities by connecting students with each
            other through clubs.
          </p>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <h2>Our Goals</h2>
          <p className="-my-2 text-black-60 w-1/2 text-center">
            We're ClubCompass, and we're paving the path to better academic communities by connecting students with each
            other through clubs.
          </p>
        </div>
      </div> */}
    </div>
  );
};
About.layout = { view: "standard", config: {} };

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/clubs",
      permanent: false,
    },
  };
};

export default About;
