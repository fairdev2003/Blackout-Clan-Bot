import type { ColorResolvable } from "discord.js";

export type BlackoutEmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

export type BlackoutEmbedInstance = {
  title: string;
  footer: string;
  description: string;
  color: ColorResolvable;
  fields: BlackoutEmbedField[];
};
