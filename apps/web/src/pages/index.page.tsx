import type { NextPageWithConfig } from "~/shared/types";
import * as React from "react";
import { GetServerSideProps } from "next";
import { FaLongArrowAltRight } from "react-icons/fa";
import { subdomains, parseSubdomain } from "~/lib/utils";
import { ClubCard, ClubCardProps, Logo } from "~/shared/components";
import { ContactModal } from "~/shared/components";

const Home: NextPageWithConfig = () => {
  const [showContactModal, setShowContactModal] = React.useState<boolean>(false);

  let mock_date = new Date();
  let mock_data: ClubCardProps[] = [
    {
      id: "mock_id",
      name: "Eco Warriors",
      slug: "mock-slug",
      description:
        "The Eco Warriors Club is dedicated to promoting sustainability and environmental awareness within the school and the community. Members participate in activities such as recycling drives, tree planting, and environmental clean-up projects. The club also organizes workshops and events to educate peers on eco-friendly practices and the importance of protecting our planet.",
      availability: "OPEN",
      tags: [
        {
          id: "mock_id",
          name: "awareness",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: true,
        },
        {
          id: "mock_id",
          name: "community",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "environment",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
      ],
      status: "ACTIVE",
    },
    {
      id: "mock_id",
      name: "Cultural Arts Club",
      slug: "mock-slug",
      description:
        "The Cultural Arts Club celebrates the richness and diversity of global cultures through various forms of artistic expression. Members engage in activities such as dance, music, visual arts, and culinary arts, showcasing traditions from around the world. The club organizes cultural festivals, art exhibits, and performances, fostering an inclusive environment where students can learn about and appreciate different cultural heritages.",
      availability: "CLOSED",
      tags: [
        {
          id: "mock_id",
          name: "culture",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "art",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
      ],
      status: "INTEREST",
    },
    {
      id: "mock_id",
      name: "Tech Innovators",
      slug: "mock-slug",
      description:
        "The Tech Innovators Club is a hub for students passionate about technology and innovation. Members have the opportunity to explore various tech fields, including coding, robotics, and app development. The club hosts hackathons, coding challenges, and guest speaker sessions with industry professionals. It's a space for creative problem-solving and bringing tech ideas to life through collaborative projects.",
      availability: "APPLICATION",
      tags: [
        {
          id: "mock_id",
          name: "science",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "technology",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: true,
        },
        {
          id: "mock_id",
          name: "problem solving",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
      ],
      status: "INACTIVE",
    },
    {
      id: "mock_id",
      name: "STEM Explorers Club",
      slug: "mock-slug",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida dictum fusce.",
      availability: "OPEN",
      tags: [
        {
          id: "mock_id",
          name: "science",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "technology",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "education",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
      ],
      status: "ACTIVE",
    },
    {
      id: "mock_id",
      name: "Debate and Public Speaking Club",
      slug: "mock-slug",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida dictum fusce.",
      availability: "OPEN",
      tags: [
        {
          id: "mock_id",
          name: "community",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "awareness",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
      ],
      status: "ACTIVE",
    },
    {
      id: "mock_id",
      name: "Creative Writing Club",
      slug: "mock-slug",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida dictum fusce.",
      availability: "OPEN",
      tags: [
        {
          id: "mock_id",
          name: "education",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
        {
          id: "mock_id",
          name: "writing",
          createdAt: mock_date,
          updatedAt: mock_date,
          active: false,
        },
      ],
      status: "ACTIVE",
    },
  ];

  return (
    <>
      <div className="w-screen flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 justify-center items-center mt-60">
            <Logo withText dest="/" />
            <h1 className="text-3xl md:text-5xl font-bold">Redefining Club Discovery</h1>
            <p className="text-black-60">Join us in our journey to rebuild communities in our local schools.</p>
            {/* <div className="flex items-center gap-2 text-blue-60 hover:underline cursor-pointer group">
            <a className="font-semibold">Schedule a Demo</a>
            <FaLongArrowAltRight className="relative mt-[1.5px] group-hover:translate-x-1 transition-transform" />
          </div> */}
            <div className="flex items-center gap-2 text-blue-60 hover:underline cursor-pointer group">
              <button onClick={() => setShowContactModal(true)} className="font-semibold">
                Contact Us
              </button>
              <FaLongArrowAltRight className="relative mt-[1.5px] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="relative flex justify-center mt-12 w-screen">
            <div className="fixed w-full h-[32rem] bg-gradient-to-b from-white to-[#ffffff00] z-20" />
            <div className="fixed grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mock_data.map((club, i) => (
                <ClubCard key={i} {...club} notInteractive={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ContactModal isOpen={showContactModal} closeModal={() => setShowContactModal(false)} />
    </>
  );
};

Home.layout = { view: "none" };

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let res = parseSubdomain(new URL(req.url!, `http://${req.headers.host}`));
  if (res.valid && subdomains.includes(res.subdomain)) {
    return {
      redirect: {
        destination: "/clubs",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Home;
