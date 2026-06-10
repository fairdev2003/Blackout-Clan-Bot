import { REST, type Client } from "discord.js";
export declare class BlackoutBotStartup {
    private client;
    constructor(client: Client<boolean>);
    ClientStart(token: string | undefined): Promise<void>;
    RegisterBlackoutBotStartup({ rest }: {
        rest: REST;
    }): Promise<void>;
}
//# sourceMappingURL=startup.d.ts.map