import { GatewayIntentBits } from "discord.js";

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
  intents: [GatewayIntentBits.Guilds],
};

type BlackoutChannel = "channel-logs";
type BlackoutChannelRecord = Record<
  BlackoutChannel,
  {
    ID: string;
  }
>;

export const channels: BlackoutChannelRecord = {
  "channel-logs": { ID: "1514089293814042634" },
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
];
