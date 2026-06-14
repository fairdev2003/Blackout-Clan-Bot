import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
  ClanValorHistory,
  PlayerData,
  PlayerInfo,
} from "../types/asteroid.js";

function findTopMember(data: ClanData): ClanMember | null {
  if (!data.members || data.members.length === 0) return null;

  return data.members.reduce((prev, current) => {
    return prev.valor > current.valor ? prev : current;
  });
}

function createValorHistoryEmbed(data: ClanValorHistory): EmbedBuilder {
  const history = data.history;

  // 1. Obliczamy statystyki
  const totalValor = history.reduce(
    (sum: number, h: any) => sum + h.valor_gained,
    0,
  );
  const avgCollectors = (
    history.reduce((sum: number, h: any) => sum + h.collectors, 0) /
    history.length
  ).toFixed(1);

  const bestPeriod = history.reduce((prev: any, current: any) =>
    prev.valor_gained > current.valor_gained ? prev : current,
  );

  const recentHistory = history
    .slice(-5)
    .reverse()
    .map((h: any) => {
      const date = new Date(h.period).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "numeric",
      });
      return `📅 ${date} | <:Team:1515803748784406640> ${h.collectors} | <:ClanValor:1515803723643879564> ${h.valor_gained.toLocaleString()}`;
    })
    .join("\n");

  const embed = new EmbedBuilder()
    .setTitle("<:Team:1515803748784406640> Income History")
    .setColor(0x0099ff)
    .addFields(
      {
        name: "<:ClanValor:1515803723643879564> Total Valor Gained",
        value: `**${totalValor.toLocaleString()}**`,
        inline: true,
      },
      {
        name: "<:Team:1515803748784406640> Avg Collectors",
        value: `**${avgCollectors}**`,
        inline: true,
      },
      {
        name: "🔥 Peak Performance",
        value: `**${bestPeriod.valor_gained.toLocaleString()}** <:ClanValor:1515803723643879564> from incomes\nat ${new Date(bestPeriod.period).toLocaleString("pl-PL")}`,
        inline: false,
      },
      { name: "🕒 Last 5 Records", value: recentHistory || "No data" },
    );
  embed
    .setFooter({
      text: "Blackout Asteroid Integration",
      iconURL: "https://asteroidpg3d.xyz/static/asteroid.gif",
    })
    .setTimestamp();

  return embed;
}

