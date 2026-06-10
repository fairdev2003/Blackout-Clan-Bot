import type { Client, Interaction } from "discord.js";
import { BlackoutBotEvents, ClanInfo } from "../static/static.js";

export class InteractionEvent {
  constructor(private client: Client<boolean>) {}

  private async InteractionCommands(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "clan_id") {
      await interaction.reply(ClanInfo.CLAN_ID);
    }

    if (interaction.commandName === "nvidia") {
      await interaction.reply(ClanInfo.NVIDIA_LINK);
    }
  }

  public async RegisterInteractionCommands() {
    this.client.on(
      BlackoutBotEvents.INTERACTION_CREATE,
      async (interaction: Interaction) => {
        await this.InteractionCommands(interaction);
      },
    );
  }
}
