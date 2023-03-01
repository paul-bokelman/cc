import type { BaseModalProps } from '.'; // should be on base modal
import type { GetTags } from '@/cc';
import { useState, Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import qs from 'qs';
import { Dialog, Transition } from '@headlessui/react';
import { TbX } from 'react-icons/tb';
import { api } from '~/lib/api';
import { parseQ } from '~/lib/utils';
import { Button, Switch, Tag } from '~/shared/components';
import { Children } from '~/shared/types';

type ClubsFilterModalProps = BaseModalProps;

export const ClubsFilterModal: React.FC<ClubsFilterModalProps> = ({ isOpen, closeModal }) => {
  const router = useRouter();
  const q = parseQ(router.asPath)?.filter as { tags: string[]; tagMethod: 'exclusive' | 'inclusive' } | undefined;
  const [selectedTags, setSelectedTags] = useState<string[]>(q?.tags ?? []);
  const [tagFilteringMethod, setTagFilteringMethod] = useState<'exclusive' | 'inclusive'>(q?.tagMethod ?? 'inclusive');

  const { data: tags = [] } = useQuery<GetTags['payload'], Error>('tags', async () => await api.tags.all(), {
    onError: (e) => console.log(e),
  });

  const handleSelectTag = (name: string) => {
    if (selectedTags.includes(name)) {
      setSelectedTags(selectedTags.filter((p) => p !== name));
    } else {
      setSelectedTags((curr) => [...curr, name]);
    }
  };

  const handleApplyFilter = () => {
    const sort = parseQ(router.asPath)?.sort;
    const q = { sort, filter: { tags: selectedTags, tagMethod: tagFilteringMethod } };
    router.push({ query: qs.stringify(q) }, undefined, { shallow: true });
    closeModal();
  };

  const clearFilter = () => {
    const sort = parseQ(router.asPath)?.sort;
    setSelectedTags([]);
    setTagFilteringMethod('inclusive');
    router.push({ query: sort ? qs.stringify({ sort }) : {} }, undefined, { shallow: true });
  };

  //! Loading state

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-2xl transform flex-col gap-4 overflow-hidden rounded-2xl bg-white py-6 text-left align-middle shadow-xl transition-all">
                <div className="border-b border-gray-200 w-full grid grid-cols-3 pb-3 px-8">
                  <div className="flex w-full items-center h-full">
                    <TbX
                      className="text-lg cursor-pointer hover:text-black-60 transition-colors"
                      onClick={closeModal}
                    />
                  </div>
                  <p className="font-semibold w-full flex justify-center items-center">Filters</p>
                </div>
                <div className="max-h-96 flex flex-col gap-8 overflow-y-scroll px-8">
                  <FilterSection title="Tags" description="Inclusively or exclusively filter by selected tags">
                    <div className="flex flex-wrap w-full gap-2">
                      {tags?.map(({ name }) => (
                        <Tag
                          name={name}
                          variant="inline"
                          size="lg"
                          active={selectedTags.includes(name)}
                          onClick={() => handleSelectTag(name)}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Filtering Method</span>
                      <Switch
                        state={[tagFilteringMethod, setTagFilteringMethod]}
                        options={[
                          {
                            label: 'Inclusive',
                            value: 'inclusive',
                          },
                          {
                            label: 'Exclusive',
                            value: 'exclusive',
                          },
                        ]}
                      />
                    </div>
                  </FilterSection>
                </div>
                <div className="border-t border-gray-200 w-full grid grid-cols-2 pt-3 px-8">
                  <div className="w-full flex justify-start">
                    <Button
                      variant="ghost"
                      style={{ width: 'fit-content', paddingLeft: 0, paddingRight: 0 }}
                      onClick={clearFilter}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="w-full flex justify-end">
                    <Button variant="primary" style={{ width: 'fit-content' }} onClick={handleApplyFilter}>
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const FilterSection: React.FC<{
  title: string;
  description?: string;
  children: Children;
}> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-black-60">{description}</p>
      </div>
      {children}
    </div>
  );
};
