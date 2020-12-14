import { Message } from "discord.js";
import Bot from "../../Bot";
import { embedArgs } from "../../types";
import { getEmbed } from "../messages";

module.exports = {
	name: "prefix",
	description: "Set prefix for actual guild.",
	category: "settings",
	permissions: ["owner"],
	run: async (bot: Bot, message: Message, args: string[]) => {
		if (!message.guild?.id || args.length != 1 || args[0].length > 10) return;
        
		const prefix = args[0];

        let errMsg: string;

		await bot.setPrefix(message.guild?.id, args[0]).catch((err) => {
            errMsg = ``;
        });

        const embedArgs: embedArgs = {
            content: errMsg
        }

		message.channel.send(await getEmbed(args));
	},
};
