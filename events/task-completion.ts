import { ChannelType, type Client } from "discord.js";
import cron from "node-cron";

export class TaskCompletion {
  constructor(private client: Client) {}

  private rolesToIgnore = [
    "1513971700776042589", // leader
  ];

  private task_completion_channel_id = "1513983081944580216";

  public RegisterTaskCompletionNoMessagesRule() {
    this.client.on("messageCreate", async (message) => {
      if (
        message.channel.id !== this.task_completion_channel_id ||
        message.author.bot
      )
        return;

      const userRoleIds =
        message.member?.roles.cache.map((role) => role.id) || [];

      const isIgnored =
        userRoleIds.some((roleId) => this.rolesToIgnore.includes(roleId)) ||
        message.author.id === message.guild?.ownerId ||
        !!message.reference;

      if (isIgnored) return;

      if (message.attachments.size === 0) {
        await message.delete().catch(console.error);
      } else {
        await message.react("1515893093805719712");
      }
    });
  }

  public async RegisterTaskChannelClear() {
    console.log("registered cron job");
    cron.schedule(
      "0 10 * * *",
      async () => {
        const channelId = this.task_completion_channel_id;
        const channel = await this.client.channels.fetch(channelId);

        if (channel && channel.type === ChannelType.GuildText) {
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          const today = new Date();
          const dayName = daysOfWeek[today.getDay()];

          try {
            const fetched = await channel.messages.fetch({ limit: 100 });

            await channel.bulkDelete(fetched, true);

            await channel.send(`📅 **New Day - ${dayName}**`);

            console.log(`Successfully cleared channel: ${channel.name}`);
          } catch (error) {
            console.error("Error while clearing the channel:", error);
          }
        }
      },
      {
        timezone: "Europe/Warsaw",
      },
    );
  }
}
