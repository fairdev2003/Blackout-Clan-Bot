import { REST, Routes, type Client } from "discord.js";
import { BlackoutBotEvents } from "../static/static.js";
import { commands } from "../commands/commands.js";

export class BlackoutBotStartup {
  constructor(private client: Client<boolean>) {}

  public async ClientStart(token: string | undefined) {
    this.client.login(token);
  }

  public async RegisterBlackoutBotStartup({ rest }: { rest: REST }) {
    this.client.on(BlackoutBotEvents.BOT_READY, async () => {
      console.log(`Bot logged in as ${this.client.user?.tag}!`);

      try {
        await rest.put(
          Routes.applicationGuildCommands(
            this.client.user!.id,
            String(process.env.GUILT_ID),
          ),
          { body: commands },
        );
        console.log("Slash command registered!");
      } catch (error) {
        console.error(error);
      }
    });
  }
}
