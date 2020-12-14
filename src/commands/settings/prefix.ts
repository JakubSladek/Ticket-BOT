import { Message } from "discord.js";
import Bot from "../../Bot";
import { embedArgs } from "../../types";
import { getEmbed } from "../messages";

module.exports = {
	name: "prefix",
	description: "Set prefix for actual guild.",
	category: "settings",
	permissions: ["owner"],
	run: async (bot: Bot, message: Message, args: string[]) : Promise<void> => {
		if (!message.guild?.id || args.length != 1 || args[0].length === 0 || args[0].length > 10) return;

		const prefix = args[0];
		
		const embedMsg: embedArgs = {
			title: "Prefix",
			content: `Prefix successfully changed to '${prefix}'`,
			color: 'YELLOW',
			footer: `Requested by ${message.author.tag} on ${message.guild.name}.`,
		};

		await bot.setPrefix(message.guild?.id, prefix).catch((err) => {
			embedMsg.content = err;
			embedMsg.color = 'RED';
		});

		message.channel.send(await getEmbed(embedMsg));
	},
};
