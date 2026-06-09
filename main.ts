import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    name: "ping",
    description: "Sprawdza czy bot żyje!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

client.on("ready", async () => {
  console.log(`Bot zalogowany jako ${client.user?.tag}!`);

  try {
    await rest.put(Routes.applicationCommands(client.user!.id), {
      body: commands,
    });
    console.log("Komendy slash zarejestrowane!");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong! 🏓");
  }
});

client.login(process.env.DISCORD_TOKEN);
