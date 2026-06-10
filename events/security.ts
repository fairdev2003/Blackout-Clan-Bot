import {
  AuditLogEvent,
  ChannelType,
  TextChannel,
  type Client,
} from "discord.js";
import { channels } from "../static/static.js";
import { BlackoutEmbed } from "../templates/embed.js";

export class Security {
  constructor(private client: Client) {}

  public async RegisterSecurity() {
    await this.RegisterChannelCreateLog();
    await this.RegisterChannelDeleteLog();
  }

  public async RegisterChannelCreateLog() {
    this.client.on("channelCreate", async (channel) => {
      if (channel.type !== ChannelType.GuildText) return;

      try {
        const auditLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
        });

        const entry = auditLogs.entries.first();

        if (entry && entry.targetId === channel.id) {
          const executor = entry.executor;

          await BlackoutEmbed.SendBaseEmbed(
            this.client,
            channels["channel-logs"].ID,
            {
              color: 0x0099ff,
              title: "New channel created",
              description: `📢 User **${executor?.tag}** created a new channel!`,
              fields: [
                { name: "Channel Name", inline: true, value: channel.name },
              ],
              footer: "Blackout Security Manager",
            },
          );
        }
      } catch (error) {
        console.error("Błąd podczas pobierania audit log:", error);
      }
    });
  }

  public async RegisterChannelDeleteLog() {
    this.client.on("channelDelete", async (channel) => {
      if (channel.type !== ChannelType.GuildText) return;

      try {
        const auditLogs = await channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
        });

        const entry = auditLogs.entries.first();

        if (entry && entry.targetId === channel.id) {
          const executor = entry.executor;

          await BlackoutEmbed.SendBaseEmbed(
            this.client,
            channels["channel-logs"].ID,
            {
              color: 0x0099ff,
              title: "Channel deleted",
              description: `📢 User **${executor?.tag}** deleted a channel`,
              fields: [
                { name: "Channel Name", inline: true, value: channel.name },
              ],
              footer: "Blackout Security Manager",
            },
          );
        }
      } catch (error) {
        console.error("Błąd podczas pobierania audit log:", error);
      }
    });
  }
}
