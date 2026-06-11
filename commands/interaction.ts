import {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type Client,
  type Interaction,
} from "discord.js";
import { BlackoutBotEvents, ClanInfo } from "../static/static.js";
import axios, { Axios, type AxiosResponse } from "axios";
import type { ClanData, ClanMember } from "../types/asteroid.js";

function findTopMember(data: ClanData): ClanMember | null {
  if (!data.members || data.members.length === 0) return null;

  return data.members.reduce((prev, current) => {
    return prev.valor > current.valor ? prev : current;
  });
}

function createClanEmbed(clan_data: ClanData): EmbedBuilder {
  const clan_info = clan_data.clan_info;

  const best_valor_member = findTopMember(clan_data);

  const embed = new EmbedBuilder()
    .setTitle(`${clan_info.clan_name}`)
    .setThumbnail(
      "https://api.klimson.dev/interface/bucket/blackout_bot/blkt_logo_64.png",
    )
    .setDescription(clan_info.clan_announcement || "No announcement set.")
    .setColor(0x8b0000)
    .addFields(
      {
        name: "👑 Leader Info",
        value: `**Name:** ${clan_info.leader_name}`,
        inline: false,
      },

      {
        name: "📊 Statistics",
        value: [
          `**Total Valor:** ${clan_info.valor_points.toLocaleString("en-US")}`,
          `**Region:** ${clan_info.continent}`,
          `**Division:** ${clan_info.division}`,
          `**Members:** ${clan_info.members_count}/50`,
        ].join("\n"),
        inline: false,
      },

      {
        name: "🏰 Fort & Tank",
        value: [
          `**Fort Power:** ${clan_info.fort_power.toLocaleString("en-US")}`,
          `**Fort Energy:** ${clan_info.fort_energy.toLocaleString("en-US")}`,
          `**Tank Power:** ${clan_info.tank_power.toLocaleString("en-US")}`,
          `**Tank Energy:** ${clan_info.tank_energy.toLocaleString("en-US")}`,
        ].join("\n"),
        inline: false,
      },

      {
        name: "🏅 Most Valor Member",
        value: `**${best_valor_member?.name}** with **${best_valor_member?.valor.toLocaleString("en-US")}** valor`,
        inline: false,
      },
    )

    .setFooter({
      text: "Blackout Asteroid Integration",
      iconURL: "https://asteroidpg3d.xyz/static/asteroid.gif",
    })
    .setURL("https://asteroidpg3d.xyz/")
    .setTimestamp();
  return embed;
}

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

    if (interaction.commandName === "clan-data") {
      await interaction.deferReply();

      try {
        const response = await axios.get(
          "https://api.klimson.dev/pg3d/clan_info/31259536",
        );

        const embed = createClanEmbed(response.data);

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.editReply({
          content: "Wystąpił błąd podczas pobierania danych klanu.",
        });
      }
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
