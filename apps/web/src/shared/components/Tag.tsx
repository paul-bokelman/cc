import { type IconType } from "react-icons";
import cn from "classnames";
import {
  TbAtom,
  TbBallAmericanFootball,
  TbMath,
  TbBuildingCastle,
  TbBuildingPavilion,
  TbButterfly,
  TbFriends,
  TbHeartHandshake,
  TbTag,
  TbMusic,
  TbPalette,
  TbWriting,
  TbCpu,
  TbBriefcase,
  TbShieldHeart,
  TbSpeakerphone,
  TbMessages,
} from "react-icons/tb";

type Props = {
  variant: "filter" | "inline" | "icon";
  size?: "sm" | "md" | "lg";
  name: string; // one of defined tags
  active: boolean;
  className?: string;
  onClick?: () => void;
};

export type TagNames = (typeof registeredTagNames)[number];

type Tags = { [name in TagNames]: { icon: IconType } };

export const registeredTagNames = [
  "sports",
  "science",
  "history",
  "culture",
  "volunteering",
  "social justice",
  "debate",
  "health",
  "community",
  "environment",
  // "faith",
  "career",
  "technology",
  "art",
  "problem solving",
  "music",
  "writing",
  "awareness",
  // "dance",
] as const;

export const tags: Tags = {
  sports: { icon: TbBallAmericanFootball },
  science: { icon: TbAtom },
  history: { icon: TbBuildingCastle },
  culture: { icon: TbBuildingPavilion },
  environment: { icon: TbButterfly },
  music: { icon: TbMusic },
  volunteering: { icon: TbHeartHandshake },
  "problem solving": { icon: TbMath },
  art: { icon: TbPalette },
  community: { icon: TbFriends },

  "social justice": { icon: TbHeartHandshake },
  awareness: { icon: TbSpeakerphone },
  debate: { icon: TbMessages },
  health: { icon: TbShieldHeart },
  // faith: { icon: TbHeartHandshake },
  career: { icon: TbBriefcase },
  // dance: { icon: TbHeartHandshake },
  technology: { icon: TbCpu },
  writing: { icon: TbWriting },
};

// CLEAN THIS UP

export const Tag: React.FC<Props> = ({ variant, size = "sm", name, active, className, onClick }) => {
  const tag = tags[name as keyof Tags] ?? { icon: TbTag };
  if (variant === "filter") {
    return (
      <div
        className={cn(
          { "bg-blue-10": active, "hover:bg-black-10": !active },
          "cursor-pointer rounded-xl py-2 px-3 transition-colors"
        )}
        onClick={onClick}
      >
        <div className={cn({ "text-blue-70": active, "text-black-70": !active }, "flex items-center gap-2")}>
          <tag.icon className="text-xl" />
          <span className="capitalize">{name}</span>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          {
            "gap-1 px-1.5 py-0.5": size === "sm",
            "px-2 py-1": size === "md",
            "rounded-lg px-3 py-2": size === "lg",
            "cursor-pointer": typeof onClick !== "undefined",
            "border-blue-70 bg-blue-10/50 text-blue-70": active,
            "border-black-20 text-black-70": !active,
          },
          "inline-flex w-fit items-center justify-center gap-2 rounded-md border"
        )}
        onClick={onClick}
      >
        <tag.icon
          className={cn("stroke-2", {
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-lg": size === "lg",
          })}
        />
        <span
          className={cn("font-medium capitalize whitespace-nowrap", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}
        >
          {name}
        </span>
      </div>
    );
  }

  if (variant === "icon") {
    return <tag.icon className={className} />;
  }
  throw new Error("Invalid variant");
};
