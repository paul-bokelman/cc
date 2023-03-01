import type { Children } from '~/shared/types';
import type { View } from '.';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Logo, Button, MobileNavigationModal } from '~/shared/components';
import { TbMenu2 } from 'react-icons/tb';

export type StandardLayout = {
  view: View.STANDARD | 'standard';
  config: StandardLayoutConfig;
};

export type StandardLayoutConfig = {
  // needs config
};

type Props = { config: StandardLayout['config'] } & { children: Children };

export const StandardLayout: React.FC<Props> = ({ config, children }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const links = [
    { label: 'Home', dest: '/' },
    { label: 'Clubs', dest: '/clubs' },
    { label: 'Dashboard', dest: '/dashboard' },
    { label: 'About', dest: '/about' },
  ];

  const footerLinks = [
    // UPDATES LINKS
    { label: 'Twitter', dest: '/link' },
    { label: 'Instagram', dest: '/link' },
    { label: 'About Us', dest: '/link' },
    { label: 'Contact Us', dest: '/link' },
    { label: 'Contact ASB', dest: '/link' },
  ];

  //! HAMBURGER MENU

  return (
    <div
      style={{ minHeight: '100vh' }}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        style={{ minHeight: '100vh' }} // dumb hack to make the layout work
        className="flex h-full w-full flex-col items-center justify-between gap-6 py-12 px-4 md:px-12 lg:max-w-[85rem] lg:px-4"
      >
        <div className="flex h-full w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            {/* LOGO */}
            <Logo withText />
            {/* NAV */}
            <div className="hidden items-center gap-6 md:flex">
              {links.map((link) => {
                const isActive =
                  link.dest === '/'
                    ? router.pathname === '/'
                    : router.pathname.includes(link.dest);
                return (
                  <Link
                    key={link.label}
                    href={link.dest}
                    className="group relative"
                  >
                    <span
                      className={cn(
                        { 'font-medium text-blue-70': isActive },
                        'text-sm transition-colors group-hover:text-blue-60'
                      )}
                    >
                      {link.label}
                    </span>
                    <div
                      className={cn(
                        { 'bg-blue-70': isActive },
                        'absolute h-[3px] w-[20px] rounded-[1px] transition-all duration-300 ease-in-out group-hover:bg-blue-20'
                      )}
                    />
                  </Link>
                );
              })}
            </div>
            {/* USER */}
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" link href="/login">
                Login
              </Button>
              <Button disabled variant="primary">
                Signup
              </Button>
            </div>
            <div className="flex md:hidden">
              <TbMenu2
                className="cursor-pointer text-2xl text-black"
                onClick={() => setMenuOpen(true)}
              />
              <MobileNavigationModal
                isOpen={menuOpen}
                links={links}
                closeModal={() => setMenuOpen(false)}
              />
            </div>
          </div>
          <div className="flex h-full w-full justify-start">{children}</div>
        </div>
        {/* FOOTER */}
        <div className="mt-12 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo withText={false} size={14} />
            <span className="text-sm">
              Club Compass - Redefining Club Discovery
            </span>
          </div>
          <div className="flex items-center gap-3">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.dest}>
                <span className="text-sm text-black transition-colors hover:text-blue-60">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
