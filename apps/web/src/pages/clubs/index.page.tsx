import type { NextPageWithConfig } from '~/shared/types';
import type { GetClubs } from '@/cc';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import qs from 'qs';
import { TbChevronDown, TbFilter } from 'react-icons/tb';
import { type Error, api } from '~/lib/api';
import { parseQ } from '~/lib/utils';
import { ClubCard, Button, DropdownMenu, ClubsFilterModal } from '~/shared/components';

const Clubs: NextPageWithConfig = () => {
  const router = useRouter();

  const clubsQuery = useQuery<GetClubs['payload'], Error>(
    ['clubs', router.query],
    async () => await api.clubs.all({ query: parseQ(router.asPath) }),
    {
      onError: (e) => console.log(e),
    }
  );

  const sortMenuItems = [
    { label: 'Newest', value: 'new' },
    { label: 'Oldest', value: 'old' },
    { label: 'A-Z', value: 'name-asc' },
    { label: 'Z-A', value: 'name-desc' },
  ];

  const [activeSortIndex, setActiveSortIndex] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // if (clubsQuery.status !== 'success') { //! handle state properly
  //   return <>loading or smtn</>;
  // }

  const clubs = clubsQuery?.data ?? [];

  console.log(clubsQuery);

  const handleApplySort = (i: number) => {
    setActiveSortIndex(i);
    const filter = parseQ(router.asPath)?.filter;
    const q = { filter, sort: sortMenuItems[i].value };
    router.push({ query: qs.stringify(q) }, undefined, { shallow: true });
  };

  useEffect(() => {
    const q = parseQ(router.asPath)?.sort as 'new' | 'old' | 'name-asc' | 'name-desc' | undefined;
    setActiveSortIndex(q ? sortMenuItems.findIndex((item) => item.value === q) : 0);
  }, []);

  return (
    <div className="mt-12 flex w-full flex-col items-start justify-center gap-8">
      <h1 className="text-3xl font-bold leading-3">Discover Clubs</h1>
      <p className="leading-3 text-black-60 ">Select your interests and find the perfect club for you.</p>
      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full items-center gap-2 md:w-auto">
          <Button
            variant="secondary"
            iconLeft={TbFilter}
            style={{
              width: 'fit-content',
              height: '3rem',
            }}
            onClick={() => setShowFilterModal(true)}
          >
            Filters
          </Button>

          <ClubsFilterModal isOpen={showFilterModal} closeModal={() => setShowFilterModal(false)} />

          <DropdownMenu
            items={sortMenuItems.map((item, i) => ({
              active: i === activeSortIndex,
              onClick: () => handleApplySort(i),
              ...item,
            }))}
          >
            <DropdownMenu.Button
              variant="secondary"
              iconRight={TbChevronDown}
              style={{
                width: 'fit-content',
                height: '3rem',
              }}
            >
              Sort by {sortMenuItems[activeSortIndex]?.label}
            </DropdownMenu.Button>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {clubs.length !== 0 ? (
          clubs?.map((club, i) => (
            <ClubCard key={i} {...club} tags={club.tags.map(({ name, active }) => ({ name, active }))} />
          ))
        ) : (
          <p>No clubs matching current filter.</p>
        )}
      </div>
    </div>
  );
};

Clubs.layout = { view: 'standard', config: {} };

export default Clubs;
