import type { NextPageWithConfig } from "~/shared/types";
import type { GetClubs } from "cc-common";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TbChevronDown, TbFilter, TbSearchOff, TbMoodConfuzed } from "react-icons/tb";
import { ClubCard, ClubCardSkeleton, Button, DropdownMenu, ClubsFilterModal } from "~/shared/components";
import { useQ } from "~/shared/hooks";
import { useGetClubs } from "~/lib/queries";
import { handleResponseError } from "~/lib/utils";

const Clubs: NextPageWithConfig = () => {
  const router = useRouter();
  const { query, append: appendToQuery, parse: parseQ } = useQ<GetClubs["query"]>();

  const [activeSortIndex, setActiveSortIndex] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const { data: clubs, ...clubsQuery } = useGetClubs(
    { query: parseQ(router.asPath), params: undefined, body: undefined },
    {
      keepPreviousData: true,
      onError: (e) => handleResponseError(e, "Unable to fetch clubs"),
    }
  );

  const sortMenuItems: { label: string; value: GetClubs["query"]["sort"] }[] = [
    { label: "Newest", value: "new" },
    { label: "Oldest", value: "old" },
    { label: "A-Z", value: "name-asc" },
    { label: "Z-A", value: "name-desc" },
  ];

  const handleApplySort = (i: number) => {
    setActiveSortIndex(i);
    appendToQuery({ sort: sortMenuItems[i].value });
  };

  useEffect(() => {
    setActiveSortIndex(query.sort ? sortMenuItems.findIndex((item) => item.value === query.sort) : 0);
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
            style={{ width: "fit-content", height: "3rem" }}
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
              style={{ width: "fit-content", height: "3rem" }}
            >
              Sort by {sortMenuItems[activeSortIndex]?.label}
            </DropdownMenu.Button>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
        {clubsQuery.isSuccess ? (
          clubs?.length !== 0 ? (
            clubs?.map((club, i) => <ClubCard key={i} {...club} />)
          ) : (
            <div className="flex w-full border border-black-20 h-60 col-span-3 rounded-md">
              <div className="flex flex-col items-center justify-center w-full">
                <TbSearchOff className="text-black-30 w-8 h-8 mb-3" />
                <h1 className="text-2xl font-bold">No clubs found</h1>
                <p className="text-black-60 text-sm">Try changing your filters or sorting.</p>
              </div>
            </div>
          )
        ) : clubsQuery.isLoading ? (
          Array.from({ length: 9 }).map((_, i) => <ClubCardSkeleton key={i} />)
        ) : (
          <div className="flex w-full border border-red-20 bg-red-10/50 h-60 col-span-3 rounded-md">
            <div className="flex flex-col items-center justify-center w-full">
              <TbMoodConfuzed className="text-red-30 w-8 h-8 mb-3" />
              <h1 className="text-2xl font-bold text-red-70">Something went wrong</h1>
              <p className="text-red-70 text-sm">An error occurred getting the clubs, please try again later.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Clubs.layout = { view: "standard", config: {} };

export default Clubs;
