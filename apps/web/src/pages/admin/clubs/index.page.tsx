import type { NextPageWithConfig } from '~/shared/types';
import Link from 'next/link';
import {
  tags as tagList,
  DashboardContainer as Page,
  Button,
} from '~/shared/components';
import {
  TbPlus,
  TbFileText,
  TbUserCheck,
  TbUserX,
  TbUser,
} from 'react-icons/tb';
import type { Club } from 'pages/clubs/[slug].page'; // TEMP

const AdminDashboardClubs: NextPageWithConfig = () => {
  const clubs: Array<DashboardClubCardProps> = [
    {
      name: 'Engineering',
      tags: ['sports', 'science', 'charity', 'nature'],
      applicationRequired: true,
      availability: 'open',
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
    },
    {
      name: 'Engineering',
      tags: ['sports', 'science'],
      applicationRequired: true,
      availability: 'open',
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
    },
    {
      name: 'Engineering',
      tags: ['sports', 'science'],
      applicationRequired: true,
      availability: 'open',
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
    },
  ];

  const overviewAnalytics = {
    'Total Clubs': 103,
    'Total members in clubs': 405,
    'Percentage of open clubs': '65%',
  };

  return (
    <Page state="success">
      <Page.Header
        title="Manage Clubs"
        description="Manage clubs and view overall analytics"
        actions={[
          {
            variant: 'primary',
            children: 'New Club',
            iconLeft: TbPlus,
            link: true,
            href: '/admin/clubs/new',
          },
        ]}
      />
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-4">
        <Page.Section
          title="Del Norte Clubs"
          description="View and manage the Clubs at Del Norte"
          containerClass="col-span-2 lg:col-span-3"
          childClass="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {clubs.map((club) => (
            <DashboardClubCard key={club.name} {...club} />
          ))}
        </Page.Section>
        <Page.Section
          title="Overview"
          description="Del Norte club analytics"
          containerClass="col-span-2 lg:col-span-1 "
        >
          <div className="flex flex-col gap-4 rounded-md border border-black-20 p-8">
            {Object.entries(overviewAnalytics).map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-sm text-black-60">{label}</span>
                <span className="text-3xl font-semibold text-black">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Page.Section>
      </div>
    </Page>
  );
};

type DashboardClubCardProps = Pick<
  Club,
  'name' | 'members' | 'availability' | 'applicationRequired' | 'tags'
>;

const DashboardClubCard: React.FC<DashboardClubCardProps> = ({
  name,
  members,
  applicationRequired,
  availability,
  tags,
}) => {
  const president = members.leadership.find(
    (member) => member.role === 'President'
  )!;
  const advisor = members.leadership.find(
    (member) => member.role === 'Advisor'
  )!;

  const joiningInformation = [
    applicationRequired
      ? { icon: TbFileText, value: 'Application Required' }
      : null,
    {
      icon: availability === 'open' ? TbUserCheck : TbUserX,
      value: availability,
    },
    {
      icon: TbUser,
      value: members.total,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-black-20 p-4">
      <h2 className="text-lg font-semibold">{name}</h2>
      <div className="flex w-full items-center gap-10">
        {[president, advisor].map((member) => (
          <div key={member.name} className="flex flex-col gap-1">
            <span className="text-xs italic text-black-50">{member.role}</span>
            <span className="text-black-70">{member.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-4">
        {joiningInformation.map((info) => {
          if (!info) return null;
          return (
            <div key={info.value} className="flex items-center gap-1">
              <info.icon className="text-lg text-black" />
              <span className="text-xs capitalize text-black-60">
                {info.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 mb-2 h-[1px] w-full bg-black-20" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {tags.map((tag) => {
            const Icon = tagList[tag].icon;
            return (
              <div className="">
                <Icon className="text-lg text-black" />
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/clubs/slug">
            <Button variant="secondary" size="small">
              View Page
            </Button>
          </Link>
          <Link href="/admin/clubs/slug">
            <Button variant="primary" size="small">
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

AdminDashboardClubs.layout = {
  view: 'dashboard',
  config: {},
};

export default AdminDashboardClubs;
