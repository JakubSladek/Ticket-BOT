import { MessageEmbed } from "discord.js";
import { embedArgs } from "../types";

/**
 * Message arguments
 * @param args 
 */
export async function getEmbed(args: embedArgs): Promise<MessageEmbed> {
    const embed: MessageEmbed = new MessageEmbed();

    return embed;
}