function createInvestigateEmbed(player: any): EmbedBuilder {
  const ID_THRESHOLD = 344553554;
  const isSuspicious = Number(player.id) > ID_THRESHOLD;
  const kills = player.info;
  const deaths = player.total_deaths;
  const kd = player.total_killrate;

  const embed = new EmbedBuilder()
    .setTitle(`🔍 Investigation: ${player.username}`)
    .setColor(isSuspicious ? 0xff0000 : 0x00ff00)
    .setTimestamp();

  embed.addFields({
    name: ":shield: Security Status",
    value: isSuspicious
      ? ":warning: **Suspicious Account**\nID exceeds the known safe range."
      : ":white_check_mark: **Legit Account**\nID is within the normal range.",
    inline: false,
  });

  embed.addFields(
    {
      name: ":bust_in_silhouette: Account",
      value: [
        `🆔 ID: ${player.id}`,
        `⭐ Level: ${player.level}`,
        `📅 Created: ${player.creation_date}`,
      ].join("\n"),
      inline: true,
    },
    {
      name: ":moneybag: Currency",
      value: [
        `💎 Gems: ${player.currency?.Gems ?? 0}`,
        `🪙 Coins: ${player.currency?.Coins ?? 0}`,
      ].join("\n"),
      inline: true,
    },
  );

  embed.addFields({
    name: ":bar_chart: Statistics",
    value: [
      `⚔️ Kills: ${player.stats.duel_wins?.toLocaleString?.() ?? "N/A"}`,
      `💀 Deaths: ${player.stats.total_deaths?.toLocaleString?.() ?? "N/A"}`,
      `📈 K/D: ${player.stats.total_killrate ?? "N/A"}`,
    ].join("\n"),
    inline: true,
  });

  embed.addFields({
    name: ":school_satchel: Collection",
    value: [
      `🔫 Weapons: ${player.weapons_count ?? 0}`,
      `🎯 Gadgets: ${player.gadgets_count ?? 0}`,
      `🐾 Pets: ${player.pets_count ?? 0}`,
      `📦 Sets: ${player.sets_count ?? "N/A"}`,
      `⚙️ Modules: ${player.modules_count ?? "N/A"}`,
    ].join("\n"),
    inline: false,
  });

  if (player.clan) {
    embed.addFields({
      name: ":european_castle: Clan",
      value: [
        `Name: ${player.clan.clanname ?? "None"}`,
        `Rank: ${player.clan.clanrank ?? "Unknown"}`,
      ].join("\n"),
      inline: false,
    });
  }

  if (player.stats_30d || player.last30d) {
    const s = player.stats_30d ?? player.last30d;

    embed.addFields({
      name: ":date: Last 30 Days",
      value: [
        `⚔️ Kills: ${s.kills ?? "N/A"}`,
        `💀 Deaths: ${s.deaths ?? "N/A"}`,
        `📈 K/D: ${s.kd ?? "N/A"}`,
        `🏆 Wins: ${s.wins ?? "N/A"}`,
      ].join("\n"),
      inline: false,
    });
  }

  embed.setFooter({
    text: "Blackout Asteroid Integration",
    iconURL: "https://asteroidpg3d.xyz/static/asteroid.gif",
  });

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

  private clanCache: { data: ClanData; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minut w milisekundach

  private allowedRoles = [
    "1513999998638096514", // server head
    "1513971700776042589", // leader
    "1513971609948524565", // co-leader
    "1513967750610026496", // admin
    "1513971206599086233", // clan officer
  ];

  private async InteractionCommands(interaction: Interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === "clan_members") {
        if (!this.clanCache) {
          return await interaction.reply({
            content: "❌ Cache expired. Use the `/clan-data` command again.",
            ephemeral: true,
          });
        }

        const members = this.clanCache.data.members;

        const memberList = members
          .sort((a, b) => b.valor - a.valor)
          .map(
            (m, index) =>
              `${index + 1}. **${m.name}** - Valor: ${m.valor.toLocaleString()}`,
          )
          .join("\n");

        const embed = new EmbedBuilder()
          .setTitle(`🏰 Clan Members (${members.length}/50)`)
          .setDescription(
            memberList.length > 4096 ? "List too long to display." : memberList,
          )
          .setColor(0x8b0000)
          .setTimestamp()
          .setFooter({
            text: "Blackout Asteroid Integration",
            iconURL: "https://asteroidpg3d.xyz/static/asteroid.gif",
          });

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      // ----- VALOR HISTORY ---------
      if (interaction.customId === "income_history") {
        if (!this.clanCache) {
          return await interaction.reply({
            content: "❌ Cache expired. Use the `/clan-data` command again.",
            ephemeral: true,
          });
        }
        await interaction.deferReply();

        try {
          const response: AxiosResponse<ClanValorHistory> = await axios.get(
            `https://api.klimson.dev/pg3d/clan/valor_history/${this.clanCache.data.clan_info.clan_id}`,
          );

          const embed = createValorHistoryEmbed(response.data);

          await interaction.editReply({ embeds: [embed] });
        } catch (error) {
          console.log(error);
          await interaction.editReply({
            content: String(error),
          });
        }
      }
      // ----- VALOR HISTORY ---------
    }

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "purge") {
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

      const amount = interaction.options.getInteger("amount")!;

      if (amount < 1 || amount > 100) {
        return await interaction.reply({
          content: "You can only delete between 1 and 100 messages at once.",
          ephemeral: true,
        });
      }

      try {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel;

        if (channel && channel.isTextBased() && "bulkDelete" in channel) {
          const deleted = await channel.bulkDelete(amount, true);

          await interaction.editReply({
            content: `✅ Successfully deleted ${deleted.size} messages.`,
          });
        } else {
          await interaction.editReply({
            content: "❌ I cannot delete messages in this type of channel.",
          });
        }
      } catch (error) {
        console.error(error);
        await interaction.editReply({
          content:
            "An error occurred while deleting messages. Please note that I cannot delete messages older than 14 days.",
        });
      }
    }
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
        // Sprawdź czy mamy dane w cache i czy są świeże
        if (
          !this.clanCache ||
          Date.now() - this.clanCache.timestamp > this.CACHE_DURATION
        ) {
          const response = await axios.get(
            "https://api.klimson.dev/pg3d/clan_info/31259536",
          );
          this.clanCache = { data: response.data, timestamp: Date.now() };
        }

        const clanData = this.clanCache.data;
        const embed = createClanEmbed(clanData);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("clan_members")
            .setLabel("Clan members")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("1515803748784406640"),
          new ButtonBuilder()
            .setCustomId("income_history")
            .setLabel("Income History")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("1515803723643879564"),
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
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
