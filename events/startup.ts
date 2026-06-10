import { REST, Routes, type Client } from "discord.js";
import { commands } from "../static/static.js";

export class BlackoutBotStartup {
  constructor(private client: Client<boolean>) {}

  public async ClientStart(token: string | undefined) {
    this.client.login(token);
  }

  public async RegisterBlackoutBotStartup({ rest }: { rest: REST }) {
    this.client.on("ready", async () => {
      console.log(`Bot zalogowany jako ${this.client.user?.tag}!`);

      try {
        await rest.put(
          Routes.applicationGuildCommands(
            this.client.user!.id,
            String(process.env.GUILT_ID),
          ),
          { body: commands },
        );
        console.log("Komendy slash zarejestrowane!");
      } catch (error) {
        console.error(error);
      }
    });
  }
}
