import { REST, Routes } from "discord.js";
import { BlackoutBotEvents, commands } from "../static/static.js";
export class BlackoutBotStartup {
    client;
    constructor(client) {
        this.client = client;
    }
    async ClientStart(token) {
        this.client.login(token);
    }
    async RegisterBlackoutBotStartup({ rest }) {
        this.client.on(BlackoutBotEvents.BOT_READY, async () => {
            console.log(`Bot logged in as ${this.client.user?.tag}!`);
            try {
                await rest.put(Routes.applicationGuildCommands(this.client.user.id, String(process.env.GUILT_ID)), { body: commands });
                console.log("Slash command registered!");
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
//# sourceMappingURL=startup.js.map