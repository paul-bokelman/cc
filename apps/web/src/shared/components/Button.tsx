import type { IconType } from "react-icons";
import NextLink from "next/link";
import cn from "classnames";
import { TbLoader } from "react-icons/tb";

type Variants = "primary" | "secondary" | "danger" | "ghost";
type Sizes = "small" | "medium" | "large";
type State = "default" | "loading" | "disabled";

type BaseButtonProps = {
  variant?: Variants;
  size?: Sizes;
  loading?: boolean;
  iconRight?: IconType;
  iconLeft?: IconType;
  children: React.ReactNode;
};

export type ButtonProps = (
  | ({
      link: true;
      href: string;
      external?: boolean;
    } & React.ButtonHTMLAttributes<HTMLAnchorElement>)
  | ({
      link?: false;
      asChild?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>)
) &
  BaseButtonProps;

const variantStyles: { [key in Variants]: string } = {
  primary: "bg-blue-70 text-white hover:bg-blue-50 shadow-sm",
  secondary: "border border-black-20 bg-white text-black-70 shadow-sm hover:bg-black-10/40",
  danger: "bg-red-50 text-white hover:bg-red-70",
  ghost: "bg-transparent text-black hover:text-black-60",
};
const sizeStyles: { [key in Sizes]: string } = {
  small: "h-[36px] px-5 text-xs",
  medium: "h-[40px] px-6 text-sm",
  large: "h-[48px] px-6 text-sm",
};
const stateStyles: { [key in State]: string } = {
  default: "",
  disabled: "pointer-events-none opacity-50 shadow-none",
  loading: "pointer-events-none opacity-50",
};

//! CLEAN UP THIS FILE

export const Button: React.FC<ButtonProps & BaseButtonProps> = ({
  variant = "secondary",
  size = "medium",
  children: text,
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) => {
  const state = props.loading ? "loading" : props.disabled ? "disabled" : "default";

  const classes = cn(
    variantStyles[variant],
    stateStyles[state],
    sizeStyles[size],
    "flex items-center justify-center rounded-md transition-colors"
  );

  const children = (
    <>
      {IconLeft && !props.loading ? <IconLeft className="mr-2 text-sm" /> : null}
      {props.loading ? <TbLoader className="mr-2 animate-spin" /> : null}
      {text}
      {IconRight && !props.loading ? <IconRight className="ml-2 text-sm" /> : null}
    </>
  );

  if (props.link) {
    const { href, external, link, ...rest } = props;
    return !external ? (
      <NextLink href={href} className={classes} {...rest}>
        {children}
      </NextLink>
    ) : (
      <a href={href} className={classes} {...rest} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  const { loading: _, ...rest } = props; // have to separate because loading isn't a dom attribute...

  if (props.asChild) {
    return (
      <span className={classes} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};
