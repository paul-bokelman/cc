import type { NextPageWithConfig } from '~/shared/types';
import type { IconType } from 'react-icons';
import { useRouter } from 'next/router';
import {
  TbUserCheck,
  TbFileText,
  TbCalendarTime,
  TbLocation,
  TbLink,
  TbBrandInstagram,
  TbMail,
  TbShare,
} from 'react-icons/tb';
import {
  type TagNames,
  type ClubCardProps,
  Tag,
  ClubCard,
  Button,
} from '~/shared/components';

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

  similarClubs: ClubCardProps[];
};

const Club: NextPageWithConfig = () => {
  const router = useRouter();

  const club: Club = {
    name: 'Engineering',
    tags: ['sports', 'science'],
    applicationRequired: true,
    availability: 'open',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    members: {
      leadership: [
        { name: 'Paul Bokelman', role: 'President' },
        { name: 'Sam Mahjouri', role: 'Vice President' },
        { name: 'Andrew Hale', role: 'Secretary' },
        { name: 'Abhinav Palaharla', role: 'Treasurer' },
        { name: 'John Mortensen', role: 'Advisor' },
      ],
      total: 32,
    },
    meetingInformation: {
      frequency: 'Weekly',
      time: '4:00-7:30 PM',
      day: 'Monday',
      location: 'Room 123',
    },
    contactInformation: {
      email: 'dhns.engineering@gmail.com',
      instagram: '@dnhs.engineering',
      website: {
        label: 'DNHS Engineering',
        url: 'https://www.dnhs-engineering.com',
      },
    },
    similarClubs: [
      {
        title: 'Engineering',
        description:
          'To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders.',
        tags: ['sports', 'science'],
      },
      {
        title: 'Engineering',
        description:
          'To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders.',
        tags: ['sports', 'science'],
      },
      {
        title: 'Engineering',
        description:
          'To identify a real-world problem and develop a solution to it. Equips students to become tech entrepreneurs and leaders.',
        tags: ['sports', 'science'],
      },
    ],
  };

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

  return (
    <div className="mt-12 flex w-full flex-col items-start justify-center gap-8">
      {/* HEADER */}
      <div className="flex w-full flex-col items-center justify-between md:flex-row md:items-start ">
        <div className="flex w-full flex-col items-center gap-4 md:items-start ">
          <h1 className="text-4xl font-semibold">{club.name}</h1>
          <div className="flex items-center gap-2">
            {club.tags.map((name) => (
              <Tag key={name} variant="inline" name={name} active={false} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {club.availability === 'open' ? (
              <div className="flex items-center gap-1">
                <TbUserCheck className="text-xl text-black" />
                <span className="text-sm text-black-70">Accepting Members</span>
              </div>
            ) : null}
            {club.applicationRequired ? (
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
          <Button variant="secondary" iconLeft={TbShare}>
            Share
          </Button>
          {/* students can't join clubs yet so they can only apply */}
          {club.applicationRequired ? (
            <Button variant="primary">Apply</Button>
          ) : null}
        </div>
      </div>
      {/* DESCRIPTION AND MEMBERS */}
      <div className="grid w-full grid-cols-1 items-center border-t border-b border-black-20 py-10 md:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="w-3/4 text-sm text-black-70 md:w-full">
            {club.description}
          </p>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Members</h2>
          <div className="grid grid-cols-2 grid-rows-3 gap-3">
            {club.members.leadership.map((member) => (
              <div key={member.name} className="flex flex-col gap-1">
                <span className="text-black-70">{member.name}</span>
                <span className="text-xs italic text-black-50">
                  {member.role}
                </span>
              </div>
            ))}
            {club.members.total > club.members.leadership.length ? (
              <span className="my-auto text-sm font-medium text-black-60">
                + {club.members.total - club.members.leadership.length} more
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {/* MEETING AND CONTACT INFO */}
      <div className="grid w-full grid-cols-1 border-b border-black-20 pb-10 md:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-6 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Meeting Information</h2>
          <div className="flex flex-col gap-2">
            <TextWithIcon
              element={`${club.meetingInformation.day}, ${club.meetingInformation.time}, ${club.meetingInformation.frequency}`}
              icon={TbCalendarTime}
            />
            <TextWithIcon
              element={club.meetingInformation.location}
              icon={TbLocation}
            />
          </div>
        </div>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-0 md:w-3/4 md:items-start md:justify-start">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="flex flex-col gap-2">
            <TextWithIcon
              element={club.contactInformation.email}
              icon={TbMail}
            />
            <TextWithIcon
              element={club.contactInformation.instagram}
              icon={TbBrandInstagram}
            />
            <TextWithIcon
              element={
                <a
                  href={club.contactInformation.website.url}
                  className="text-blue-60 underline"
                >
                  {club.contactInformation.website.label}
                </a>
              }
              icon={TbLink}
            />
          </div>
        </div>
      </div>
      {/* MEETING AND CONTACT INFO */}
      <div className="flex w-full flex-col items-center justify-center gap-6 md:items-start md:justify-start">
        <h2 className="text-xl font-semibold">Similar Clubs</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {club.similarClubs.map((club) => (
            <ClubCard key={club.title} {...club} />
          ))}
        </div>
      </div>
    </div>
  );
};

Club.layout = { view: 'standard', config: {} };

export default Club;
