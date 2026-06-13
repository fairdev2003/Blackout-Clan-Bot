import { SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("clan_id")
    .setDescription("Showing current id of blackout clan!"),
  new SlashCommandBuilder()
    .setName("nvidia")
    .setDescription("Download latest NVIDIA Drivers!"),
  new SlashCommandBuilder()
    .setName("clan-data")
    .setDescription("Get live data about Blackout Clan"),
  new SlashCommandBuilder()
    .setName("investigate")
    .setDescription("Check the chances of modded account.")
    .addIntegerOption((option) =>
      option
        .setName("user_id")
        .setDescription("Target account ID")
        .setRequired(true),
    ),
].map((cmd) => cmd.toJSON());

export class Commands {
  public static investigate = new SlashCommandBuilder()
    .setName("investigate")
    .setDescription("Check the chances of modded account.")
    .addIntegerOption((option) =>
      option
        .setName("user_id")
        .setDescription("Target account ID")
        .setRequired(true),
    );
}
