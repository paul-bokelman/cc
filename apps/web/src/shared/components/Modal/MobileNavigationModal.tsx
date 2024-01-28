import { Fragment } from "react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import cn from "classnames";
import { Dialog, Transition } from "@headlessui/react";
import { Logo } from "~/shared/components";
import { TbBugFilled, TbX } from "react-icons/tb";

export type BaseModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

type MobileNavigationModalProps = BaseModalProps & {
  links: Array<{ label: string; dest: string }>;
};

export const MobileNavigationModal: React.FC<MobileNavigationModalProps> = ({ isOpen, links, closeModal }) => {
  const router = useRouter();
  Router.events.on("routeChangeComplete", closeModal);

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
          <div className="fixed inset-0 bg-white bg-opacity-100" />
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
              <Dialog.Panel className="flex w-full max-w-md transform flex-col gap-4 px-4 text-left align-middle transition-all">
                <div className="flex w-full items-start justify-between">
                  <Logo dest="/" mobile beta size={48} />
                  <TbX
                    className="h-12 w-12 cursor-pointer rounded-full bg-black-10 p-2 text-4xl text-black-80"
                    onClick={closeModal}
                  />
                </div>
                <div className="mt-12 flex flex-col gap-7">
                  {links.map((link) => {
                    const isActive = link.dest === "/" ? router.pathname === "/" : router.pathname.includes(link.dest);
                    return (
                      <Link
                        key={link.label}
                        href={link.dest}
                        className={cn(
                          {
                            "font-bold text-blue-70 ": isActive,
                            "text-black-60 hover:text-blue-50": !isActive,
                          },
                          "cursor-pointer text-5xl transition-colors"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeOCpVR9gMrJdmiWxldIzWXKRrcg_iUMLeGxMWsSJ1PjTElmQ/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-8 cursor-pointer text-2xl text-red-500 transition-colors underline"
                >
                  <TbBugFilled />
                  <span>Report bug</span>
                </a>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
