import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("clan_id")
    .setDescription("Showing current id of blackout clan!"),
  new SlashCommandBuilder()
    .setName("joe363")
    .setDescription("Jedna krecha i łeb masz zajebany."),
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
  new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Bulk delete messages")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Messages amount to delete (1-100)")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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
