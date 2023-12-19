import type { NextPageWithConfig } from "~/shared/types";
import type { IconType } from "react-icons";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import {
  TbUserCheck,
  TbFileText,
  TbCalendarTime,
  TbLocation,
  TbLink,
  TbBrandInstagram,
  TbMail,
  TbShare,
  TbBrandFacebook,
  TbBrandTwitter,
  TbMoodConfuzed,
} from "react-icons/tb";
import { type TagNames, Tag, Button, ClubCard, ClubCompassLogo } from "~/shared/components";
import { useGetClub } from "~/lib/queries";
import { handleResponseError } from "~/shared/utils";

export type Club = {
  //base club
  name: string;
  tags: Array<TagNames>;
  applicationRequired: boolean;
  availability: "open" | "closed";
  description: string;
  members: { leadership: Array<{ name: string; role: string }>; total: number };

  meetingInformation: {
    frequency: string;
    time: string;
    day: string;
    location: string;
  };

  contactInformation: {
    email: string;
    instagram: string;
    website: { label: string; url: string };
  };

  // similarClubs: ClubCardProps[];
};

const Club: NextPageWithConfig = () => {
  const router = useRouter();

  // todo: convert to just "cq" instead of destructuring
  const cq = useGetClub(
    {
      query: { method: "slug", includeSimilar: "true" },
      params: { identifier: router.query.slug as string },
      body: undefined,
    },
    { enabled: !!router.query.slug, onError: (e) => handleResponseError(e, "Unable to fetch club") }
  );

  // check if error is 404, if so club doesn't exist!

  if (cq.status !== "success") {
    return (
      <div className="w-full flex justify-center items-center">
        {cq.isLoading ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <ClubCompassLogo className="animate-pulse text-3xl mb-2" />
            <p className="font-medium text-lg">Loading Club Information...</p>
            <p className="text-xs text-black-60">This shouldn't take long. Please be patient.</p>
          </div>
        ) : cq.isError ? (
          cq.error.response?.data.code === 404 ? (
            <div className="flex flex-col gap-2 justify-center items-center">
              <ClubCompassLogo className="grayscale opacity-30 text-3xl mb-2" />
              <p className="font-medium text-lg">Oops! Looks like that club doesn't exist.</p>
              <p className="text-xs text-black-60">If this club does exist please contact support.</p>
              <Button link href="/clubs" variant="secondary" size="small" style={{ marginTop: "0.5rem" }}>
                Back to Clubs
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <TbMoodConfuzed className="text-red-700 text-3xl mb-2" />
              <h2 className="text-lg font-semibold text-red-700">Something went wrong...</h2>
              <p className="text-xs text-red-700">An error occurred fetching this data, please contact support.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <ClubCompassLogo className="grayscale opacity-30 text-3xl mb-2" />
            <p className="font-medium text-lg">Query hasn't been enabled.</p>
            <p className="text-xs text-black-60">Something has gone wrong. Please contact support.</p>
          </div>
        )}
      </div>
    );
  }

  const TextWithIcon: React.FC<{
    element: string | React.ReactNode;
    icon: IconType;
  }> = (props) => (
    <div className="flex items-center gap-2">
      <props.icon className="stroke-2 text-lg text-black-90" />
      {typeof props.element === "string" ? <span className="text-black-70">{props.element}</span> : props.element}
    </div>
  );

  const leadership = {
    president: cq.data.president,
    "vice president": cq.data.vicePresident,
    secretary: cq.data.secretary,
    treasurer: cq.data.treasurer,
    advisor: cq.data.advisor,
  };

  const media = [
    { prefix: "https://www.instagram.com/", icon: TbBrandInstagram, handle: cq.data.instagram },
    { prefix: "https://www.facebook.com/", icon: TbBrandFacebook, handle: cq.data.facebook },
    { prefix: "https://www.twitter.com/", icon: TbBrandTwitter, handle: cq.data.twitter },
    { prefix: "", icon: TbLink, handle: cq.data.website },
  ].filter((m) => m.handle !== null);

  return (
    <div className="mt-12 flex w-full flex-col items-start justify-center gap-8">
      {/* HEADER */}
      <div className="flex w-full flex-col items-center justify-between md:flex-row md:items-start ">
        <div className="flex w-full flex-col items-center gap-4 md:items-start ">
          <h1 className="text-4xl font-semibold">{cq.data.name}</h1>
          <div className="flex items-center gap-2">
            {cq.data.tags?.map(({ name }) => (
              <Tag key={name} variant="inline" name={name} active={false} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {cq.data.availability === "OPEN" || cq.data.availability === "APPLICATION" ? (
              <div className="flex items-center gap-1">
                <TbUserCheck className="text-xl text-black" />
                <span className="text-sm text-black-70">Accepting Members</span>
              </div>
            ) : null}
            {cq.data.availability === "APPLICATION" ? (
              <div className="flex items-center gap-1">
                <TbFileText className="text-xl text-black" />
                <span className="text-sm text-black-70">Application Required</span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 md:mt-0">
          <Button
            variant="secondary"
            iconLeft={TbShare}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
          >
            Share
          </Button>
          {/* students can't join clubs yet so they can only apply */}
          {cq.data.availability === "APPLICATION" && cq.data.applicationLink ? (
            <Button variant="primary" link external href={cq.data.applicationLink}>
              Apply
            </Button>
          ) : null}
        </div>
      </div>
      {/* DESCRIPTION AND MEMBERS */}
      <div className="grid w-full grid-cols-1 items-start border-t border-b border-black-20 py-10 md:grid-cols-2 ">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="w-3/4 text-sm text-black-70 md:w-full">{cq.data.description}</p>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Leadership</h2>
          <div className="grid grid-cols-2 grid-rows-3 gap-3 w-3/4 grid-flow-col">
            {Object.entries(leadership).map(([role, name]) => (
              <div key={name} className="flex">
                <div className="flex flex-col gap-1">
                  <span className="text-black-70">{name}</span>
                  <span className="text-xs italic text-black-50 capitalize">{role}</span>
                </div>
              </div>
            ))}
            {/* {cq.data.members.total > cq.data.members.leadership.length ? (
              <span className="my-auto text-sm font-medium text-black-60">
                + {cq.data.members.total - cq.data.members.leadership.length} more
              </span>
            ) : null} */}
          </div>
        </div>
      </div>
      {/* MEETING AND CONTACT INFO */}
      <div className="grid w-full grid-cols-1 items-start border-b border-black-20 pb-10 md:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Meeting Information</h2>
          <div className="flex flex-col gap-2">
            <TextWithIcon
              element={`${cq.data.meetingDays}, ${cq.data.meetingTime}, ${cq.data.meetingFrequency}`}
              icon={TbCalendarTime}
            />
            <TextWithIcon element={cq.data.meetingLocation} icon={TbLocation} />
          </div>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="flex flex-col gap-2">
            <TextWithIcon element={cq.data.contactEmail} icon={TbMail} />
            {media.map((m) => (
              <TextWithIcon
                element={
                  <a href={`${m.prefix}${m.handle}`} className="text-blue-60 underline">
                    {!m.prefix ? "Website" : `@${m.handle}`}
                  </a>
                }
                icon={m.icon}
              />
            ))}
          </div>
        </div>
      </div>
      {/* SIMILAR CLUBS */}
      <div className="flex w-full flex-col items-center justify-center gap-6 md:items-start md:justify-start">
        <h2 className="text-xl font-semibold">Similar Clubs</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {cq.data.similarClubs && cq.data.similarClubs?.length !== 0 ? (
            cq.data.similarClubs?.map(({ tags, ...club }) => (
              <ClubCard key={cq.data.name} {...club} tags={tags.map((tag) => ({ ...tag, active: false }))} />
            ))
          ) : (
            <p className="text-sm text-black-60">Could not find any similar clubs</p>
          )}
        </div>
      </div>
    </div>
  );
};

Club.layout = { view: "standard", config: {} };

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const subdomain = req.headers.host.split('.')[0];
//   console.log(subdomain);
//   return { props: {} };
// };

export default Club;
