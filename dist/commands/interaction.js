import { BlackoutBotEvents, ClanInfo } from "../static/static.js";
export class InteractionEvent {
    client;
    constructor(client) {
        this.client = client;
    }
    async InteractionCommands(interaction) {
        if (!interaction.isChatInputCommand())
            return;
        if (interaction.commandName === "clan_id") {
            await interaction.reply(ClanInfo.CLAN_ID);
        }
        if (interaction.commandName === "nvidia") {
            await interaction.reply(ClanInfo.NVIDIA_LINK);
        }
    }
    async RegisterInteractionCommands() {
        this.client.on(BlackoutBotEvents.INTERACTION_CREATE, async (interaction) => {
            await this.InteractionCommands(interaction);
        });
    }
}
//# sourceMappingURL=interaction.js.map