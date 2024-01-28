import type { BaseModalProps } from "."; // should be on base modal
import { Fragment, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@uidotdev/usehooks";
import cn from "classnames";
import { Dialog, Transition } from "@headlessui/react";
import { TbSearch, TbLoader, TbArrowBigRightFilled, TbUserCheck, TbFileText, TbUserX } from "react-icons/tb";
import { useSearchClubs } from "~/lib/queries";
import { Button, Pill, Tag } from "~/shared/components";

type ClubSearchModalProps = BaseModalProps & {};

export const ClubSearchModal: React.FC<ClubSearchModalProps> = ({ isOpen, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data: clubs, status } = useSearchClubs(
    { query: { searchQuery: debouncedSearchQuery }, params: undefined, body: undefined },
    {
      keepPreviousData: true,
      enabled: searchQuery.length > 2 && debouncedSearchQuery.length > 2 && debouncedSearchQuery.length !== 0,
    }
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const highlightQuery = (text: string) => {
    const regex = new RegExp(searchQuery, "gi");
    return text.replace(regex, (match) => `<span class="text-blue-50">${match}</span>`);
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

        <div className="fixed lg:top-32 inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-2xl transform flex-col gap-4 overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <div
                  className={cn("flex items-center justify-between box-border py-6 px-8", {
                    "border-b border-black-20": searchQuery.length > 0,
                  })}
                >
                  <div className="flex items-center gap-3">
                    {/* replace with loading spinner when loading */}
                    {status === "loading" ? (
                      <TbLoader className="animate-spin h-6 w-6 stroke-[3] text-black-60" />
                    ) : (
                      <TbSearch className="h-6 w-6 stroke-[3] text-black-60" />
                    )}
                    <input
                      value={searchQuery}
                      onChange={handleQueryChange}
                      className="w-[25rem] text-2xl font-medium text-black focus:outline-none"
                      placeholder="Search for a club..."
                    />
                  </div>
                  <Button variant="secondary" size="small" onClick={closeModal}>
                    Close
                  </Button>
                </div>
                {debouncedSearchQuery.length > 0 && (
                  <div className="-mx-4 flex max-h-[34rem] lg:max-h-[28rem] flex-col overflow-y-scroll pb-6 px-8">
                    {/* CLUB PREVIEWS */}
                    {status === "error" && (
                      <p className="ml-4 text-red-60">Something went wrong, please try again later.</p>
                    )}

                    {debouncedSearchQuery.length < 3 && (
                      <p className="ml-4 text-black-60">Please enter at least 3 characters to search...</p>
                    )}

                    {status === "loading" && <>test</>}

                    {status === "success" && debouncedSearchQuery.length > 2 ? (
                      clubs?.length === 0 ? (
                        <p className="ml-4 text-black-60">
                          No results found for <span className="italic">"{debouncedSearchQuery}"</span>
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm ml-4 text-black-60">
                            Found {clubs.length} club{clubs.length > 1 && "s"} matching{" "}
                            <span className="italic">"{debouncedSearchQuery}"</span>
                          </p>
                          <div className="flex flex-col gap-2">
                            {clubs.map((club) => (
                              <Link
                                key={club.name}
                                href={`/clubs/${club.slug}`}
                                className={cn(
                                  "relative group flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl py-4 px-4 border border-black-20 shadow-sm hover:bg-black-10/80"
                                )}
                              >
                                <div className="flex items-start gap-3 w-3/4">
                                  <div className="-mt-1 flex flex-col w-full">
                                    <p className="text-lg font-medium text-black">
                                      <span dangerouslySetInnerHTML={{ __html: highlightQuery(club.name) }} />
                                    </p>
                                    <div className="flex items-center gap-2 my-1">
                                      {club.tags?.map((tag) => (
                                        <Tag key={tag.name} name={tag.name} active={false} variant="inline" />
                                      ))}
                                    </div>
                                    <p className="text-sm text-black-60">
                                      {!club.description
                                        ? "No description provided."
                                        : club?.description.length > 140
                                        ? `${club.description.substring(0, 140)}...`
                                        : club.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Pill type="status" status={club.status} />
                                      {club.availability === "OPEN" || club.availability === "APPLICATION" ? (
                                        <TbUserCheck className="text-xl text-black-60" />
                                      ) : null}
                                      {club.availability === "APPLICATION" ? (
                                        <TbFileText className="text-xl text-black-60" />
                                      ) : null}
                                      {club.availability === "CLOSED" ? (
                                        <TbUserX className="text-xl text-black-60" />
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                                <TbArrowBigRightFilled className="absolute hidden group-hover:flex text-black-60 right-10" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    ) : null}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
