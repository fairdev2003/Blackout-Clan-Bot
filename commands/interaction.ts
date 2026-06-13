import {
  ActionRowBuilder,
  EmbedBuilder,
  GuildMember,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
  type Client,
  type Interaction,
} from "discord.js";
import { BlackoutBotEvents, ClanInfo } from "../static/static.js";
import axios, { Axios, type AxiosResponse } from "axios";
import type {
  ClanData,
  ClanMember,
  PlayerData,
  PlayerInfo,
} from "../types/asteroid.js";

function findTopMember(data: ClanData): ClanMember | null {
  if (!data.members || data.members.length === 0) return null;

  return data.members.reduce((prev, current) => {
    return prev.valor > current.valor ? prev : current;
  });
}

function createInvestigateEmbed(player: PlayerInfo): EmbedBuilder {
  const ID_THRESHOLD = 344553554;
  const isSuspicious = parseInt(player.id) > ID_THRESHOLD;

  const embed = new EmbedBuilder()
    .setTitle(`🔍 Investigation: ${player.username}`)
    .setColor(isSuspicious ? 0xff0000 : 0x00ff00)
    .setTimestamp();

  // Dodajemy pole z oceną bezpieczeństwa
  embed.addFields({
    name: "🛡️ Security Status",
    value: isSuspicious
      ? "⚠️ **Suspicious Account**\nID exceeds the known safe range, suggesting potential modifications."
      : "✅ **Legit Account**\nID is within the normal range.",
    inline: false,
  });

  // Główne informacje
  embed.addFields(
    {
      name: "👤 Player Info",
      value: `**ID:** ${player.id}\n**Level:** ${player.level}\n**Created:** ${player.creation_date}`,
      inline: true,
    },
    {
      name: "💰 Currency",
      value: `**Gems:** ${player.currency.Gems ?? 0}\n**Coins:** ${player.currency.Coins ?? 0}`,
      inline: true,
    },
  );

  // Dodajemy informacje o klanie, jeśli istnieje
  if (player.clan) {
    embed.addFields({
      name: "🏰 Clan",
      value: `**${player.clan.clanname}** (Rank: ${player.clan.clanrank})`,
      inline: false,
    });
  }

  // Statystyki broni/ekwipunku
  embed.addFields({
    name: "📊 Stats",
    value: `**Weapons:** ${player.weapons_count}\n**Gadgets:** ${player.gadgets_count}\n**Pets:** ${player.pets_count}`,
    inline: false,
  });

  embed.setFooter({ text: "Blackout Asteroid Investigation System" });

  return embed;
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

  private allowedRoles = [
    "1513999998638096514", // server head
    "1513971700776042589", // leader
    "1513971609948524565", // co-leader
    "1513967750610026496", // admin
    "1513971206599086233", // clan officer
  ];

  private investigate = new SlashCommandBuilder()
    .setName("investigate")
    .setDescription("Check the chances of modded account.")
    .addIntegerOption((option) =>
      option
        .setName("user_id")
        .setDescription("Target account ID")
        .setRequired(true),
    );

  private async InteractionCommands(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "clan_id") {
      await interaction.reply(ClanInfo.CLAN_ID);
    }

    if (interaction.commandName === "nvidia") {
      await interaction.reply(ClanInfo.NVIDIA_LINK);
    }

    if (interaction.commandName === "investigate") {
      const member = interaction.member as GuildMember;

      const hasRole = this.allowedRoles.some((roleId) =>
        member?.roles.cache.has(roleId),
      );

      if (!hasRole) {
        return await interaction.reply({
          content: "❌ No permissions",
          ephemeral: true,
        });
      }
      const user_id = interaction.options.getInteger("user_id");

      await interaction.deferReply();

      try {
        const response: AxiosResponse<PlayerData> = await axios.get(
          `https://api.klimson.dev/pg3d/player_data/${user_id}`,
        );
        const playerData: PlayerInfo = response.data.info;
        const embed = createInvestigateEmbed(playerData);

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(error);
        await interaction.editReply({
          content: String(error),
        });
      }
    }

    if (interaction.commandName === "clan-data") {
      const member = interaction.member as GuildMember;

      const hasRole = this.allowedRoles.some((roleId) =>
        member?.roles.cache.has(roleId),
      );

      if (!hasRole) {
        return await interaction.reply({
          content: "❌ No permissions",
          ephemeral: true,
        });
      }
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
