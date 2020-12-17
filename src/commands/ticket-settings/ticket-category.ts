import Bot from "../../Bot";
import { Message } from "discord.js";
import { embedArgs } from "../../types";
import { getEmbed } from "../messages";

module.exports = {
	name: "ticket-category",
	description: "Set ticket category for actual guild.",
	category: "ticket-settings",
	permissions: ["owner"],
	run: async (bot: Bot, message: Message, args: string[]) : Promise<void> => {
		if (!message.guild?.id || args.length != 1 || !args[0].match(/^\d{18}$/g)) return;
		
		const ticket_category = args[0];
		
		let tryFindCategory = message.guild.channels.cache.find(category => category.type === "category" && category.id === ticket_category);
		
		const embedMsg: embedArgs = {
			title: "Ticket-category",
			content: `${tryFindCategory ? `Ticket category changed to ${tryFindCategory.name}` : `Category with this ID wasn't found.`}`,
			color: `${tryFindCategory ? `YELLOW` : `RED`}`,
			footer: `Requested by ${message.author.tag} on ${message.guild.name}.`,
		};

		if (tryFindCategory) {
			await bot.setTicketCategory(message.guild.id, ticket_category).catch(err => {
				embedMsg.color = "RED";
				embedMsg.content = `ERROR: ${err}`;
			});
		}

		message.channel.send(await getEmbed(embedMsg));
	},
};
