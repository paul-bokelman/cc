import type { IconType } from 'react-icons';
import type { Children } from '~/shared/types';
import type { View } from '..';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import {
  TbHome,
  TbFolder,
  TbUsers,
  TbSettings,
  TbLifebuoy,
} from 'react-icons/tb';
import { Logo, ConditionalWrapper } from '~/shared/components';

export type DashboardLayout = {
  view: View.DASHBOARD | 'dashboard';
  config: DashboardLayoutConfig;
};

export type DashboardLayoutConfig = {
  // needs config
};

type Props = { config: DashboardLayout['config'] } & { children: Children };

type DashboardLink = {
  icon: IconType;
  label: string;
  dest: string;
  disabled?: boolean;
};

export const DashboardLayout: React.FC<Props> = ({ config, children }) => {
  const router = useRouter();

  // different routes based on role
  const links: Array<DashboardLink> = [
    { icon: TbHome, label: 'Home', dest: '/admin', disabled: true },
    { icon: TbFolder, label: 'Clubs', dest: '/admin/clubs' },
    { icon: TbUsers, label: 'Users', dest: '/admin/users', disabled: true },
  ];

  const standardLinks: Array<DashboardLink> = [
    {
      icon: TbLifebuoy,
      label: 'Support',
      dest: '/admin/support',
      disabled: true,
    }, // func
    {
      icon: TbSettings,
      label: 'Settings',
      dest: '/admin/settings',
      disabled: true,
    },
  ];

  return (
    <div className="flex">
      <div className="flex h-screen min-w-[280px] flex-col border-r border-black-20 p-10">
        <div className="flex h-full flex-col gap-4">
          <Logo withText />
          <div className="h-[1px] w-12 bg-black-20" />
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-1">
              {links.map((link, i) => (
                <SidebarItem
                  key={link.label}
                  {...link}
                  active={
                    link.label === 'Home'
                      ? router.pathname === '/admin'
                      : router.pathname.includes(link.dest)
                  }
                />
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {standardLinks.map((link, i) => (
                <SidebarItem
                  key={link.label}
                  {...link}
                  active={router.pathname.includes(link.dest)}
                />
              ))}
            </div>
          </div>
          <div className="my-2 h-[1px] bg-black-20" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-black-40" />
            <div className="flex flex-col items-start gap-1">
              <span className="text-lg font-semibold text-black">
                ASB Admin
              </span>
              <button className="text-sm font-medium text-red-50 hover:underline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

const SidebarItem: React.FC<DashboardLink & { active: boolean }> = ({
  icon: Icon,
  label,
  dest,
  disabled,
  active,
}) => {
  return (
    <ConditionalWrapper
      condition={typeof disabled === 'undefined' || !disabled}
      wrapper={(children) => <Link href={dest}>{children}</Link>}
    >
      <div
        className={cn(
          '-ml-4 flex items-center gap-4 rounded-md py-3 pr-3 pl-4 transition-colors',
          {
            'bg-black-10/60': active,
            'cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
          }
        )}
      >
        <Icon
          className={cn('stroke-[2.5] text-xl', {
            'text-black-40': disabled,
            'text-black-60': !disabled,
          })}
        />
        <span
          className={cn('text-lg font-medium', {
            'text-black': active && !disabled,
            'text-black-80': !active && !disabled,
            'text-black-40': disabled,
          })}
        >
          {label}
        </span>
      </div>
    </ConditionalWrapper>
  );
};
