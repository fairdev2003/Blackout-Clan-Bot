import { GatewayIntentBits } from "discord.js";
export declare enum ClanInfo {
    CLAN_ID = "31259536",
    NVIDIA_LINK = "https://www.nvidia.com/Download/index.aspx?utm_source=chatgpt.com"
}
export declare enum BotInfo {
    API_VERSION = "10"
}
export declare enum BlackoutBotEvents {
    INTERACTION_CREATE = "interactionCreate",
    BOT_READY = "ready"
}
export declare const blackout_bot_config: {
    intents: GatewayIntentBits[];
};
export declare const commands: {
    name: string;
    description: string;
}[];
//# sourceMappingURL=static.d.ts.map