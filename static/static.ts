import { GatewayIntentBits } from "discord.js";
import { Commands } from "../commands/commands.js";

export enum ClanInfo {
  CLAN_ID = "31259536",
  NVIDIA_LINK = "https://www.nvidia.com/Download/index.aspx?utm_source=chatgpt.com",
}

export enum BotInfo {
  API_VERSION = "10",
}

export enum BlackoutBotEvents {
  INTERACTION_CREATE = "interactionCreate",
  BOT_READY = "ready",
}

export const blackout_bot_config = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
};

export type ChannelKey =
  | "task-helper-autorole"
  | "community-autorole"
  | "channel-logs";
export type RoleKey = "task-helper" | "community";

export const channels: Record<ChannelKey, { ID: string }> = {
  "channel-logs": { ID: "1514089293814042634" },
  "task-helper-autorole": { ID: "1514009044694859968" },
  "community-autorole": { ID: "1514362328420843701" },
};

export const roles: Record<RoleKey, { ID: string }> = {
  "task-helper": { ID: "1513988827922825266" },
  community: { ID: "1513979358057074730" },
};

export const commands = [
  {
    name: "clan_id",
    description: "Showing current id of blackout clan!",
  },
  {
    name: "nvidia",
    description: "Download latest NVIDIA Drivers!",
  },
  {
    name: "clan-data",
    description: "Get live data about Blackout Clan",
  },
  {
    name: "investigate",
    description: "Get live data about Blackout Clan",
  },
  [Commands.investigate].map((cmd) => cmd.toJSON()),
];
