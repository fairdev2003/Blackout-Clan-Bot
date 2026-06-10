import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { Channel } from "node:diagnostics_channel";
import type { BlackoutEmbedInstance } from "../types/blackout.js";

export class BlackoutEmbed {
  public static async SendBaseEmbed(
    client: Client,
    channelId: string,
    embed: BlackoutEmbedInstance,
  ) {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;
    if (channel instanceof TextChannel) {
      const embed_instance = new EmbedBuilder()
        .setColor(embed.color)
        .setTitle(embed.title)
        .setDescription(embed.description)
        .addFields(...embed.fields)
        .setTimestamp()
        .setFooter({ text: embed.footer });

      await channel.send({ embeds: [embed_instance] });
    }
  }
}
