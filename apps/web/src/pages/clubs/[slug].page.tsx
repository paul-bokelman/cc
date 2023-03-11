import type { NextPageWithConfig } from '~/shared/types';
import type { IconType } from 'react-icons';
import type { GetClub } from '@/cc';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
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
} from 'react-icons/tb';
import { type Error, api } from '~/lib/api';
import { type TagNames, Tag, Button, ClubCard, ClubCompassLogo } from '~/shared/components';
import { GetServerSideProps } from 'next';

export type Club = {
  //base club
  name: string;
  tags: Array<TagNames>;
  applicationRequired: boolean;
  availability: 'open' | 'closed';
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

  const { data: club, ...clubQuery } = useQuery<GetClub['payload'], Error>(
    ['club', { slug: router.query.slug }],
    async () =>
      await api.clubs.get({
        query: { method: 'slug', includeSimilar: 'true' },
        params: { identifier: router.query.slug as string },
      }),
    { enabled: !!router.query.slug }
  );

  // check if error is 404, if so club doesn't exist!

  if (clubQuery.status !== 'success') {
    return (
      <div className="w-full flex justify-center items-center">
        {clubQuery.isLoading ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <ClubCompassLogo className="animate-pulse text-3xl mb-2" />
            <p className="font-medium text-lg">Loading Club Information...</p>
            <p className="text-xs text-black-60">This shouldn't take long. Please be patient.</p>
          </div>
        ) : clubQuery.isError ? (
          clubQuery.error.response.data.code === 404 ? (
            <div className="flex flex-col gap-2 justify-center items-center">
              <ClubCompassLogo className="grayscale opacity-30 text-3xl mb-2" />
              <p className="font-medium text-lg">Oops! Looks like that club doesn't exist.</p>
              <p className="text-xs text-black-60">If this club does exist please contact support.</p>
              <Button link href="/clubs" variant="secondary" size="small" style={{ marginTop: '0.5rem' }}>
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
      {typeof props.element === 'string' ? <span className="text-black-70">{props.element}</span> : props.element}
    </div>
  );

  const leadership = {
    president: club.president,
    'vice president': club.vicePresident,
    secretary: club.secretary,
    treasurer: club.treasurer,
    advisor: club.advisor,
  };

  return (
    <div className="mt-12 flex w-full flex-col items-start justify-center gap-8">
      {/* HEADER */}
      <div className="flex w-full flex-col items-center justify-between md:flex-row md:items-start ">
        <div className="flex w-full flex-col items-center gap-4 md:items-start ">
          <h1 className="text-4xl font-semibold">{club.name}</h1>
          <div className="flex items-center gap-2">
            {club.tags?.map(({ name }) => (
              <Tag key={name} variant="inline" name={name} active={false} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {club.availability === 'OPEN' || club.availability === 'APPLICATION' ? (
              <div className="flex items-center gap-1">
                <TbUserCheck className="text-xl text-black" />
                <span className="text-sm text-black-70">Accepting Members</span>
              </div>
            ) : null}
            {club.availability === 'APPLICATION' ? (
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
              toast.success('Link copied to clipboard!');
            }}
          >
            Share
          </Button>
          {/* students can't join clubs yet so they can only apply */}
          {club.availability === 'APPLICATION' ? (
            <Button variant="primary" link external href={club.applicationLink}>
              Apply
            </Button>
          ) : null}
        </div>
      </div>
      {/* DESCRIPTION AND MEMBERS */}
      <div className="grid w-full grid-cols-1 items-start border-t border-b border-black-20 py-10 md:grid-cols-2 ">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="w-3/4 text-sm text-black-70 md:w-full">{club.description}</p>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Leadership</h2>
          <div className="grid grid-cols-2 grid-rows-3 gap-3 w-3/4 grid-flow-col">
            {Object.entries(leadership).map(([role, name], i) => (
              <div key={name} className="flex">
                <div className="flex flex-col gap-1">
                  <span className="text-black-70">{name}</span>
                  <span className="text-xs italic text-black-50 capitalize">{role}</span>
                </div>
              </div>
            ))}
            {/* {club.members.total > club.members.leadership.length ? (
              <span className="my-auto text-sm font-medium text-black-60">
                + {club.members.total - club.members.leadership.length} more
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
              element={`${club.meetingDays}, ${club.meetingTime}, ${club.meetingFrequency}`}
              icon={TbCalendarTime}
            />
            <TextWithIcon element={club.meetingLocation} icon={TbLocation} />
          </div>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="flex flex-col gap-2">
            <TextWithIcon element={club.contactEmail} icon={TbMail} />
            {club.instagram ? (
              <TextWithIcon
                element={
                  <a href={`https://www.instagram.com/${club.instagram}`} className="text-blue-60 underline">
                    @{club.instagram}
                  </a>
                }
                icon={TbBrandInstagram}
              />
            ) : null}
            {club.facebook ? (
              <TextWithIcon
                element={
                  <a href={`https://www.facebook.com/${club.facebook}`} className="text-blue-60 underline">
                    @{club.facebook}
                  </a>
                }
                icon={TbBrandFacebook}
              />
            ) : null}
            {club.twitter ? (
              <TextWithIcon
                element={
                  <a href={`https://www.twitter.com/${club.twitter}`} className="text-blue-60 underline">
                    @{club.twitter}
                  </a>
                }
                icon={TbBrandTwitter}
              />
            ) : null}
            <TextWithIcon
              element={
                <a href={club.website} className="text-blue-60 underline">
                  Website
                </a>
              }
              icon={TbLink}
            />
          </div>
        </div>
      </div>
      {/* SIMILAR CLUBS */}
      <div className="flex w-full flex-col items-center justify-center gap-6 md:items-start md:justify-start">
        <h2 className="text-xl font-semibold">Similar Clubs</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {club?.similarClubs && club?.similarClubs?.length !== 0 ? (
            club?.similarClubs?.map(({ tags, ...club }) => (
              <ClubCard key={club.name} {...club} tags={tags.map((tag) => ({ ...tag, active: false }))} />
            ))
          ) : (
            <p className="text-sm text-black-60">Could not find any similar clubs</p>
          )}
        </div>
      </div>
    </div>
  );
};

Club.layout = { view: 'standard', config: {} };

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const subdomain = req.headers.host.split('.')[0];
//   console.log(subdomain);
//   return { props: {} };
// };

export default Club;
