import cn from "classnames";
import { GetClub } from "cc-common";

type CommonProps = { variant?: "dot" | "pill" };

type VariantProps =
  | {
      type: "status";
      status: GetClub["payload"]["status"]; // hacky way of getting this...
    }
  | {
      type: "color";
      color: "green" | "orange" | "red" | "blue";
      text: string;
    };

type PillProps = CommonProps & VariantProps;

export const Pill: React.FC<PillProps> = (props) => {
  let color = "green";
  let text = "";
  let variant = props.variant ?? "pill";

  if (props.type === "status") {
    if (props.status === "ACTIVE") color = "green";
    else if (props.status === "INACTIVE") color = "orange";
    else if (props.status === "INTEREST") color = "red";

    text = props.status;
  } else if (props.type === "color") {
    color = props.color;
    text = props.text;
  }

  return (
    <div
      className={cn(
        `flex gap-2 items-center py-2 rounded-md border`,
        {
          "border-green-500/40 bg-green-500/10": color === "green",
          "border-orange-500/40 bg-orange-500/10": color === "orange",
          "border-red-500/40 bg-red-500/10": color === "red",
          "border-blue-500/40 bg-blue-500/10": color === "blue",
        },
        { "px-2": variant === "dot", "px-3": variant === "pill" }
      )}
    >
      <div
        className={cn("h-2 w-2 rounded-full", {
          "bg-green-500": color === "green",
          "bg-orange-500": color === "orange",
          "bg-red-500": color === "red",
          "bg-blue-500": color === "blue",
        })}
      />
      {variant === "pill" ? (
        <span className="text-xs font-medium">{text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}</span>
      ) : null}
    </div>
  );
};
