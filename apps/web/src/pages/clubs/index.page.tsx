import type { NextPageWithConfig } from "~/shared/types";
import type { GetClubs } from "cc-common";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TbChevronDown, TbFilter, TbSearchOff, TbMoodConfuzed, TbSearch } from "react-icons/tb";
import {
  ClubCard,
  ClubCardSkeleton,
  Button,
  DropdownMenu,
  ClubsFilterModal,
  ClubSearchModal,
} from "~/shared/components";
import { useQ } from "~/shared/hooks";
import { useGetClubs } from "~/lib/queries";
import { handleResponseError } from "~/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";

const Clubs: NextPageWithConfig = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { query, append: appendToQuery, parse: parseQ } = useQ<GetClubs["query"]>();

  const [activeSortIndex, setActiveSortIndex] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  const isMobile = width && width < 640;

  const cq = useGetClubs(
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
      <p className="-my-2 text-black-60 ">Select your interests and find the perfect club for you.</p>
      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              iconLeft={TbFilter}
              style={{ width: "fit-content", height: "3rem", paddingLeft: isMobile ? "30px" : undefined }}
              onClick={() => setShowFilterModal(true)}
            >
              {!isMobile ? "Filters" : null}
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
                {!isMobile ? `Sort by ${sortMenuItems[activeSortIndex]?.label}` : "Sort"}
              </DropdownMenu.Button>
            </DropdownMenu>
          </div>
          <Button
            variant="secondary"
            iconLeft={TbSearch}
            style={{ width: "fit-content", height: "3rem", paddingLeft: isMobile ? "30px" : undefined }}
            onClick={() => setShowSearchModal(true)}
          >
            {!isMobile ? "Search..." : null}
          </Button>
          <ClubSearchModal isOpen={showSearchModal} closeModal={() => setShowSearchModal(false)} />
        </div>
      </div>
      {cq.isSuccess && (
        <p className="text-sm text-black-60 -my-4">
          Showing {cq.data.clubs!.length} out of {cq.data.totalClubs} total clubs
        </p>
      )}

      <div className="w-full grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cq.isSuccess ? (
          cq.data.clubs.length !== 0 ? (
            cq.data.clubs.map((club, i) => <ClubCard key={i} {...club} />)
          ) : (
            <div className="flex w-full border border-black-20 h-60 col-span-3 rounded-md">
              <div className="flex flex-col items-center justify-center w-full">
                <TbSearchOff className="text-black-30 w-8 h-8 mb-3" />
                <h1 className="text-2xl font-bold">No clubs found</h1>
                <p className="text-black-60 text-sm">Try changing or clearing your filters.</p>
              </div>
            </div>
          )
        ) : cq.isLoading ? (
          Array.from({ length: 9 }).map((_, i) => <ClubCardSkeleton key={i} />)
        ) : (
          <div className="flex w-full border border-red-20 bg-red-10/50 h-60 col-span-3 rounded-md">
            <div className="flex flex-col items-center justify-center w-full">
              <TbMoodConfuzed className="text-red-30 w-8 h-8 mb-3" />
              <h1 className="text-2xl font-bold text-red-70">Something went wrong</h1>
              <p className="text-red-70 text-sm mx-6 text-center">
                An error occurred getting the clubs, please try again later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Clubs.layout = { view: "standard", config: {} };

export default Clubs;
