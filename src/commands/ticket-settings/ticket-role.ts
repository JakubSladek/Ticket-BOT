import Bot from "../../Bot";
import { Message } from "discord.js";
import { embedArgs } from "../../types";
import { getEmbed } from "../messages";

module.exports = {
	name: "ticket-role",
	description: "Set ticket support role for actual guild.",
	category: "ticket-settings",
	permissions: ["owner"],
	run: async (bot: Bot, message: Message, args: string[]): Promise<void> => {
		if (!message.guild?.id || args.length != 1 || !args[0].startsWith("<@") || !args[0].endsWith(">")) return;

		let mentionRole = args[0];

		mentionRole = mentionRole.slice(2, -1);

		if (mentionRole.startsWith("!")) mentionRole = mentionRole.slice(1);

		let getRole = message.guild.roles.cache.get(mentionRole);

		const embedMsg: embedArgs = {
			title: "Ticket-role",
			content: `${getRole ? `Ticket support role changed to ${getRole.name}` : `Role wasn't found.`}`,
			color: `${getRole ? `YELLOW` : `RED`}`,
			footer: `Requested by ${message.author.tag} on ${message.guild.name}.`,
		};

		if (getRole) {
			await bot.setTicketSupportRole(message.guild.id, getRole.id).catch((err) => {
				embedMsg.color = "RED";
				embedMsg.content = `ERROR: ${err}`;
			});
		}

		message.channel.send(await getEmbed(embedMsg));
	},
};
