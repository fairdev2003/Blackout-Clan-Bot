import type { AutoRoleBundle } from "../types/autorole.types.js";
import { channels, roles } from "./static.js";

export const autorole_instance: AutoRoleBundle = {
  "task-helper": {
    channelId: channels["task-helper-autorole"].ID,
    roleId: roles["task-helper"].ID,
  },
  community: {
    channelId: channels["community-autorole"].ID,
    roleId: roles["community"].ID,
  },
};
