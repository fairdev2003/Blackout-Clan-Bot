import { EmbedBuilder, TextChannel, type Client } from "discord.js";
import type { AutoRoleBundle } from "./types/autorole.types.js";

export class AutoRole {
  constructor(private client: Client) {}

  public async RegisterTaskHelperAutoRole(channelId: string, roleId: string) {
    const channel = await this.client.channels.fetch(channelId);

    if (!(channel instanceof TextChannel)) return;

    const messages = await channel.messages.fetch({ limit: 1 });

    if (messages.size === 0) {
      const embed = new EmbedBuilder()
        .setTitle("🤝 Task Helper Role")
        .setDescription("React to get your task helper role!")
        .addFields({
          name: "Role Explaination",
          value:
            "Users with this role can see clan members pings about new help tasks and access ticketing system",
        })
        .setColor(0x00ff00);

      const sentMessage = await channel.send({ embeds: [embed] });

      await sentMessage.react("1514046881016320090");
    }

    this.client.on("messageReactionAdd", async (reaction, user) => {
      if (user.bot) return;

      console.log("Reacted!");

      const guild = reaction.message.guild;
      if (!guild) return;

      if (
        reaction.message.channel.id === channelId &&
        reaction.emoji.name === "blackout"
      ) {
        const guild = reaction.message.guild;
        if (!guild) return;

        const member = await guild.members.fetch(user.id);
        const role = await guild.roles.fetch(roleId);

        if (role && member.manageable) {
          await member.roles.add(role);
          console.log(`Nadano rolę ${role.name} użytkownikowi ${user.tag}`);
        }
      }
    });
  }

  public async RegisterCommmunityAutoRole(channelId: string, roleId: string) {
    const channel = await this.client.channels.fetch(channelId);

    if (!(channel instanceof TextChannel)) return;

    const messages = await channel.messages.fetch({ limit: 1 });

    if (messages.size === 0) {
      const embed = new EmbedBuilder()
        .setTitle("🤝 Join our community")
        .setDescription(
          "React to access Community role and hang out with other members!",
        )

        .setColor(0x00ff00);

      const sentMessage = await channel.send({ embeds: [embed] });

      await sentMessage.react("1514046881016320090");
    }

    this.client.on("messageReactionAdd", async (reaction, user) => {
      if (user.bot) return;

      console.log(`${user.globalName} Reacted!`);

      const guild = reaction.message.guild;
      if (!guild) return;

      if (
        reaction.message.channel.id === channelId &&
        reaction.emoji.name === "blackout"
      ) {
        const guild = reaction.message.guild;
        if (!guild) return;

        const member = await guild.members.fetch(user.id);
        const role = await guild.roles.fetch(roleId);

        if (role && member.manageable) {
          await member.roles.add(role);
          console.log(`Nadano rolę ${role.name} użytkownikowi ${user.tag}`);
        }
      }
    });
  }

  public async RegisterAutoRoleBundle(bundle: AutoRoleBundle) {
    this.RegisterTaskHelperAutoRole(
      bundle["task-helper"].channelId,
      bundle["task-helper"].roleId,
    );

    this.RegisterCommmunityAutoRole(
      bundle["community"].channelId,
      bundle["community"].roleId,
    );
  }
}
