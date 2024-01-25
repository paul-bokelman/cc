import { GetServerSideProps } from "next";
import type { NextPageWithConfig } from "~/shared/types";

const Home: NextPageWithConfig<{ cookies: Record<string, string> }> = ({ cookies }) => {
  console.log(cookies);
  return (
    <div className="mt-40 flex w-full flex-col items-start justify-center gap-8">
      <h1>Club Compass</h1>
      {cookies && <p>{JSON.stringify(cookies)}</p>}
    </div>
  );
};

Home.layout = { view: "standard", config: {} };

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      cookies: ctx.req.cookies,
    },
  };
};

export default Home;
