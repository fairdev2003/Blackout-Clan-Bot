import axios, { type AxiosResponse } from "axios";
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
        message.author.id === message.guild?.ownerId;

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
      "00 10 * * *",
      async () => {
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
        const dayNumber = today.getDay();
        const dayName = daysOfWeek[dayNumber];
        const channelId = this.task_completion_channel_id;
        const channel = await this.client.channels.fetch(channelId);

        if (channel && channel.type === ChannelType.GuildText) {
          const response: AxiosResponse<{ key: string; value: string }> =
            await axios.get(
              "https://api.klimson.dev/context_storage/public/single/war_start",
            );

          console.log(response.data.value);
          console.log(typeof response.data.value);

          if (dayNumber === 1) {
            console.log("Not a war day");
            return;
          }

          if (Number(response.data.value) === 3) {
            console.log("Late register");
            if (dayNumber === 2) {
              return;
            }
          }

          try {
            // const fetched = await channel.messages.fetch({ limit: 100 });

            // await channel.bulkDelete(fetched, true);

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
