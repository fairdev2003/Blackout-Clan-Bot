import type { RoleKey } from "../static/static.js";

export type AutoRoleBundle = Record<
  RoleKey,
  {
    channelId: string;
    roleId: string;
  }
>;
