import type { Children } from "~/shared/types";
import type { IconType } from "react-icons";
import { Fragment } from "react";
import cn from "classnames";
import { Menu, Transition } from "@headlessui/react";
import { type ButtonProps, Button } from "~/shared/components";

type DropdownMenuProps = {
  children: Children;
  items: Array<DropdownItem>;
};

type DropdownItem = {
  label: string;
  icon?: IconType;
  onClick?: () => void;
  active: boolean;
};

export const DropdownMenu: React.FunctionComponent<DropdownMenuProps> & {
  Button: React.FC<ButtonProps>;
} = ({ items, children }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>{children}</div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 flex w-full origin-top-right flex-col gap-1 rounded-md border border-black-20 bg-white px-1 py-1 text-black-70 shadow-md">
          {items.map(({ label, active, icon: Icon, onClick }) => (
            <Menu.Item key={label}>
              <button
                onClick={onClick}
                className={cn(
                  { "bg-blue-10 font-medium text-blue-70": active },
                  "flex w-full items-center rounded-md bg-transparent px-3 py-2 text-sm capitalize text-black-60 hover:bg-black-10 hover:text-black-70"
                )}
              >
                {typeof Icon !== "undefined" && <Icon className="mr-2" />}
                {label}
              </button>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const DropdownMenuButton: React.FC<ButtonProps> = ({ children: text, ...props }) => (
  <Menu.Button>
    <Button {...props}>{text}</Button>
  </Menu.Button>
);

DropdownMenu.Button = DropdownMenuButton;
