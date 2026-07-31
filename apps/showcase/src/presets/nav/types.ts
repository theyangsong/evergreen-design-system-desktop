export type NavBarPresetModule = {
  id: string;
  label: string;
  icon: string;
  focusIcon: string;
  showReddot?: boolean;
};

export type NavBarPresetUtility = {
  label: string;
  icon: string;
};

export type NavBarPresetConfig = {
  showDivider: boolean;
  showSystemButtons: boolean;
  split: boolean;
  corporation: { label: string };
  avatar: { initials: string };
  modules: NavBarPresetModule[];
  appEntries: NavBarPresetModule[];
  utilities: NavBarPresetUtility[];
};
