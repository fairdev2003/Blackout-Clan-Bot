import type { Client } from "discord.js";
import { BlackoutBotStartup } from "./events/startup.js";
import { InteractionEvent } from "./commands/interaction.js";
import { Security } from "./events/security.js";
import { AutoRole } from "./events/auto-role.js";
import { TaskCompletion } from "./events/task-completion.js";

export class BlackoutBot {
  constructor(private client: Client) {}

  public get startup() {
    return new BlackoutBotStartup(this.client);
  }

  public get interaction() {
    return new InteractionEvent(this.client);
  }

  public get security() {
    return new Security(this.client);
  }

  public get auto_role() {
    return new AutoRole(this.client);
  }

  public get task_completion() {
    return new TaskCompletion(this.client);
  }
}
