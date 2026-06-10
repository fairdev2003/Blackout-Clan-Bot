import { ChannelType, TextChannel } from "discord.js";
export class Security {
    client;
    constructor(client) {
        this.client = client;
    }
    async SendMessage(channelId, message) {
        const channel = await this.client.channels.fetch(channelId);
        if (channel instanceof TextChannel) {
            await channel.send(message);
        }
        else {
            console.error("Podany kanał nie istnieje lub nie jest kanałem tekstowym.");
        }
    }
    async RegisterSecurity() {
        this.client.on("channelCreate", async (channel) => {
            if (channel.type === ChannelType.GuildText) {
                await this.SendMessage("1514089293814042634", "Someone just created new channel");
            }
            else {
                console.log(`Stworzono kanał typu ${channel.type}, który nie obsługuje wiadomości.`);
            }
        });
    }
}
//# sourceMappingURL=join.event.js.map