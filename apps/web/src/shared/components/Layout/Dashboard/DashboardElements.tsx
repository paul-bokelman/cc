import type { Children } from '~/shared/types';
import NextLink from 'next/link';
import cn from 'classnames';
import { type ButtonProps, Button, ClubCompassLogo } from '~/shared/components';

type DashboardHeaderProps = {
  title: string;
  description: string;
  actions?: Array<ButtonProps>;
  divider?: boolean;
};

// container loader and error, also children loader and error

type DashboardContainerProps = {
  children: Array<JSX.Element>;
  state: 'loading' | 'error' | 'success';
};

// alias as C
export const DashboardContainer: React.FunctionComponent<DashboardContainerProps> & {
  Header: React.FC<DashboardHeaderProps>;
  Section: React.FC<DashboardSectionProps>;
  Navigation: React.FC<DashboardNavigationProps>;
} = ({ state = 'loading', children }): JSX.Element => {
  if (!children) throw new Error('DashboardContainer requires children');

  if (state === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <ClubCompassLogo className="animate-pulse text-5xl" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 bg-red-10/50">
        <h2 className="text-3xl font-semibold text-red-70">
          Something went wrong
        </h2>
        <p className="text-sm text-red-70">
          An error occurred fetching this data, please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col gap-4 overflow-y-scroll p-10">
      {children}
    </div>
  );
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  actions,
  divider = true,
}) => {
  return (
    <>
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-black-60">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {actions && actions.length !== 0 ? (
            <div className="flex gap-2">
              {actions.map((props, i) => (
                <Button key={i} {...props} style={{ height: '46px' }} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {divider ? <div className="mt-2 h-[1px] w-full bg-black-10" /> : null}
    </>
  );
};

type DashboardSectionProps = {
  title: string;
  description: string;
  divider?: boolean;
  style?: React.CSSProperties;
  containerClass?: string;
  childClass?: string;
  children: Children;
};

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  divider = true,
  style = {},
  containerClass,
  childClass,
  children,
}) => {
  const classes = cn('mt-6 flex w-full flex-col gap-6', containerClass);
  return (
    <div style={style} className={classes}>
      <div className="flex flex-col gap-2 ">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-black-60">{description}</p>
      </div>
      {divider ? <div className="h-[1px] w-full bg-black-10" /> : null}
      <div className={childClass}>{children}</div>
    </div>
  );
};

type DashboardNavigationProps = {
  links: Array<{
    label: string;
    query?: string;
    dest?: string;
    disabled?: boolean;
    active?: boolean;
  }>;
};

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  links,
}) => {
  //   <VStack align="center" pos="relative">
  //   <NextLink href={href} passHref>
  //     <Link
  //       fontSize="sm"
  //       fontWeight="medium"
  //       color={active ? "primary.500" : "#465467"}
  //       py={1}
  //       px={2}
  //       rounded="md"
  //       _hover={{ bg: active ? "primary.50" : "gray.100" }}
  //     >
  //       {label}
  //     </Link>
  //   </NextLink>
  //   {active && (
  //     <Box
  //       zIndex={50}
  //       pos="absolute"
  //       w="calc(100% + -0.8rem)"
  //       bottom="-6.25px"
  //       rounded="md"
  //       h="2.5px"
  //       bg="primary.500"
  //     />
  //   )}
  // </VStack>

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {links.map((link) => (
          <div className="relative flex items-center">
            <NextLink
              href={{ query: link.query }}
              aria-disabled={link.disabled}
              className={cn(
                {
                  'text-blue-70 hover:bg-blue-10/50': link.active,
                  'pointer-events-none text-black-30 hover:bg-transparent':
                    link.disabled,
                },
                'rounded-md py-1 px-3 hover:bg-black-10'
              )}
            >
              {link.label}
            </NextLink>
            {link.active ? (
              <div className="absolute bottom-[-9.5px] z-10 h-[2px] w-full rounded-md bg-blue-70" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="h-[1px] w-full rounded-md bg-black-20" />
    </div>
  );
};

DashboardContainer.Header = DashboardHeader;
DashboardContainer.Section = DashboardSection;
DashboardContainer.Navigation = DashboardNavigation;
