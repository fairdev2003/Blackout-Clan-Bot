import type { Client } from "discord.js";
import { BlackoutBotStartup } from "./events/startup.js";
import { InteractionEvent } from "./commands/interaction.js";
import { Security } from "./events/security.ts";
export declare class BlackoutBot {
  private client;
  constructor(client: Client);
  get startup(): BlackoutBotStartup;
  get interaction(): InteractionEvent;
  get security(): Security;
}
//# sourceMappingURL=blackout.d.ts.map
