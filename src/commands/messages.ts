import { MessageEmbed } from "discord.js";
import { embedArgs } from "../types";

export async function getEmbed(args: embedArgs): Promise<MessageEmbed> {
    if (!args.title) args.title = "DEFAULT_TITLE";
    if (!args.color) args.color = 'blue';
    if (!args.footer) args.footer = "DEFAULT_FOOTER";

    const embed: MessageEmbed = new MessageEmbed().setTitle(args.title).setDescription(args.content).setColor(args.color).setFooter(args.footer).setTimestamp();

    return embed;
}