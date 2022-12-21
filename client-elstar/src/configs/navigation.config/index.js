import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from "constants/navigation.constant";

const navigationConfig = [
  {
    key: "home",
    path: "/home",
    title: "Home",
    translateKey: "nav.home",
    icon: "home",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [],
    subMenu: [],
  },
  {
    key: "project",
    path: "",
    title: "Project",
    translateKey: "nav.project",
    icon: "project",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [],
    subMenu: [
      {
        key: "project.dashboard",
        path: "/project/dashboard",
        title: "Dashboard",
        translateKey: "nav.project.dashboard",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "project.create",
        path: "/project/create-project",
        title: "Create Project",
        translateKey: "nav.project.create",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
    ],
  },
];

export default navigationConfig;
