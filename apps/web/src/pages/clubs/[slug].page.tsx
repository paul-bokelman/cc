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
} from 'react-icons/tb';
import { type Error, api } from '~/lib/api';
import { type TagNames, Tag, Button } from '~/shared/components';

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

  const clubQuery = useQuery<GetClub['payload'], Error>(
    ['club', { slug: router.query.slug }],
    async () =>
      await api.clubs.get({
        query: { method: 'slug' },
        params: { identifier: router.query.slug as string },
      }),
    {
      retry: 0,
      onError: (e) => console.log(e),
      enabled: !!router.query.slug,
    }
  );

  if (clubQuery.status !== 'success') {
    return <>loading or smtn</>;
  }

  const club = clubQuery.data;

  const TextWithIcon: React.FC<{
    element: string | React.ReactNode;
    icon: IconType;
  }> = (props) => (
    <div className="flex items-center gap-2">
      <props.icon className="stroke-2 text-lg text-black-90" />
      {typeof props.element === 'string' ? (
        <span className="text-black-70">{props.element}</span>
      ) : (
        props.element
      )}
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
            {club.availability === 'OPEN' ||
            club.availability === 'APPLICATION' ? (
              <div className="flex items-center gap-1">
                <TbUserCheck className="text-xl text-black" />
                <span className="text-sm text-black-70">Accepting Members</span>
              </div>
            ) : null}
            {club.availability === 'APPLICATION' ? (
              <div className="flex items-center gap-1">
                <TbFileText className="text-xl text-black" />
                <span className="text-sm text-black-70">
                  Application Required
                </span>
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
          <p className="w-3/4 text-sm text-black-70 md:w-full">
            {club.description}
          </p>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Leadership</h2>
          <div className="grid grid-cols-2 grid-rows-3 gap-3 w-3/4 grid-flow-col">
            {Object.entries(leadership).map(([role, name], i) => (
              <div key={name} className="flex">
                <div className="flex flex-col gap-1">
                  <span className="text-black-70">{name}</span>
                  <span className="text-xs italic text-black-50 capitalize">
                    {role}
                  </span>
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
                  <a
                    href={`https://www.instagram.com/${club.instagram}`}
                    className="text-blue-60 underline"
                  >
                    @{club.instagram}
                  </a>
                }
                icon={TbBrandInstagram}
              />
            ) : null}
            {club.facebook ? (
              <TextWithIcon
                element={
                  <a
                    href={`https://www.facebook.com/${club.facebook}`}
                    className="text-blue-60 underline"
                  >
                    @{club.facebook}
                  </a>
                }
                icon={TbBrandFacebook}
              />
            ) : null}
            {club.twitter ? (
              <TextWithIcon
                element={
                  <a
                    href={`https://www.twitter.com/${club.twitter}`}
                    className="text-blue-60 underline"
                  >
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
      {/* <div className="flex w-full flex-col items-center justify-center gap-6 md:items-start md:justify-start">
        <h2 className="text-xl font-semibold">Similar Clubs</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {club.similarClubs.map((club) => (
            <ClubCard key={club.title} {...club} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

Club.layout = { view: 'standard', config: {} };

export default Club;
