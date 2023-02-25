import type { BaseModalProps } from '.'; // should be on base modal
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import { type ClubCardProps, Button, Tag } from '~/shared/components';
import { TbSearch, TbUserCheck, TbFileText } from 'react-icons/tb';

type ClubSearchModalProps = BaseModalProps & {
  clubs: Array<ClubCardProps>;
};

export const ClubSearchModal: React.FC<ClubSearchModalProps> = ({
  isOpen,
  clubs,
  closeModal,
}) => {
  const [query, setQuery] = useState('');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-2xl transform flex-col gap-4 overflow-hidden rounded-2xl bg-white py-6 px-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3">
                    <TbSearch className="h-6 w-6 stroke-[3] text-black-60" />
                    <input
                      value={query}
                      onChange={handleQueryChange}
                      className="w-[25rem] text-2xl font-medium text-black focus:outline-none"
                      placeholder="Search for a club"
                    />
                  </div>
                  <Button variant="ghost" onClick={closeModal}>
                    Close
                  </Button>
                </div>
                <AnimatePresence>
                  {query.length > 0 && (
                    <motion.div
                      className="-mx-4 flex max-h-72 flex-col overflow-y-scroll"
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: {
                            duration: 0.4,
                          },
                          opacity: {
                            duration: 0.25,
                            delay: 0.15,
                          },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: {
                            duration: 0.4,
                          },
                          opacity: {
                            duration: 0.25,
                          },
                        },
                      }}
                    >
                      {/* CLUB PREVIEWS */}
                      {clubs.map((club, i) => (
                        <Link
                          href="/clubs/slug"
                          className={cn(
                            'group flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl py-4 px-4 hover:bg-black-10/80'
                            // {
                            //   "border-t border-black-20": i !== 0,
                            // }
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Tag
                              name={club.tags[0]!}
                              active={false}
                              variant="icon"
                            />
                            <div className="-mt-1 flex flex-col">
                              <p className="text-lg font-medium text-black">
                                {club.name}
                              </p>
                              <p className="w-3/4 text-sm text-black-40">
                                {club.description.length > 140
                                  ? `${club.description.substring(0, 140)}...`
                                  : club.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <TbUserCheck className="text-xl text-black-80" />
                            <TbFileText className="text-xl text-black-80" />
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
