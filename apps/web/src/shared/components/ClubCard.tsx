import type { GetClubs } from "cc-common";
import { Button, Pill } from "~/shared/components";
import Link from "next/link";
import { TbUserCheck, TbFileText, TbUserX, TbTag } from "react-icons/tb";
import { Tag } from "~/shared/components";

export type ClubCardProps = GetClubs["payload"][number];

export const ClubCard: React.FC<ClubCardProps> = (club) => {
  return (
    <div className="flex w-full md:max-w-md flex-col gap-2 rounded-md border border-black-20 p-4 h-full justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-lg font-semibold">{club.name}</h2>
        <div className="flex items-center gap-1">
          {club.tags?.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-black-70">
              <TbTag className />
              <span>No tags</span>
            </div>
          ) : (
            club.tags?.map(({ name, active }) => <Tag key={name} variant="inline" name={name} active={active} />)
          )}
        </div>
        {/* truncating to 140 characters (should find another solution) */}
        <p className="text-base md:text-sm text-black-60">
          {!club.description
            ? "No description provided."
            : club.description.length > 140
            ? `${club.description.substring(0, 140)}...`
            : club.description}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mt-3 mb-2 h-[1px] w-full bg-black-20" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill type="status" status={club.status} />
            {club.availability === "OPEN" || club.availability === "APPLICATION" ? (
              <TbUserCheck className="text-xl text-black-60" />
            ) : null}
            {club.availability === "APPLICATION" ? <TbFileText className="text-xl text-black-60" /> : null}
            {club.availability === "CLOSED" ? <TbUserX className="text-xl text-black-60" /> : null}
          </div>
          <Link href={`/clubs/${club.slug}`}>
            <Button size="small" variant="secondary">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ClubCardSkeleton: React.FC = () => {
  return (
    <div className="flex w-full md:max-w-md flex-col gap-2 rounded-md border border-black-20 p-4 h-full justify-between animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-2/3 bg-black-15 rounded-md" />
        <div className="h-4 w-1/3 bg-black-15 rounded-md" />
        <div className="h-16 w-full bg-black-15 rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="mt-3 mb-2 h-[1px] w-full bg-black-20" />
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 bg-black-15 rounded-md" />
          <div className="h-8 w-32 bg-black-15 rounded-md" />
        </div>
      </div>
    </div>
  );
};
