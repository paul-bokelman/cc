import type { NextPageWithConfig } from "~/shared/types";
import type { GetAdminClubs } from "cc-common";
import Link from "next/link";
import { TbPlus, TbFileText, TbUserCheck, TbUserX, TbTag } from "react-icons/tb";
import { useGetAdminClubs } from "~/lib/queries";
import { handleResponseError } from "~/lib/utils";
import { withUser } from "~/shared/utils";
import { DashboardContainer as Page, Button, Pill } from "~/shared/components";

const AdminDashboardClubs: NextPageWithConfig = () => {
  const adminClubsQuery = useGetAdminClubs(
    { body: undefined, params: undefined, query: {} },
    { onError: (e) => handleResponseError(e, "Unable to fetch clubs") }
  );
  const { clubs, overview } = adminClubsQuery?.data ?? {};

  const overviewAnalytics = {
    "Total Clubs": overview?.totalClubs,
    "Total leaders in clubs": overview?.totalMembersInClubs, // will be members in phase 2
    "Percentage of open clubs": `${overview?.percentageOfOpenClubs}%`,
  };

  return (
    <Page state={adminClubsQuery.status}>
      <Page.Header
        title="Manage Clubs"
        description="Manage clubs and view overall analytics"
        actions={[
          {
            variant: "primary",
            children: "New Club",
            iconLeft: TbPlus,
            link: true,
            href: "/admin/clubs/new",
          },
        ]}
      />
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-4">
        <Page.Section
          title="Clubs"
          description="View and manage club pages"
          containerClass="col-span-2 lg:col-span-3"
          childClass="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {clubs?.map((club) => (
            <DashboardClubCard key={club.name} {...club} />
          ))}
        </Page.Section>
        <Page.Section
          title="Analytics Overview"
          description="Statistics about clubs"
          containerClass="col-span-2 lg:col-span-1 order-first lg:order-none"
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

type DashboardClubCardProps = GetAdminClubs["payload"]["clubs"][number];

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

  const additionalInformation = [
    {
      icon: availabilityIcons[club.availability],
      value: club.availability.toLowerCase(),
    },
    {
      icon: TbTag,
      value: club.tags.length === 0 ? "No tags" : club.tags.map((tag) => tag.name).join(", "),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-black-20 p-4 justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{club.name}</h2>
        <div className="flex w-full items-center gap-10">
          {Object.entries(leadership).map(([role, name]) => (
            <div key={name} className="flex flex-col gap-1 w-full overflow-x-scroll">
              <span className="text-xs italic text-black-50">{role}</span>
              <span className="text-black-70">{name}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-4">
          {additionalInformation.map((info) => (
            <div key={info.value} className="flex items-center gap-1">
              {info.icon && <info.icon className="text-lg text-black" />}
              <span className="text-xs capitalize text-black-60">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        <div className="h-[1px] w-full bg-black-20 items-end" />
        <div className="flex items-center w-full justify-between">
          <Pill type="status" status={club.status} />
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
    </div>
  );
};

AdminDashboardClubs.layout = {
  view: "dashboard",
  config: {},
};

export const getServerSideProps = withUser({ role: "ADMIN" });

export default AdminDashboardClubs;
