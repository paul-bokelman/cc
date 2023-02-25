import type { FC, ReactNode } from "react";
import { StandardLayout, DashboardLayout } from ".";

export enum View {
  STANDARD = "standard",
  DASHBOARD = "dashboard",
  NONE = "none",
}
export type Layouts =
  | StandardLayout
  | DashboardLayout
  | { view: View.NONE | "none" };

export type Layout = { layout: Layouts };

interface Props {
  layout: Layouts | undefined;
  children: ReactNode;
}

export const Layout: FC<Props> = ({ layout, children }) => {
  if (!layout) return <>{children}</>;

  if (layout.view === "dashboard") {
    return <DashboardLayout config={layout.config}>{children}</DashboardLayout>;
  }

  if (layout.view === "standard") {
    return <StandardLayout config={layout.config}>{children}</StandardLayout>;
  }

  return <>{children}</>;
};
