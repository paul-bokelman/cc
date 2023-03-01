import type { GetClubs } from '@/cc';
import { Button } from '~/shared/components';
import Link from 'next/link';
import { TbUserCheck, TbFileText, TbUserX } from 'react-icons/tb';
import { Tag } from '~/shared/components';

export type ClubCardProps = Omit<GetClubs['payload'][number], 'tags'> & {
  tags: { name: string; active: boolean }[];
};

// AVALIABLITY!!!!!

export const ClubCard: React.FC<ClubCardProps> = (club) => {
  return (
    <div className="flex max-w-md flex-col gap-2 rounded-md border border-black-20 p-4 h-full justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{club.name}</h2>
        <div className="flex items-center gap-1">
          {club.tags.map(({ name, active }) => (
            <Tag key={name} name={name} variant="inline" active={active} />
          ))}
        </div>
        {/* truncating to 140 characters (should find another solution) */}
        <p className="text-sm text-black-60">
          {club.description.length > 140
            ? `${club.description.substring(0, 140)}...`
            : club.description}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mt-3 mb-2 h-[1px] w-full bg-black-20" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {club.availability === 'OPEN' ||
            club.availability === 'APPLICATION' ? (
              <TbUserCheck className="text-xl text-black-60" />
            ) : null}
            {club.availability === 'APPLICATION' ? (
              <TbFileText className="text-xl text-black-60" />
            ) : null}
            {club.availability === 'CLOSED' ? (
              <TbUserX className="text-xl text-black-60" />
            ) : null}
          </div>
          <Link href={`/clubs/${club.slug}`}>
            <Button
              style={{
                height: '32px',
                paddingLeft: '12px',
                paddingRight: '12px',
                fontSize: '12px',
              }}
              variant="secondary"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};