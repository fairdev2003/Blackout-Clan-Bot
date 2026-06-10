import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    name: "clan_id",
    description: "Showing current id of blackout clan!",
  },
  {
    name: "nvidia",
    description: "Download latest NVIDIA Drivers!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

client.on("ready", async () => {
  console.log(`Bot zalogowany jako ${client.user?.tag}!`);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        client.user!.id,
        String(process.env.GUILT_ID),
      ),
      { body: commands },
    );
    console.log("Komendy slash zarejestrowane!");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "clan_id") {
    await interaction.reply("31259536");
  }
  if (interaction.commandName === "nvidia") {
    await interaction.reply(
      "https://www.nvidia.com/Download/index.aspx?utm_source=chatgpt.com",
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
