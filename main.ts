import { Client, REST } from "discord.js";
import * as dotenv from "dotenv";
import {
  blackout_bot_config,
  BotInfo,
  channels,
  roles,
} from "./static/static.js";
import { BlackoutBot } from "./blackout.js";
import { autorole_instance } from "./static/autorole.static.js";
dotenv.config();

const client = new Client(blackout_bot_config);
const rest = new REST({ version: BotInfo.API_VERSION }).setToken(
  process.env.DISCORD_TOKEN!,
);

const blkt_bot = new BlackoutBot(client);

blkt_bot.startup.RegisterBlackoutBotStartup({ rest });
blkt_bot.interaction.RegisterInteractionCommands();
blkt_bot.security.RegisterSecurity();
// blkt_bot.auto_role.RegisterAutoRoleBundle(
//   channels["auto-role"].ID,
//   roles["task-helper"].ID,
// );

client.once("ready", () => {
  blkt_bot.auto_role.RegisterAutoRoleBundle(autorole_instance);
});

blkt_bot.startup.ClientStart(process.env.DISCORD_TOKEN);
