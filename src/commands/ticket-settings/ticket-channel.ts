import Bot from "../../Bot";
import { Message } from "discord.js";
import { embedArgs } from "../../types";
import { getEmbed } from "../messages";

module.exports = {
	name: "ticket-channel",
	description: "Set ticket channel for actual guild.",
	category: "ticket-settings",
	permissions: ["owner"],
	run: async (bot: Bot, message: Message, args: string[]): Promise<void> => {
		if (!message.guild?.id || args.length != 1 || !args[0].match(/^\d{18}$/g)) return;

		const ticket_channel = args[0];

		let tryFindChannel = message.guild.channels.cache.find((channel) => channel.type === "text" && channel.id === ticket_channel);

		const embedMsg: embedArgs = {
			title: "Ticket-channel",
			content: `${tryFindChannel ? `Ticket category changed to ${tryFindChannel.name}` : `Channel with this ID wasn't found.`}`,
			color: `${tryFindChannel ? `YELLOW` : `RED`}`,
			footer: `Requested by ${message.author.tag} on ${message.guild.name}.`,
		};

		if (tryFindChannel) {
			await bot.setTicketReactionChannel(message.guild.id, ticket_channel).catch((err) => {
				embedMsg.color = "RED";
				embedMsg.content = `ERROR: ${err}`;
			});
		}

		message.channel.send(await getEmbed(embedMsg));
	},
};
