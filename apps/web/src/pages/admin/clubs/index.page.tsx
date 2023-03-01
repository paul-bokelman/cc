import type { NextPageWithConfig } from '~/shared/types';
import type { GetAdminClubs } from '@/cc';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { TbPlus, TbFileText, TbUserCheck, TbUserX, TbUser } from 'react-icons/tb';
import { type Error, api } from '~/lib/api';
import { tags as tagList, DashboardContainer as Page, Button } from '~/shared/components';

const AdminDashboardClubs: NextPageWithConfig = () => {
  const adminClubsQuery = useQuery<GetAdminClubs['payload'], Error>(
    ['admin-clubs'],
    async () => await api.admin.clubs(),
    {
      retry: 0,
      onError: (e) => console.log(e),
    }
  );
  const { clubs, overview } = adminClubsQuery?.data ?? {};

  const overviewAnalytics = {
    'Total Clubs': overview?.totalClubs,
    'Total leaders in clubs': overview?.totalMembersInClubs, // will be members in phase 2
    'Percentage of open clubs': `${overview?.percentageOfOpenClubs}%`,
  };

  return (
    <Page state={adminClubsQuery.status}>
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
          {clubs?.map((club) => (
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
                <span className="text-3xl font-semibold text-black">{value}</span>
              </div>
            ))}
          </div>
        </Page.Section>
      </div>
    </Page>
  );
};

type DashboardClubCardProps = GetAdminClubs['payload']['clubs'][number];

const DashboardClubCard: React.FC<DashboardClubCardProps> = (club) => {
  const leadership = {
    president: club.president,
    advisor: club.advisor,
  };

  const availabilityIcons = {
    APPLICATION: TbFileText,
    OPEN: TbUserCheck,
    CLOSED: TbUserX,
  };

  const joiningInformation = [
    {
      icon: availabilityIcons[club.availability],
      value: club.availability.toLowerCase(),
    },
    // {
    //   icon: TbUser,
    //   value: members.total,
    // },
  ];

  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-black-20 p-4">
      <h2 className="text-lg font-semibold">{club.name}</h2>
      <div className="flex w-full items-center gap-10">
        {Object.entries(leadership).map(([role, name]) => (
          <div key={name} className="flex flex-col gap-1">
            <span className="text-xs italic text-black-50">{role}</span>
            <span className="text-black-70">{name}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-4">
        {joiningInformation.map((info) => {
          if (!info) return null;
          return (
            <div key={info.value} className="flex items-center gap-1">
              <info.icon className="text-lg text-black" />
              <span className="text-xs capitalize text-black-60">{info.value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 mb-2 h-[1px] w-full bg-black-20" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {club.tags.map(({ name }) => {
            const Icon = tagList[name].icon;
            return <Icon className="text-lg text-black" />;
          })}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/clubs/${club.slug}`}>
            <Button variant="secondary" size="small">
              View Page
            </Button>
          </Link>
          <Link href={`/admin/clubs/${club.id}`}>
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
