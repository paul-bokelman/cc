import type { NextPageWithConfig } from '~/shared/types';
import type { GetClubs } from '@/cc';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { TbChevronDown, TbFilter } from 'react-icons/tb';
import { type Error } from '~/lib/api';
import { clubs as clubAPI } from '../../lib/api/club.api';
import {
  registeredTagNames,
  ClubCard,
  Button,
  DropdownMenu,
  ClubsFilterModal,
} from '~/shared/components';

const Clubs: NextPageWithConfig = () => {
  const tagContainer = useRef<HTMLDivElement>(null);

  const { data: clubs = [] } = useQuery<GetClubs['payload'], Error>(
    'clubs',
    async () => await clubAPI.all(),
    {
      retry: 0,
      onError: (e) => console.log(e),
      onSuccess: (d) => console.log(d),
    }
  );

  const [activeTagIndexes, setActiveTagIndexes] = useState<Array<number>>([]);
  const [activeSortIndex, setActiveSortIndex] = useState<number>(0);
  // const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(true);
  const [tagContainerOverflowDirection, setTagContainerOverflowDirection] =
    useState<'left' | 'right' | 'both'>('right');

  const handleSelectTag = (index: number) => {
    if (activeTagIndexes.includes(index)) {
      setActiveTagIndexes(activeTagIndexes.filter((i) => i !== index));
    } else {
      setActiveTagIndexes([...activeTagIndexes, index]);
    }
  };

  const visibleClubs = clubs.filter((club) => {
    if (activeTagIndexes.length === 0) return true;
    return club.tags.some((tag) =>
      activeTagIndexes.includes(registeredTagNames.indexOf(tag))
    );
  });

  const sortMenuItems = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'A-Z', value: 'a-z' },
    { label: 'Z-A', value: 'z-a' },
  ];

  useEffect(() => {
    const updateOverflowDirection = () => {
      if (tagContainer.current) {
        if (tagContainer.current.scrollLeft === 0) {
          return setTagContainerOverflowDirection('right');
        } else if (
          tagContainer.current.scrollLeft ===
          tagContainer.current.scrollWidth - tagContainer.current.offsetWidth
        ) {
          return setTagContainerOverflowDirection('left');
        }
        return setTagContainerOverflowDirection('both');
      }
    };

    if (tagContainer && tagContainer.current) {
      tagContainer.current.addEventListener('scroll', updateOverflowDirection);
    }

    return () => {
      tagContainer.current?.removeEventListener(
        'scroll',
        updateOverflowDirection
      );
    };
  }, []);

  const handleScrollTagContainer = (direction: 'left' | 'right') => {
    if (tagContainer.current) {
      if (direction === 'left') {
        tagContainer.current.scrollBy({
          left: tagContainer.current.offsetWidth,
          behavior: 'smooth',
        });
      } else {
        tagContainer.current.scrollBy({
          left: -tagContainer.current.offsetWidth,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="mt-12 flex w-full flex-col items-start justify-center gap-8">
      <h1 className="text-3xl font-bold leading-3">Discover Clubs</h1>
      <p className="leading-3 text-black-60 ">
        Select your interests and find the perfect club for you.
      </p>
      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        {/* <div className="relative w-full md:w-2/3">
          <AnimatePresence>
            {tagContainerOverflowDirection === 'left' ||
            tagContainerOverflowDirection === 'both' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute z-[5] flex h-full w-24 items-center bg-gradient-to-l from-transparent to-white"
              >
                <TbChevronRight
                  className="absolute left-1 h-5 w-5 rotate-180 transform cursor-pointer rounded-full border border-black-20 bg-white stroke-[3px] text-black transition-all hover:scale-110 hover:shadow-md"
                  onClick={() => handleScrollTagContainer('right')}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {tagContainerOverflowDirection === 'right' ||
            tagContainerOverflowDirection === 'both' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 z-[5] flex h-full w-24 items-center bg-gradient-to-r from-transparent to-white"
              >
                <TbChevronRight
                  className="absolute right-1 h-5 w-5 transform cursor-pointer rounded-full border border-black-20 bg-white stroke-[3px] text-black transition-all hover:scale-110 hover:shadow-md"
                  onClick={() => handleScrollTagContainer('left')}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div
            ref={tagContainer}
            className="scrollbar-hide relative flex w-full items-center gap-3 overflow-x-scroll border-t border-b border-black-20 py-2"
          >
            {registeredTagNames.map((name, i) => (
              <Tag
                key={name}
                name={name}
                variant="filter"
                active={activeTagIndexes.includes(i)}
                onClick={() => handleSelectTag(i)}
              />
            ))}
          </div>
        </div> */}
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

          <ClubsFilterModal
            isOpen={showFilterModal}
            closeModal={() => setShowFilterModal(false)}
          />

          <DropdownMenu
            items={sortMenuItems.map((item, i) => ({
              active: i === activeSortIndex,
              onClick: () => setActiveSortIndex(i),
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
          {/* <Button
            variant="secondary"
            iconLeft={TbSearch}
            style={{ width: 'fit-content', height: '3rem' }}
            onClick={() => setShowSearchModal(true)}
          >
            Search...
          </Button>
          <ClubSearchModal
            clubs={clubs}
            isOpen={showSearchModal}
            closeModal={() => setShowSearchModal(false)}
          /> */}
        </div>
      </div>
      <div className="mt-2 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {visibleClubs.length !== 0 ? (
          visibleClubs.map((club, i) => <ClubCard key={i} {...club} />)
        ) : (
          <p>No clubs matching current filter.</p>
        )}
      </div>
    </div>
  );
};

Clubs.layout = { view: 'standard', config: {} };

export default Clubs;
