import { FeatureMemLeaks } from "../../common/constants";
import { ComponentsTreePage } from "./ComponentsTree";
import { MaybeLeaksPage, MaybeLeaksPageBadge } from "./MaybeLeaks";

export const enum AppPage {
  ComponentTree = "component-tree",
  MaybeLeaks = "maybe-leaks",
}

export type AppPageConfig = {
  id: AppPage;
  title: string;
  disabled?: boolean;
  content: React.FunctionComponent;
  badge?: React.FunctionComponent;
};

export const pages: Record<AppPage, AppPageConfig> = {
  [AppPage.ComponentTree]: {
    id: AppPage.ComponentTree,
    title: "Component tree",
    content: ComponentsTreePage,
  },
  [AppPage.MaybeLeaks]: {
    id: AppPage.MaybeLeaks,
    title: "Memory leaks",
    disabled: !FeatureMemLeaks,
    content: MaybeLeaksPage,
    badge: MaybeLeaksPageBadge,
  },
};
