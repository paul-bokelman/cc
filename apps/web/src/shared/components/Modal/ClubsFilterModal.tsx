import type { BaseModalProps } from "."; // should be on base modal
import type { Children } from "~/shared/types";
import type { GetClubs } from "cc-common";
import { ClubStatus } from "@prisma/client"; // technically type
import { useState, Fragment } from "react";
import cn from "classnames";
import { Dialog, Transition } from "@headlessui/react";
import { TbX } from "react-icons/tb";
import { useGetTags } from "~/lib/queries";
import { Button, Switch, Tag } from "~/shared/components";
import { useQ } from "~/shared/hooks";
import { handleResponseError } from "~/lib/utils";

type ClubsFilterModalProps = BaseModalProps;

export const ClubsFilterModal: React.FC<ClubsFilterModalProps> = ({ isOpen, closeModal }) => {
  const { query, append: appendToQuery, clear: clearQuery } = useQ<GetClubs["query"]>();
  const [selectedStatuses, setSelectedStatuses] = useState<ClubStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(query?.filter?.tags ?? []);
  const [tagFilteringMethod, setTagFilteringMethod] = useState<"exclusive" | "inclusive">(
    query?.filter?.tagMethod ?? "inclusive"
  );

  const { data: tags = [], ...tagsQuery } = useGetTags(
    { body: undefined, params: undefined, query: undefined },
    { onError: (e) => handleResponseError(e, "Unable to fetch tags") }
  );

  const handleSelectTag = (name: string) => {
    if (selectedTags.includes(name)) {
      setSelectedTags((prev) => prev.filter((curr) => curr !== name));
    } else {
      setSelectedTags((prev) => [...prev, name]);
    }
  };

  const handleSelectStatus = (status: ClubStatus) => {
    if (!selectedStatuses.includes(status) && selectedStatuses.length !== 2) {
      setSelectedStatuses((prev) => [...prev, status]);
    } else {
      setSelectedStatuses((prev) => prev.filter((curr) => curr !== status));
    }
  };

  const handleApplyFilter = () => {
    appendToQuery({
      filter: { tags: selectedTags, tagMethod: tagFilteringMethod, status: selectedStatuses },
    });
    closeModal();
  };

  const clearFilter = () => {
    setSelectedTags([]);
    setTagFilteringMethod("inclusive");
    setSelectedStatuses([]);
    // appendToQuery({ filter: null });
    clearQuery("filter");
    closeModal(); // should close?
  };

  //! fails to filter fallback?

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

        <div className="fixed inset-0 overflow-y-auto mx-4">
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
                  <div className="flex w-full items-center">
                    <TbX
                      className="text-lg cursor-pointer hover:text-black-60 transition-colors"
                      onClick={closeModal}
                    />
                  </div>
                  <p className="font-semibold w-full flex justify-center items-center">Club Filters</p>
                </div>
                <div className="max-h-96 flex flex-col gap-8 overflow-y-scroll px-8">
                  <FilterSection title="Tags" description="Inclusively or exclusively filter by selected tags">
                    <div className="flex flex-wrap w-full gap-2">
                      {tagsQuery.isSuccess ? (
                        tags?.map(({ name }) => (
                          <Tag
                            key={name}
                            name={name}
                            variant="inline"
                            size="lg"
                            active={selectedTags.includes(name)}
                            onClick={() => handleSelectTag(name)}
                          />
                        ))
                      ) : (
                        <p className={cn({ "text-red-500": tagsQuery.isError || tagsQuery.isIdle }, "text-sm")}>
                          {tagsQuery.isLoading
                            ? "Loading tags..."
                            : tagsQuery.isError
                            ? "Something went wrong fetching the tags, please try again later."
                            : "Query has not been enabled, please contact support."}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Filtering Method</span>
                      <Switch
                        state={[tagFilteringMethod, setTagFilteringMethod]}
                        options={[
                          {
                            label: "Inclusive",
                            value: "inclusive",
                          },
                          {
                            label: "Exclusive",
                            value: "exclusive",
                          },
                        ]}
                      />
                    </div>
                  </FilterSection>
                  <FilterSection title="Status" description="Filter by 1-2 of the 3 status options">
                    <div className="w-full grid grid-cols-3 gap-4">
                      {(Object.keys(ClubStatus) as Array<keyof typeof ClubStatus>).map((status) => (
                        <div
                          key={status}
                          className={cn(
                            {
                              "bg-blue-10 border-blue-60 text-blue-60 hover:bg-blue-10":
                                selectedStatuses.includes(status),
                              "opacity-50 pointer-events-none":
                                !selectedStatuses.includes(status) && selectedStatuses.length === 2,
                            },
                            "flex capitalize justify-center border p-2 rounded-md border-black-20 hover:bg-black-10 cursor-pointer"
                          )}
                          onClick={() => handleSelectStatus(status)}
                        >
                          <span>{status.toLowerCase()}</span>
                        </div>
                      ))}
                    </div>
                  </FilterSection>
                </div>
                <div className="border-t border-gray-200 w-full grid grid-cols-2 pt-3 px-8">
                  <div className="w-full flex justify-start">
                    <Button
                      variant="ghost"
                      style={{ width: "fit-content", paddingLeft: 0, paddingRight: 0 }}
                      onClick={clearFilter}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="w-full flex justify-end">
                    <Button variant="primary" style={{ width: "fit-content" }} onClick={handleApplyFilter}>
                      Show Clubs
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
