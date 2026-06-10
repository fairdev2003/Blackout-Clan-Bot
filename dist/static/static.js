import { GatewayIntentBits } from "discord.js";
export var ClanInfo;
(function (ClanInfo) {
    ClanInfo["CLAN_ID"] = "31259536";
    ClanInfo["NVIDIA_LINK"] = "https://www.nvidia.com/Download/index.aspx?utm_source=chatgpt.com";
})(ClanInfo || (ClanInfo = {}));
export var BotInfo;
(function (BotInfo) {
    BotInfo["API_VERSION"] = "10";
})(BotInfo || (BotInfo = {}));
export var BlackoutBotEvents;
(function (BlackoutBotEvents) {
    BlackoutBotEvents["INTERACTION_CREATE"] = "interactionCreate";
    BlackoutBotEvents["BOT_READY"] = "ready";
})(BlackoutBotEvents || (BlackoutBotEvents = {}));
export const blackout_bot_config = {
    intents: [GatewayIntentBits.Guilds],
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
//# sourceMappingURL=static.js.map