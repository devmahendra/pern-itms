import React from "react";
import authRoute from "./authRoute";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  {
    key: "home",
    path: "/home",
    component: React.lazy(() => import("views/Home")),
    authority: [],
  },
  {
    key: "project.dashboard",
    path: "/project/dashboard",
    component: React.lazy(() => import("views/Project/Dashboard")),
    authority: [],
  },
  {
    key: "project.create",
    path: "/project/create-project",
    component: React.lazy(() => import("views/Project/CreateProject")),
    authority: [],
  },
  {
    key: "project.resource",
    path: "/project/resource-project/:id",
    component: React.lazy(() => import("views/Project/ResourceProject")),
    authority: [],
  },
  {
    key: "project.task",
    path: "/project/task-project/:id",
    component: React.lazy(() => import("views/Project/TaskProject")),
    authority: [],
  },
];
