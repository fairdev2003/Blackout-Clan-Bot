import { BlackoutBotStartup } from "./events/startup.js";
import { InteractionEvent } from "./commands/interaction.js";
import { Security } from "./events/join.event.js";
export class BlackoutBot {
    client;
    constructor(client) {
        this.client = client;
    }
    get startup() {
        return new BlackoutBotStartup(this.client);
    }
    get interaction() {
        return new InteractionEvent(this.client);
    }
    get security() {
        return new Security(this.client);
    }
}
//# sourceMappingURL=blackout.js.map